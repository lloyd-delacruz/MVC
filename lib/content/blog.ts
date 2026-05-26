import { getAllPosts as mdAllPosts, getPost as mdGetPost } from "@/lib/blog";
import type { BlogPostMeta, BlogPostFull } from "@/lib/content/types";

const PILLS: Record<string, string> = {
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

const pillFor = (slug: string) => PILLS[slug] ?? "Insights";

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return mdAllPosts().map((m) => ({
    slug: m.slug,
    title: m.title,
    dek: m.dek,
    pill: pillFor(m.slug),
    date: m.date,
    author: m.author,
    readTime: m.readTime,
    coverImageUrl: null,
  }));
}

export async function getPost(slug: string): Promise<BlogPostFull | null> {
  const post = mdGetPost(slug);
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title,
    dek: post.dek,
    pill: pillFor(post.slug),
    date: post.date,
    author: post.author,
    readTime: post.readTime,
    coverImageUrl: null,
    body: post.body,
    seoTitle: null,
    seoDescription: null,
    ogImageUrl: null,
  };
}
