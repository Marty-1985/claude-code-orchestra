import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import { getBlogPosts, getProjects } from "@/lib/content";
import { SITE_CONFIG, HOME_MAX_ITEMS } from "@/lib/config";

export default function Home() {
  const recentPosts = getBlogPosts().slice(0, HOME_MAX_ITEMS);
  const featuredProjects = getProjects().slice(0, HOME_MAX_ITEMS);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero section */}
      <section className="py-16 text-center sm:py-24 sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Hi, I&apos;m{" "}
          <span className="text-blue-600">{SITE_CONFIG.author.name}</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600 sm:text-xl">
          Software developer passionate about building great products. I write
          about web development, software architecture, and the tools I use.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/blog"
            className="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
          >
            Read the Blog
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-gray-300 px-6 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            View Projects
          </Link>
        </div>
      </section>

      {/* Recent posts */}
      <section className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:underline"
          >
            View all posts
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
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
        {recentPosts.length === 0 && (
          <p className="text-gray-500">No posts yet. Check back soon!</p>
        )}
      </section>

      {/* Featured projects */}
      <section className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm text-blue-600 hover:underline"
          >
            View all projects
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
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
        {featuredProjects.length === 0 && (
          <p className="text-gray-500">No projects yet. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
