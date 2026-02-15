import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import { getBlogPosts, getProjects, getAllTags } from "@/lib/content";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Posts tagged "${decodedTag}"`,
    description: `All content tagged with "${decodedTag}".`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getBlogPosts().filter((post) => post.tags.includes(decodedTag));
  const projects = getProjects().filter((project) =>
    project.tags.includes(decodedTag),
  );
  const totalCount = posts.length + projects.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/blog" className="text-sm text-blue-600 hover:underline">
        &larr; Back to Blog
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Tag: <span className="text-blue-600">{decodedTag}</span>
      </h1>
      <p className="mt-2 text-gray-600">
        {totalCount} {totalCount === 1 ? "item" : "items"} found.
      </p>

      {posts.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Blog Posts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                description={post.description}
                tags={post.tags}
                emoji={post.emoji}
              />
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Projects
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                description={project.description}
                tech={project.tech}
                github={project.github}
              />
            ))}
          </div>
        </section>
      )}

      {totalCount === 0 && (
        <p className="mt-8 text-gray-500">No content found with this tag.</p>
      )}
    </div>
  );
}
