# Code Quality Review: Website (Next.js Blog + Portfolio)

Review date: 2026-02-15

## Summary

Overall the codebase is clean, well-structured, and follows good Next.js conventions. The main issues are **code duplication in content.ts** (frontmatter mapping repeated 4 times), **unsafe type assertions**, and some **missing error handling**. No critical security or accessibility blockers found.

- **High severity**: 3 findings
- **Medium severity**: 8 findings
- **Low severity**: 6 findings

---

## High Severity

### H1. Duplicated frontmatter-to-object mapping in content.ts (lines 44-52, 63-72, 82-91, 102-112)

**Issue**: The frontmatter data-to-object mapping logic is copy-pasted 4 times across `getBlogPosts`, `getBlogPost`, `getProjects`, and `getProject`. Each repeats the same `(data.title as string) || slug` pattern.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/lib/content.ts`

**Suggested fix**: Extract helper functions:
```typescript
function toBlogPost(slug: string, data: Record<string, unknown>, content: string, htmlContent?: string): BlogPost {
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    tags: Array.isArray(data.tags) ? data.tags : [],
    emoji: typeof data.emoji === "string" ? data.emoji : undefined,
    content,
    htmlContent,
  };
}
```
Similarly for `toProject`.

### H2. Unsafe type assertions on frontmatter data (content.ts, multiple lines)

**Issue**: `(data.tags as string[])` is unsafe -- if `data.tags` is not an array, this silently passes the wrong type. Similarly `(data.title as string)` bypasses type checking entirely.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/lib/content.ts` (lines 46-50, 64-69, 84-89, 103-109)

**Suggested fix**: Use runtime type guards:
```typescript
tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
title: typeof data.title === "string" ? data.title : slug,
```

### H3. XSS risk via dangerouslySetInnerHTML without sanitization

**Issue**: `dangerouslySetInnerHTML={{ __html: post.htmlContent }}` is used in blog/[slug]/page.tsx (line 81) and projects/[slug]/page.tsx (line 92). The HTML comes from `remark-html` which does not sanitize by default. Malicious markdown content could inject scripts.

**Files**:
- `/home/sohei/claude-code-orchestra/apps/web/src/app/blog/[slug]/page.tsx` line 81
- `/home/sohei/claude-code-orchestra/apps/web/src/app/projects/[slug]/page.tsx` line 92

**Suggested fix**: Use `remark-html` with `{ sanitize: true }` option, or add `rehype-sanitize` to the processing pipeline in `markdown.ts`:
```typescript
import html from "remark-html";
// Change to:
const result = await remark().use(gfm).use(html, { sanitize: true }).process(markdown);
```

---

## Medium Severity

### M1. Date formatting logic duplicated (BlogCard line 30, blog/[slug]/page.tsx line 57)

**Issue**: The same `toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })` pattern is repeated. Should be a shared utility.

**Files**:
- `/home/sohei/claude-code-orchestra/apps/web/src/components/BlogCard.tsx` line 30
- `/home/sohei/claude-code-orchestra/apps/web/src/app/blog/[slug]/page.tsx` line 57

**Suggested fix**: Create `lib/date.ts`:
```typescript
const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", DATE_OPTIONS);
}
```

### M2. Tag badge styles duplicated across 4 files

**Issue**: The class string `"rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"` is repeated verbatim in:
- `BlogCard.tsx` line 44
- `blog/[slug]/page.tsx` line 69
- `projects/[slug]/page.tsx` line 80
- `tags/[tag]/page.tsx` (indirectly via BlogCard)

**Suggested fix**: Extract a `<TagBadge>` component or define a shared constant for the class names.

### M3. Magic number `3` for slice in page.tsx (lines 7-8)

**Issue**: `getBlogPosts().slice(0, 3)` and `getProjects().slice(0, 3)` use a magic number.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/app/page.tsx`

**Suggested fix**:
```typescript
const HOME_MAX_ITEMS = 3;
const recentPosts = getBlogPosts().slice(0, HOME_MAX_ITEMS);
```

### M4. No error handling for invalid dates in content.ts

**Issue**: If frontmatter `date` is malformed, `new Date(date)` in BlogCard and detail pages will produce "Invalid Date". No validation or fallback exists.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/lib/content.ts` (all getter functions)

