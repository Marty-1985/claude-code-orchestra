# Security Review: Next.js Blog + Portfolio Website

**Date**: 2026-02-15
**Reviewer**: Claude (Security Subagent)
**Scope**: Source files, scripts, GitHub Actions workflows

---

## Findings

### 1. XSS via dangerouslySetInnerHTML - Markdown Rendering

**Severity**: Medium
**Files**:
- `/home/sohei/claude-code-orchestra/apps/web/src/app/blog/[slug]/page.tsx` (line 81)
- `/home/sohei/claude-code-orchestra/apps/web/src/app/projects/[slug]/page.tsx` (line 92)
- `/home/sohei/claude-code-orchestra/apps/web/src/lib/markdown.ts` (line 17)

**Description**: Both `blog/[slug]/page.tsx` and `projects/[slug]/page.tsx` use `dangerouslySetInnerHTML={{ __html: post.htmlContent }}` to render markdown-converted HTML. The `remark-html` plugin (used in `markdown.ts` line 17) does **not** sanitize HTML by default -- it passes through raw HTML embedded in markdown files.

If an attacker can contribute or modify markdown files (e.g., via a PR to the articles directory, or if content is sourced from an external repo), they can inject arbitrary `<script>` tags or event handlers.

**Mitigating factor**: Content comes from local filesystem markdown files checked into the repo, not from user input at runtime. This is a static site (SSG via `generateStaticParams`), so the attack surface is limited to anyone with write access to the `articles/` directory.

**Recommended fix**:
- Use `remark-html` with `{ sanitize: true }` option, OR
- Add `rehype-sanitize` to the remark pipeline to strip dangerous HTML elements
- Example: `remark().use(gfm).use(html, { sanitize: true })`

---

### 2. Path Traversal in Slug-Based File Reading

**Severity**: Medium
**File**: `/home/sohei/claude-code-orchestra/apps/web/src/lib/content.ts` (lines 58, 97)

**Description**: The `getBlogPost(slug)` and `getProject(slug)` functions construct file paths by directly interpolating the slug parameter:
```ts
const filePath = path.join(BLOG_DIR, `${slug}.md`);
```
A slug like `../../etc/passwd` could escape the intended directory. While `path.join` normalizes `..`, it does not prevent traversal -- `path.join("/articles/blog", "../../etc/passwd.md")` resolves to `/articles/passwd.md` (or higher).

**Mitigating factor**: This is a static site with `generateStaticParams()`, so at build time only known slugs are generated. At runtime in SSG mode, arbitrary slugs would return 404. However, if ISR or SSR is ever enabled, this becomes exploitable.

**Recommended fix**:
```ts
function sanitizeSlug(slug: string): string | null {
  // Only allow alphanumeric, hyphens, underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) return null;
  return slug;
}
```
Apply this validation before constructing file paths.

---

### 3. Unvalidated GitHub URL in Project Frontmatter

**Severity**: Low
**File**: `/home/sohei/claude-code-orchestra/apps/web/src/app/projects/[slug]/page.tsx` (lines 63-71)

**Description**: The `project.github` value from frontmatter is rendered directly as an `<a href>`. If a malicious markdown file sets `github: javascript:alert(1)`, this becomes a JavaScript URL XSS vector.

**Recommended fix**: Validate that the URL starts with `https://`:
```tsx
{project.github && project.github.startsWith('https://') && (
  <a href={project.github} ...>
```

---

### 4. RSS Feed - Slug Not XML-Escaped in URLs

**Severity**: Low
**File**: `/home/sohei/claude-code-orchestra/apps/web/scripts/generate-rss.js` (lines 53-54)

**Description**: While `title` and `description` are properly escaped with `escapeXml()`, the `item.slug` value is interpolated directly into `<link>` and `<guid>` URLs without escaping. A slug containing `&` or XML special characters could break the feed.

**Recommended fix**: Apply `escapeXml()` to slug values in URL construction, or validate slugs to only contain URL-safe characters.

---

### 5. GitHub Actions - Token Exposed in Git Clone URL

**Severity**: Medium
**File**: `/home/sohei/claude-code-orchestra/.github/workflows/sync-zenn.yml` (line 18)

