# Architecture Review: Next.js Blog + Portfolio Website

**Date**: 2026-02-15
**Reviewer**: Architecture Subagent (Opus 4.6)
**Scope**: apps/web/ - Next.js 16 SSG blog + portfolio site

---

## Summary

Overall the implementation is solid and follows Next.js 16 App Router conventions well. The async params pattern is correctly applied, SSG static export is compatible, and the build pipeline (prebuild RSS, postbuild sitemap) is properly sequenced. Key areas for improvement are content loading efficiency, missing SEO features from the design doc, and dark mode CSS inconsistencies.

---

## Findings

### 1. Content Loading Inefficiency - Redundant File Reads

**Severity**: Medium

**Description**: `getAllTags()` in `content.ts` (line 115-126) calls both `getBlogPosts()` and `getProjects()`, each of which reads all markdown files from disk. When `tags/[tag]/page.tsx` calls `getAllTags()` in `generateStaticParams()` and then calls `getBlogPosts()` again in the page component, all blog files are read 2-3 times per tag page build.

Similarly, `generateMetadata()` and the page component in `blog/[slug]/page.tsx` both call `getBlogPost(slug)`, reading and parsing the same file twice per page.

**Recommended action**:
- Add a simple module-level cache (Map) for `getBlogPosts()` and `getProjects()` since these are called during build time (Node.js process persists across pages during `next build`).
- Alternatively, use React's `cache()` from `react` for the async functions (`getBlogPost`, `getProject`) to deduplicate within a single request.

```typescript
import { cache } from "react";
export const getBlogPost = cache(async (slug: string): Promise<BlogPost | null> => { ... });
```

### 2. Missing Open Graph / Twitter Card Meta Tags

**Severity**: Medium

**Description**: DESIGN.md specifies "Open Graph and Twitter Card meta tags" as part of the SEO strategy, but the current metadata exports in page components only include `title` and `description`. No `openGraph` or `twitter` fields are set in any `generateMetadata()` or the root layout's metadata.

**Recommended action**: Add OG and Twitter metadata to the root layout (defaults) and per-page metadata:

```typescript
// layout.tsx metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://example.com'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// blog/[slug]/page.tsx generateMetadata
openGraph: {
  title: post.title,
  description: post.description,
  type: 'article',
  publishedTime: post.date,
},
```

### 3. JsonLd Component Exists but Is Never Used

**Severity**: Medium

**Description**: `JsonLd.tsx` is well-implemented with BlogPosting and Person schema support, matching the DESIGN.md plan for "JSON-LD structured data (BlogPosting, Person)". However, it is not imported or rendered in any page component (blog post pages, about page, etc.).

**Recommended action**:
- Add `<JsonLd type="BlogPosting" ... />` to `blog/[slug]/page.tsx`
- Add `<JsonLd type="Person" ... />` to `about/page.tsx`

### 4. RSS Feed Link Not in HTML Head

**Severity**: Low

**Description**: The RSS feed is generated correctly via `prebuild` script to `public/feed.xml`, but there is no `<link rel="alternate" type="application/rss+xml">` in the HTML head. RSS readers that auto-discover feeds from HTML will not find it.

**Recommended action**: Add to root layout metadata:

```typescript
alternates: {
  types: {
    'application/rss+xml': '/feed.xml',
  },
},
```

### 5. Dark Mode CSS Defined but Not Supported in Components

**Severity**: Low

**Description**: `globals.css` defines dark mode CSS variables via `@media (prefers-color-scheme: dark)`, but all component markup uses hardcoded light-mode colors (e.g., `text-gray-900`, `bg-white`, `border-gray-200`). The dark mode variables are only applied to `body` background/foreground but the Tailwind classes override them.

**Recommended action**: Either:
- (a) Remove the dark mode CSS variables to avoid confusion, or
- (b) Implement proper dark mode with Tailwind's `dark:` variant classes throughout all components

### 6. Footer `new Date().getFullYear()` in Server Component

**Severity**: Low

**Description**: `Footer.tsx` is a server component that calls `new Date().getFullYear()`. With `output: 'export'`, this is evaluated at build time and baked into static HTML. The year will be correct at build time but won't update until the next build. This is acceptable for SSG but worth noting.

**Recommended action**: This is fine for SSG. No action needed unless dynamic year display is critical.

### 7. `process.cwd()` Path Resolution for articles/

**Severity**: Low

**Description**: `content.ts` uses `path.join(process.cwd(), "..", "..", "articles")` to reach the shared `articles/` directory. This works when `next build` is run from `apps/web/`, but is fragile if the working directory changes (e.g., running from the monorepo root).

