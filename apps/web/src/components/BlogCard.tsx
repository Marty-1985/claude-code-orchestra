import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  emoji?: string;
}

export default function BlogCard({
  slug,
  title,
  date,
  description,
  tags,
  emoji,
}: BlogCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
      <Link href={`/blog/${slug}`} className="block">
        <div className="mb-2 flex items-center gap-2">
          {emoji && <span className="text-2xl">{emoji}</span>}
          <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
            {title}
          </h2>
        </div>
        <time className="text-sm text-gray-500" dateTime={date}>
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <p className="mt-2 leading-relaxed text-gray-700">{description}</p>
      </Link>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
