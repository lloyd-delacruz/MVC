import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { prisma } from "../lib/cms/db";

// Category badge per slug (mirrors the original blog index). Inlined so this
// script doesn't depend on the "@/" path alias at runtime.
const BLOG_PILLS: Record<string, string> = {
  "top-3-immigration-mistakes": "Process",
  "when-hiring-a-consultant-pays-off": "Reflection",
  "ielts-scores-matter": "Process",
  "settlement-funds-explained": "Process",
  "which-canadian-province-is-right": "Pathway Guide",
  "am-i-too-old-to-immigrate": "Reflection",
  "immigration-myths-busted": "Reflection",
  "77-jobs-that-fast-track-pr": "Pathway Guide",
  "canadas-underrated-pathway": "Pathway Guide",
};

const DIR = path.join(process.cwd(), "content", "blog");

function stripBodyHeading(body: string): string {
  return body.replace(/^\s*#\s+Body\s*\n+/i, "").trim();
}

export async function migrateBlog() {
  if (!fs.existsSync(DIR)) {
    console.log("No content/blog directory; skipping blog migration.");
    return;
  }
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = (data.slug as string) || file.replace(/\.md$/, "");
    const fields = {
      title: (data.title as string) || slug,
      dek: (data.dek as string) || "",
      pill: BLOG_PILLS[slug] ?? "Insights",
      date: (data.date as string) || "",
      author: (data.author as string) || "MVC Editorial Team",
      readTime: (data.readTime as string) || "",
      bodyMarkdown: stripBodyHeading(content),
      status: "PUBLISHED" as const,
    };
    await prisma.blogPost.upsert({ where: { slug }, update: fields, create: { slug, ...fields } });
    console.log("migrated:", slug);
  }
}

// Allow running directly: `npm run db:migrate-blog` style via tsx.
if (process.argv[1] && process.argv[1].endsWith("migrate-blog.ts")) {
  migrateBlog()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
