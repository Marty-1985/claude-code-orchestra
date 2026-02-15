export const SITE_CONFIG = {
  name: "Portfolio",
  title: "Portfolio - Blog & Projects",
  description:
    "A personal blog and portfolio showcasing projects and technical writing.",
  url: process.env.SITE_URL || "https://example.com",
  locale: "ja_JP",
  lang: "ja",
  author: {
    name: "Your Name",
    email: "hello@example.com",
    github: "https://github.com",
    twitter: "https://x.com",
  },
} as const;

export const HOME_MAX_ITEMS = 3;
