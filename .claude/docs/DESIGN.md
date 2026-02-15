# Project Design Document

> This document tracks design decisions made during conversations.
> Updated automatically by the `design-tracker` skill.

## Overview

Claude Code Orchestra is a multi-agent collaboration framework that orchestrates Claude Code (1M context), Codex CLI (deep reasoning), and Gemini CLI (external research + multimodal) to accelerate development. With Opus 4.6, the framework leverages Agent Teams for parallel work.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Claude Code Lead (Opus 4.6 — 1M context)                       │
│  Role: Orchestration, codebase analysis, user interaction        │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │ Agent Teams           │  │ Subagents             │             │
│  │ (parallel + comms)    │  │ (isolated + results)  │             │
│  │                       │  │                       │             │
│  │ Researcher ←→ Archit. │  │ Codex consultation    │             │
│  │ Implementer A/B/C     │  │ Gemini research       │             │
│  │ Security/Quality Rev. │  │ Error analysis        │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                   │
│  External CLIs:                                                   │
│  ├── Codex CLI (gpt-5.3-codex) — deep reasoning, design          │
│  └── Gemini CLI (gemini-3-pro) — web search, multimodal          │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Plan

### Patterns & Approaches

| Pattern | Purpose | Notes |
|---------|---------|-------|
| Agent Teams | Parallel work with inter-agent communication | /startproject, /team-implement, /team-review |
| Subagents | Isolated tasks returning results | Codex/Gemini consultation when teams not needed |
| Skill Pipeline | `/startproject` → `/team-implement` → `/team-review` | Separation of concerns across skills |

### Libraries & Roles

| Library | Role | Version | Notes |
|---------|------|---------|-------|
| Codex CLI | Deep reasoning partner | gpt-5.3-codex | Design, debug, trade-offs |
| Gemini CLI | External information + multimodal | gemini-3-pro | Web search, PDF/video/audio |

### Key Decisions

| Decision | Rationale | Alternatives Considered | Date |
|----------|-----------|------------------------|------|
| Claude handles codebase analysis directly | Opus 4.6 has 1M context, no need to delegate to Gemini | Keep Gemini for codebase analysis | 2026-02-08 |
| Gemini role narrowed to external info + multimodal | Claude's 1M context makes Gemini's codebase analysis redundant; Gemini's unique value is Google Search and multimodal | Keep broad Gemini role | 2026-02-08 |
| /startproject split into 3 skills | Separation of Plan/Implement/Review gives user control gates | Single monolithic skill | 2026-02-08 |
| Agent Teams for Research ↔ Design | Bidirectional communication enables iterative refinement | Sequential subagents (old approach) | 2026-02-08 |
| Agent Teams for parallel implementation | Module-based ownership avoids file conflicts | Single-agent sequential implementation | 2026-02-08 |
| Subagent threshold relaxed to ~50 lines | 1M context can absorb more direct output | Keep 10-line threshold | 2026-02-08 |
| Next.js (App Router, SSG) for blog+portfolio website | Industry standard React framework; portfolio itself demonstrates Next.js skills; largest ecosystem | Astro (content-first but niche), SvelteKit, Hugo, 11ty | 2026-02-15 |
| Tailwind CSS for styling | Utility-first, rapid dev, strong Next.js integration | CSS Modules, UnoCSS, Vanilla Extract | 2026-02-15 |
| File-based Markdown content | Git-managed, multi-platform compatible (Zenn/Qiita); gray-matter + remark for processing | Headless CMS, Astro Content Collections | 2026-02-15 |
| Shared articles/ directory | Single source of truth for Markdown; used by blog, synced to Zenn/Qiita | Content per-framework (src/content/) | 2026-02-15 |
| apps/web/ directory structure | Clean separation from Python tooling, own package.json | Root-level web files, separate repo | 2026-02-15 |
| Cloudflare Pages (SSG) via GitHub Actions | Unlimited bandwidth, 300+ edge locations, free; SSG static export avoids SSR constraints | Vercel (Next.js native but paid at scale), GitHub Pages (no preview), Netlify | 2026-02-15 |

## Website Architecture (Blog + Portfolio)

### Framework: Next.js (App Router, SSG)

**Decision**: Use Next.js as the web framework for the blog + portfolio site.

**Rationale**:
- Industry standard React framework — portfolio demonstrates marketable skills
- Largest ecosystem (~130k GitHub stars, ~7M npm DL/week)
- App Router with `output: 'export'` for static generation
- Markdown handling via gray-matter + remark (skill demonstration)
- Strong TypeScript support