**Description**: The workflow clones a repo using the token inline in the URL:
```bash
git clone https://x-access-token:${ZENN_REPO_TOKEN}@github.com/...
```
While the token comes from `secrets`, this pattern can leak the token in:
- Process listings (`ps aux`)
- Git error messages logged to Actions output
- `.git/config` of the cloned repo

**Recommended fix**:
- Use `git credential helper` or `git config` to set credentials:
```yaml
- name: Sync
  run: |
    git config --global credential.helper store
    echo "https://x-access-token:${ZENN_REPO_TOKEN}@github.com" > ~/.git-credentials
    git clone https://github.com/${{ github.repository_owner }}/zenn-content.git /tmp/zenn-content
```
- Or use `actions/checkout` with the `token` parameter for the Zenn repo.

---

### 6. No Hardcoded Secrets Found

**Severity**: N/A (Pass)

**Description**: No hardcoded API keys, passwords, or credentials were found in any source files. Secrets are properly referenced via `${{ secrets.* }}` in workflows and `process.env` in scripts. The `SITE_URL` fallback to `https://example.com` is a safe default.

---

### 7. Image Copy Script - No Path Validation

**Severity**: Low
**File**: `/home/sohei/claude-code-orchestra/apps/web/scripts/optimize-images.js` (line 26)

**Description**: The `copyImages` function recursively copies files from `articles/` to `public/images/` without checking for symlinks. A symlink in the articles directory could cause files from outside the intended directory to be copied into the public directory.

**Recommended fix**: Check `entry.isSymbolicLink()` and skip symlinks, or use `fs.lstatSync` to verify the target is within the expected directory.

---

### 8. JsonLd Component - Safe Usage

**Severity**: N/A (Pass)
**File**: `/home/sohei/claude-code-orchestra/apps/web/src/components/JsonLd.tsx` (line 65)

**Description**: The `JsonLd` component uses `dangerouslySetInnerHTML` but passes content through `JSON.stringify()`, which properly escapes special characters including `</script>`. This is the standard safe pattern for JSON-LD.

**Note**: If any input value contains `</script>`, `JSON.stringify` does NOT escape it by default. Consider using a safe serializer:
```ts
JSON.stringify(schema).replace(/</g, '\\u003c')
```

---

### 9. Tag Page - URL Decoding Without Validation

**Severity**: Low
**File**: `/home/sohei/claude-code-orchestra/apps/web/src/app/tags/[tag]/page.tsx` (lines 19, 28)

**Description**: The tag parameter is decoded with `decodeURIComponent(tag)` and displayed directly in the page. In React/Next.js, JSX auto-escapes text content, so this is not an XSS vector. However, the decoded tag is used in metadata `title` and `description` without length or content validation, which could lead to SEO spam if arbitrary tags are accessed.

**Mitigating factor**: `generateStaticParams()` limits generated pages to known tags. Unknown tags in SSG mode return 404.

---

### 10. GitHub Actions - Pinned Action Versions

**Severity**: Low
**Files**: Both workflow files

**Description**: Actions are pinned to major versions (`@v4`, `@v3`) rather than commit SHAs. A supply chain attack on these actions could inject malicious code.

**Recommended fix**: Pin to full commit SHA:
```yaml
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

---

## Summary Table

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | XSS via unsanitized markdown HTML | Medium | Fix recommended |
| 2 | Path traversal in slug file reading | Medium | Fix recommended |
| 3 | Unvalidated GitHub URL in project href | Low | Fix recommended |
| 4 | RSS slug not XML-escaped | Low | Fix recommended |
| 5 | Token in git clone URL | Medium | Fix recommended |
| 6 | No hardcoded secrets | N/A | Pass |
| 7 | Symlink following in image copy | Low | Fix recommended |
| 8 | JsonLd safe but could be hardened | Low | Optional |
| 9 | Tag URL decode without validation | Low | Acceptable (SSG) |
| 10 | Actions not pinned to SHA | Low | Fix recommended |

**Overall Assessment**: No critical vulnerabilities found. The main risks are mitigated by the static site generation model (SSG), which limits runtime attack surface. The most actionable fixes are #1 (sanitize markdown HTML), #2 (validate slugs), and #5 (token handling in workflow).
