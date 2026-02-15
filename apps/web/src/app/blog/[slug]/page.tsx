import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPost } from "@/lib/content";
import { SITE_CONFIG } from "@/lib/config";
import JsonLd from "@/components/JsonLd";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        type="BlogPosting"
        title={post.title}
        description={post.description}
        datePublished={post.date}
        authorName={SITE_CONFIG.author.name}
        url={`${SITE_CONFIG.url}/blog/${slug}`}
      />

      <Link
        href="/blog"
        className="text-sm text-blue-600 hover:underline"
      >
        &larr; Back to Blog
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-3">
          {post.emoji && <span className="text-4xl">{post.emoji}</span>}
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
        </div>
        <time
          className="mt-3 block text-sm text-gray-500"
          dateTime={post.date}
        >
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.htmlContent ? (
        <div
          className="prose-custom mt-8"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />
      ) : (
        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-gray-700">
          {post.content}
        </div>
      )}
    </article>
  );
}
