const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(__dirname, '..', '..', '..', 'articles', 'blog');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'feed.xml');
const SITE_URL = process.env.SITE_URL || 'https://example.com';

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRss() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('No blog directory found, skipping RSS generation.');
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const items = files
    .map((file) => {
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const { data } = matter(content);
      const slug = file.replace(/\.md$/, '');

      return {
        title: data.title || slug,
        description: data.description || '',
        date: data.date ? new Date(data.date) : new Date(),
        slug,
      };
    })
    .sort((a, b) => b.date - a.date);

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog</title>
    <link>${SITE_URL}</link>
    <description>Blog RSS Feed</description>
    <language>ja</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${SITE_URL}/blog/${item.slug}</link>
      <guid>${SITE_URL}/blog/${item.slug}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, rssXml, 'utf-8');
  console.log(`RSS feed generated: ${OUTPUT_PATH} (${items.length} items)`);
}

generateRss();