**Recommended action**: Consider using `__dirname` or an environment variable for more robust path resolution:

```typescript
const ARTICLES_DIR = path.resolve(__dirname, "..", "..", "..", "..", "articles");
// Or use an env var
const ARTICLES_DIR = process.env.ARTICLES_DIR || path.join(process.cwd(), "..", "..", "articles");
```

### 8. Tag Page Only Shows Blog Posts, Not Projects

**Severity**: Low

**Description**: `tags/[tag]/page.tsx` filters only `getBlogPosts()` by tag. Projects also have tags (defined in frontmatter and the `Project` interface), but they are not shown on tag pages. `getAllTags()` collects tags from both blog posts and projects, so clicking a project-only tag leads to a page showing "0 posts found".

**Recommended action**: Include projects in tag page results, or exclude project tags from `generateStaticParams()`.

### 9. `html lang="en"` Should Be `"ja"` for Japanese Content

**Severity**: Low

**Description**: The root layout sets `<html lang="en">` but the DESIGN.md and RSS feed indicate the site content is in Japanese (`<language>ja</language>` in RSS). If the site content will be primarily Japanese, the lang attribute should reflect this.

**Recommended action**: Change to `<html lang="ja">` or make it configurable.

### 10. DESIGN.md Lists SEO.tsx Component but It Does Not Exist

**Severity**: Low

**Description**: DESIGN.md project structure lists `components/SEO.tsx` but this file was not created. Its functionality appears to be covered by Next.js Metadata API and JsonLd.tsx, so it may not be needed.

**Recommended action**: Remove `SEO.tsx` from DESIGN.md or create it if additional meta tag management is planned.

### 11. No `not-found.tsx` Custom 404 Page

**Severity**: Low

**Description**: The blog/[slug] and projects/[slug] pages correctly call `notFound()` when content is missing, but there is no custom `app/not-found.tsx` to provide a styled 404 page. Users will see the default Next.js 404.

**Recommended action**: Create `src/app/not-found.tsx` with a styled page matching the site design.

### 12. Tailwind v4 Usage Is Correct

**Severity**: N/A (Positive finding)

**Description**: The project correctly uses Tailwind CSS v4 with `@import "tailwindcss"` syntax and `@theme inline` block. The `@tailwindcss/postcss` package is properly configured as a dev dependency.

### 13. Next.js 16 Async Params Pattern Is Correct

**Severity**: N/A (Positive finding)

**Description**: All dynamic route pages correctly type `params` as `Promise<{ slug: string }>` and use `await params` - this is the correct Next.js 15+/16 pattern.

### 14. Static Export Compatibility Is Good

**Severity**: N/A (Positive finding)

**Description**: No incompatible features detected:
- `output: 'export'` is set
- `images.unoptimized: true` correctly disables Image Optimization API
- All dynamic routes have `generateStaticParams()`
- No API routes, middleware, or server actions
- `notFound()` works with static export as long as `generateStaticParams` covers all paths

---

## DESIGN.md Completion Status

| Task | Status | Notes |
|------|--------|-------|
| 1. Initialize Next.js with SSG | Done | |
| 2. Configure Tailwind CSS | Done | v4 correctly configured |
| 3. Shared articles/ directory | Done | With sample content |
| 4. Markdown processing library | Done | gray-matter + remark + remark-gfm |
| 5. Base layout (Header, Footer, SEO) | Partial | Header/Footer done, SEO metadata incomplete |
| 6. Homepage | Done | |
| 7. Blog list + post pages | Done | |
| 8. Portfolio list + detail pages | Done | |
| 9. Tag filtering | Partial | Blog only, not projects |
| 10. SEO (sitemap, RSS, OG, JSON-LD) | Partial | Sitemap/RSS done, OG/Twitter missing, JSON-LD unused |
| 11. Image optimization build script | Not started | |
| 12. GitHub Actions deploy | Not started | |
| 13. Zenn sync workflow | Not started | |
| 14. About page | Done | |

---

## Priority Action Items

1. **[Medium]** Add React `cache()` to `getBlogPost`/`getProject` to deduplicate reads
2. **[Medium]** Add Open Graph and Twitter Card metadata
3. **[Medium]** Wire up JsonLd component in blog post and about pages
4. **[Low]** Add RSS feed link to HTML head via metadata alternates
5. **[Low]** Fix tag page to include projects or scope tags correctly
6. **[Low]** Change `<html lang="en">` to `<html lang="ja">`
7. **[Low]** Create custom `not-found.tsx`
8. **[Low]** Resolve or remove dark mode CSS inconsistency
