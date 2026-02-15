import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

export interface ParsedMarkdown {
  data: Record<string, unknown>;
  content: string;
}

export function parseMarkdown(fileContent: string): ParsedMarkdown {
  const { data, content } = matter(fileContent);
  return { data, content };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(html, { sanitize: true })
    .process(markdown);
  return result.toString();
}
