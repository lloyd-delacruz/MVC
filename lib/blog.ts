import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  dek: string;
  date: string;
  readTime: string;
  author: string;
}

export interface Post extends PostMeta {
  body: string;
}

function readPostFile(filename: string): Post {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fallbackSlug = filename.replace(/\.md$/, "");

  return {
    slug: (data.slug as string) || fallbackSlug,
    title: (data.title as string) || fallbackSlug,
    dek: (data.dek as string) || "",
    date: (data.date as string) || "",
    readTime: (data.readTime as string) || "",
    author: (data.author as string) || "MVC Editorial Team",
    body: content,
  };
}

export function getAllPosts(): PostMeta[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const { body, ...meta } = readPostFile(file);
    return meta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const post = readPostFile(file);
    if (post.slug === slug) return post;
  }
  return null;
}
