import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me and what I do.",
};

const SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Docker",
  "AWS",
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        type="Person"
        name={SITE_CONFIG.author.name}
        url={SITE_CONFIG.url}
        jobTitle="Software Developer"
        sameAs={[SITE_CONFIG.author.github, SITE_CONFIG.author.twitter]}
      />

      <h1 className="text-3xl font-bold text-gray-900">About Me</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Who I Am</h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          I&apos;m a software developer with a passion for building clean,
          maintainable, and user-friendly applications. I enjoy working across
          the full stack, from designing intuitive interfaces to architecting
          robust backend systems.
        </p>
        <p className="mt-3 leading-relaxed text-gray-700">
          When I&apos;m not coding, you can find me reading about technology,
          exploring open source projects, or learning something new.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Get in Touch</h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          Feel free to reach out if you&apos;d like to collaborate, have a
          question, or just want to say hello.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <a
              href={`mailto:${SITE_CONFIG.author.email}`}
              className="text-blue-600 hover:underline"
            >
              {SITE_CONFIG.author.email}
            </a>
          </li>
          <li>
            <a
              href={SITE_CONFIG.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={SITE_CONFIG.author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              X (Twitter)
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
