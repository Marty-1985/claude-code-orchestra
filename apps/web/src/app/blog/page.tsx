import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about web development, software architecture, and more.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-gray-600">
        Thoughts on web development, software architecture, and the tools I use.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
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

      {posts.length === 0 && (
        <p className="mt-8 text-gray-500">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
