import Link from "next/link";

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  github?: string;
}

export default function ProjectCard({
  slug,
  title,
  description,
  tech,
  github,
}: ProjectCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
      <Link href={`/projects/${slug}`} className="block">
        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
          {title}
        </h2>
        <p className="mt-2 leading-relaxed text-gray-700">{description}</p>
      </Link>
      <div className="mt-3 flex flex-wrap gap-2">
        {tech.map((item) => (
          <span
            key={item}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
          >
            {item}
          </span>
        ))}
      </div>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-blue-600 hover:underline"
        >
          View on GitHub
        </a>
      )}
    </article>
  );
}