**Suggested fix**: Validate date in the mapper function and log a warning or use a fallback.

### M5. scripts/generate-rss.js and scripts/optimize-images.js are plain JS without types

**Issue**: These scripts use CommonJS `require()` and have no TypeScript types. This is inconsistent with the rest of the TypeScript codebase.

**Files**:
- `/home/sohei/claude-code-orchestra/apps/web/scripts/generate-rss.js`
- `/home/sohei/claude-code-orchestra/apps/web/scripts/optimize-images.js`

**Suggested fix**: Consider converting to TypeScript (`.ts` with `tsx` or `ts-node` runner), or at minimum add JSDoc type annotations.

### M6. optimize-images.js name is misleading

**Issue**: The script is named `optimize-images.js` but it only copies images -- no optimization (compression, resizing, format conversion) is performed.

**File**: `/home/sohei/claude-code-orchestra/apps/web/scripts/optimize-images.js`

**Suggested fix**: Rename to `copy-images.js` or add actual optimization via `sharp`.

### M7. Placeholder URLs and content throughout

**Issue**: Multiple files contain placeholder values that should be configured:
- `about/page.tsx` lines 62, 69, 79: `hello@example.com`, `https://github.com`, `https://x.com`
- `page.tsx` line 15: `"Your Name"`
- `Footer.tsx` lines 12, 19: `https://github.com`, `https://x.com`
- `generate-rss.js` line 7: `https://example.com`

**Suggested fix**: Extract to a single site config file (`lib/config.ts`) so all URLs/names can be updated in one place.

### M8. Tag page only filters blog posts, not projects

**Issue**: `tags/[tag]/page.tsx` line 29 only calls `getBlogPosts()` and filters by tag. Projects with matching tags are not shown. `getAllTags()` collects from both blog and projects, creating a mismatch.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/app/tags/[tag]/page.tsx` line 29

**Suggested fix**: Also query `getProjects()` and display matching projects, or only collect blog tags in `getAllTags()`.

---

## Low Severity

### L1. Footer year computed at render time (not build time)

**Issue**: `new Date().getFullYear()` in Footer runs on every request/render. For a static site this is fine, but it could be a build-time constant.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/components/Footer.tsx` line 2

**Impact**: Minimal. This is idiomatic React.

### L2. Missing `role="navigation"` on mobile nav in Header

**Issue**: Mobile nav `<ul>` at Header line 65 lacks ARIA role. The desktop nav is inside `<nav>` but the mobile dropdown is conditionally rendered outside the `<nav>` element's flex context.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/components/Header.tsx` line 65

**Suggested fix**: Move mobile nav inside `<nav>` or add `role="navigation"` and `aria-label="Mobile navigation"`.

### L3. BlogCard wraps interactive elements (Link inside Link-like pattern)

**Issue**: In BlogCard, the entire card content is wrapped in a `<Link>`, but tag links are rendered outside this Link. This is correct behavior, but users clicking on the card area between the main link and tags will not navigate. Consider making the entire card clickable.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/components/BlogCard.tsx`

### L4. `React` import in JsonLd.tsx is unnecessary

**Issue**: `import React from "react"` on line 1 is not needed in Next.js (React 17+ JSX transform).

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/components/JsonLd.tsx` line 1

### L5. JsonLd component is defined but never imported

**Issue**: The `JsonLd` component exists but is not used in any page. It appears to be dead code or was intended for future use.

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/components/JsonLd.tsx`

### L6. Sorting comparison in content.ts uses string comparison

**Issue**: `a.date > b.date ? -1 : 1` (content.ts lines 54, 93) sorts dates as strings. This works for ISO format (YYYY-MM-DD) but fails for other date formats and returns inconsistent results for equal dates (should return 0).

**File**: `/home/sohei/claude-code-orchestra/apps/web/src/lib/content.ts` lines 54, 93

**Suggested fix**:
```typescript
return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
```

---

## Positive Observations

- Clean separation of concerns: lib/content.ts handles data, components handle rendering
- Proper use of Next.js App Router patterns (generateStaticParams, generateMetadata)
- Good TypeScript interfaces for BlogPost and Project
- Proper aria-label on hamburger menu button
- Consistent code formatting throughout
- Early return pattern used well (notFound() calls)
- No deep nesting issues
- File sizes are all well within the 200-400 line target
