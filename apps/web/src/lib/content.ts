import fs from "fs";
import path from "path";
import { parseMarkdown, markdownToHtml } from "./markdown";

const ARTICLES_DIR = path.join(process.cwd(), "..", "..", "articles");
const BLOG_DIR = path.join(ARTICLES_DIR, "blog");
const PROJECTS_DIR = path.join(ARTICLES_DIR, "projects");

const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  emoji?: string;
  content: string;
  htmlContent?: string;
}

export interface Project {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  tech: string[];
  github?: string;
  content: string;
  htmlContent?: string;
}

function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
}

function toBlogPost(
  slug: string,
  data: Record<string, unknown>,
  content: string,
  htmlContent?: string,
): BlogPost {
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date: typeof data.date === "string" ? data.date : "",
    description: typeof data.description === "string" ? data.description : "",
    tags: toStringArray(data.tags),
    emoji: typeof data.emoji === "string" ? data.emoji : undefined,
    content,
    htmlContent,
  };
}

function toProject(
  slug: string,
  data: Record<string, unknown>,
  content: string,
  htmlContent?: string,
): Project {
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date: typeof data.date === "string" ? data.date : "",
    description: typeof data.description === "string" ? data.description : "",
    tags: toStringArray(data.tags),
    tech: toStringArray(data.tech),
    github:
      typeof data.github === "string" && data.github.startsWith("https://")
        ? data.github
        : undefined,
    content,
    htmlContent,
  };
}

function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getBlogPosts(): BlogPost[] {
  const files = getMarkdownFiles(BLOG_DIR);
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(BLOG_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = parseMarkdown(fileContent);
    return toBlogPost(slug, data, content);
  });
  return sortByDateDesc(posts);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMarkdown(fileContent);
  const htmlContent = await markdownToHtml(content);
  return toBlogPost(slug, data, content, htmlContent);
}

export function getProjects(): Project[] {
  const files = getMarkdownFiles(PROJECTS_DIR);
  const projects = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(PROJECTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = parseMarkdown(fileContent);
    return toProject(slug, data, content);
  });
  return sortByDateDesc(projects);
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!SLUG_PATTERN.test(slug)) return null;
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseMarkdown(fileContent);
  const htmlContent = await markdownToHtml(content);
  return toProject(slug, data, content, htmlContent);
}

export function getAllTags(): string[] {
  const blogPosts = getBlogPosts();
  const projects = getProjects();
  const tagSet = new Set<string>();
  for (const post of blogPosts) {
    for (const tag of post.tags) tagSet.add(tag);
  }
  for (const project of projects) {
    for (const tag of project.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
}
