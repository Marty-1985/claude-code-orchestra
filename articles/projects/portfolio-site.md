---
title: "Portfolio Site"
date: "2026-02-15"
description: "Personal blog and portfolio built with Next.js, TypeScript, and Tailwind CSS."
tags: ["nextjs", "react", "tailwind", "typescript"]
tech: ["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare Pages"]
github: "https://github.com/example/portfolio"
---

A personal blog and portfolio site built with Next.js (App Router) and deployed to Cloudflare Pages.

## Features

- **Static Site Generation** — Fast page loads with pre-rendered HTML
- **Markdown Blog** — Write posts in Markdown with front-matter metadata
- **Portfolio Showcase** — Display projects with descriptions and tech stacks
- **Tag Filtering** — Browse posts by tag
- **SEO Optimized** — Sitemap, RSS feed, Open Graph tags
- **Responsive Design** — Mobile-first with Tailwind CSS

## Architecture

The site uses Next.js App Router with `output: 'export'` for static generation. Articles are stored as Markdown files and processed at build time using gray-matter and remark.
