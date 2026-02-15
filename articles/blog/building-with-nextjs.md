---
title: "Building a Blog with Next.js SSG"
date: "2026-02-14"
description: "How I built this blog using Next.js static site generation and Markdown."
tags: ["nextjs", "react", "typescript", "tutorial"]
emoji: "🚀"
---

In this post, I'll walk through how I built this blog using Next.js with static site generation (SSG).

## Why Next.js SSG?

Static site generation offers several advantages for a blog:

1. **Performance** — Pre-rendered HTML loads instantly
2. **Security** — No server to attack
3. **Cost** — Free hosting on platforms like Cloudflare Pages
4. **SEO** — Search engines can easily crawl static HTML

## The Stack

The blog uses a simple but effective stack:

- **Next.js App Router** with `output: 'export'` for SSG
- **gray-matter** for parsing Markdown front-matter
- **remark** for converting Markdown to HTML
- **Tailwind CSS** for styling

## Content Management

All articles are stored as Markdown files in a shared `articles/` directory. This makes it easy to:

- Version control content with Git
- Sync articles to other platforms like Zenn
- Write in any text editor

Check out the source code on GitHub!