**Alternatives considered**:
| Framework | Verdict | Why Not |
|-----------|---------|---------|
| Astro | Best for pure content sites | Niche; less value as portfolio skill demonstration |
| Hugo | Fastest build, great Markdown | Go templates; limited interactivity |
| SvelteKit | Good DX, small bundles | Smaller ecosystem, less market recognition |
| 11ty | Simplest SSG | No built-in image optimization, small community |

### Project Structure

```
claude-code-orchestra/
  articles/                    # Shared Markdown (single source of truth)
    blog/                      # Blog posts (.md)
    projects/                  # Portfolio entries (.md)
  apps/web/                    # Next.js project
    next.config.js             # output: 'export' for SSG
    package.json
    tsconfig.json
    tailwind.config.ts
    src/
      app/                     # App Router
        layout.tsx             # Root layout
        page.tsx               # Homepage
        blog/
          page.tsx             # Blog list
          [slug]/page.tsx      # Blog post
        projects/
          page.tsx             # Portfolio list
          [slug]/page.tsx      # Project detail
        about/page.tsx         # About page
        tags/[tag]/page.tsx    # Tag filtering
      components/              # Reusable UI components
        Header.tsx
        Footer.tsx
        BlogCard.tsx
        ProjectCard.tsx
        SEO.tsx
      lib/                     # Utilities
        markdown.ts            # gray-matter + remark processing
        content.ts             # Article loading helpers
      styles/                  # Global styles
    public/                    # Static assets (favicon, images, etc.)
  .github/workflows/
    deploy-blog.yml            # GitHub Actions → Cloudflare Pages
    sync-zenn.yml              # Zenn sync
  pyproject.toml               # Existing Python tooling
```

### Styling: Tailwind CSS

- Utility-first approach for rapid development
- `tailwindcss` + `postcss` + `autoprefixer`
- Responsive design with mobile-first approach

### Routing Strategy

- File-based routing (Next.js App Router)
- Dynamic routes: `[slug]/page.tsx` for blog posts and projects
- `generateStaticParams()` for static path generation
- Tag-based filtering: `/tags/[tag]`

### Content Management

- Shared `articles/` directory as single source of truth
- `gray-matter` for front-matter parsing
- `remark` + `rehype` for Markdown → HTML conversion
- Multi-platform sync: Zenn (GitHub integration), Qiita (API)

### Image Optimization

- Static export limits `next/image` — use `<img>` with manual optimization
- Sharp for build-time WebP/AVIF conversion (via build script)
- Width/height attributes for CLS prevention
- Lazy loading via `loading="lazy"`

### SEO Strategy

- Next.js Metadata API for per-page title/description/canonical
- Open Graph and Twitter Card meta tags
- JSON-LD structured data (BlogPosting, Person)
- `next-sitemap` for sitemap.xml generation
- robots.txt
- RSS feed generation (custom build script)

### Deployment

- **Cloudflare Pages** via GitHub Actions
- `next build` → static export → deploy to Cloudflare Pages
- PR preview deployments via Cloudflare Pages

### Implementation Tasks

| # | Task | Depends On | Complexity |
|---|------|------------|------------|
| 1 | Initialize Next.js project in `apps/web/` with SSG config | - | Low |
| 2 | Configure Tailwind CSS | 1 | Low |
| 3 | Create shared `articles/` directory with sample content | - | Low |
| 4 | Build Markdown processing library (gray-matter + remark) | 1 | Medium |
| 5 | Create base layout (Header, Footer, SEO) | 1, 2 | Medium |
| 6 | Implement homepage | 4, 5 | Medium |
| 7 | Implement blog list and post pages | 4, 5 | Medium |
| 8 | Implement portfolio list and detail pages | 4, 5 | Medium |
| 9 | Add tag filtering | 4, 7 | Low |
| 10 | Add SEO (sitemap, RSS, OG tags, JSON-LD) | 5, 7, 8 | Medium |
| 11 | Image optimization build script | 1 | Medium |
| 12 | GitHub Actions → Cloudflare Pages deploy | 1-10 | Medium |
| 13 | Zenn sync workflow | 3 | Low |
| 14 | About page | 5 | Low |

## TODO

- [ ] Update gemini-system and codex-system skills to match new delegation rules
- [ ] Test Agent Teams workflow end-to-end with a real project
- [ ] Evaluate if gemini-explore agent should be removed or repurposed
- [ ] Update hooks for Agent Teams quality gates

## Open Questions

- [ ] Optimal team size for /team-implement (2-3 vs 4-5 teammates)?
- [ ] Should /team-review be mandatory or optional?
- [ ] How to handle Compaction in long Agent Teams sessions?

## Changelog

| Date | Changes |
|------|---------|
| 2026-02-08 | Major redesign for Opus 4.6: 1M context, Agent Teams, skill pipeline |
| | Initial |
