import { SITE_CONFIG } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-500">
          &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href={SITE_CONFIG.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 transition-colors hover:text-blue-600"
          >
            GitHub
          </a>
          <a
            href={SITE_CONFIG.author.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 transition-colors hover:text-blue-600"
          >
            X (Twitter)
          </a>
        </div>
      </div>
    </footer>
  );
}
