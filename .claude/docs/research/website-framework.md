# Website Framework Research

> Researched: 2026-02-15

## Framework Comparison (SSR/SPA for Blog + Portfolio)

### Astro (Recommended)
- **Content-first architecture** — zero JS by default, Islands Architecture for selective hydration
- **Performance**: LCP 40-70% lower than SSG-optimized Next.js, 95% less JS for static sites
- **Content Collections**: Type-safe Markdown/MDX with Zod schema validation
- **Multi-framework**: Can use React, Vue, Svelte components within Astro pages
- **SSR/SSG flexibility**: Per-page rendering mode selection
- **Astro v5+**: Content Layer API, live content collections (v5.10.0), new render() import

### Next.js
- Most popular React framework, massive ecosystem
- App Router adds complexity unnecessary for content sites
- Overkill for blog/portfolio — better suited for full-stack web apps
- Tightly coupled with Vercel for best experience

### SvelteKit
- Excellent DX, smallest bundle sizes
- Smaller ecosystem, mdsvex less mature than Astro Content Collections
- Good for interactive apps, less content-focused tooling

### Remix
- Strong data loading patterns
- Merging with React Router — future direction unclear
- Fewer blog-specific tools

### Python (FastAPI + Jinja2 / Django)
- Possible but requires manual frontend optimization
- Less ecosystem support for static content sites
- Better suited for API-heavy applications

## CMS Options

### File-based (Recommended for Phase 1)
- **Astro Content Collections + MDX**: Type-safe, Git-managed, zero external dependency
- Zod schema validation for frontmatter
- Custom components in MDX for rich content
- v5 Content Layer API enables future CMS migration

### Headless CMS (Phase 2 option)
- **Sanity**: Real-time collaboration, customizable studio, generous free tier
- **Contentful**: Enterprise-grade, good API, higher pricing
- **microCMS**: Japanese-friendly, simple API, good for Japanese content
- **Strapi**: Self-hosted, open source, full control

## Deployment Platforms

### Cloudflare Pages (Recommended)
- **300+ global edge locations** — lowest latency
- **Generous free tier**: Unlimited bandwidth, 500 builds/month
- Best performance for static/SSR Astro sites
- Native Astro adapter support

### Netlify
- Excellent DX, simple Git-based deploys
- Good plugin ecosystem, built-in forms/identity
- Some caveats with certain auth libraries (e.g., Clerk infinite redirects)

### Vercel
- Optimized primarily for Next.js
- 100+ edge locations, good but not as extensive as Cloudflare
- Higher pricing at scale

## Astro + MDX Best Practices (2025-2026)

1. Define Content Collections in `src/content/config.ts` with Zod schemas
2. Use `client:*` directives sparingly — only for truly interactive components
3. Astro v5: Use `render()` import from `astro:content` (not `.render()` method)
4. Map Markdown syntax to custom components for consistent styling
5. Content Layer API enables hybrid local + remote content sources
6. Image optimization via `astro:assets` with automatic WebP/AVIF

## Sources

- [Next.js Alternatives 2026 — BCMS](https://thebcms.com/blog/nextjs-alternatives)
- [Next.js vs Astro vs SvelteKit 2025 — Vocal](https://vocal.media/education/next-js-vs-astro-vs-svelte-kit-which-framework-wins-in-2025)
- [Frontend Framework Showdown 2025 — Leapcell](https://leapcell.io/blog/the-2025-frontend-framework-showdown-next-js-nuxt-js-sveltekit-and-astro)
- [SvelteKit vs Next.js vs Astro 2026 — Gigson](https://www.gigson.co/blog/sveltekit-vs-next-js-vs-astro-which-framework-wins-in-2026)
- [Vercel vs Netlify vs Cloudflare 2025 — DigitalApplied](https://www.digitalapplied.com/blog/vercel-vs-netlify-vs-cloudflare-pages-comparison)
- [Astro Content Collections — Astro Docs](https://docs.astro.build/en/guides/content-collections/)
- [Astro MDX Advanced Guide — EastonDev](https://eastondev.com/blog/en/posts/dev/20251202-astro-mdx-advanced-guide/)
