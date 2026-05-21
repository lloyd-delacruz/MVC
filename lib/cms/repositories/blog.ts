import type { BlogPost } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { blogMetaFallback, blogPostFallback, BLOG_PILLS } from "@/lib/cms/fallbacks/blog";
import type { BlogPostMeta, BlogPostFull, AdminBlogPost } from "@/lib/cms/types";

function toMeta(r: BlogPost): BlogPostMeta {
  return {
    slug: r.slug,
    title: r.title,
    dek: r.dek,
    pill: r.pill,
    date: r.date,
    author: r.author,
    readTime: r.readTime,
    coverImageUrl: r.coverImageUrl,
  };
}

function toFull(r: BlogPost): BlogPostFull {
  return {
    ...toMeta(r),
    body: r.bodyMarkdown,
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
    ogImageUrl: r.ogImageUrl,
  };
}

function toAdmin(r: BlogPost): AdminBlogPost {
  return { ...toFull(r), id: r.id, status: r.status };
}

// Published posts (newest first), for the public index + related lists.
export const getAllPosts = cached(
  async (): Promise<BlogPostMeta[]> => {
    try {
      const rows = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { date: "desc" },
      });
      return rows.length ? rows.map(toMeta) : blogMetaFallback();
    } catch {
      return blogMetaFallback();
    }
  },
  ["cms:blog"],
  ["cms:blog"],
);

export async function getPost(slug: string): Promise<BlogPostFull | null> {
  try {
    const row = await prisma.blogPost.findFirst({ where: { slug, status: "PUBLISHED" } });
    return row ? toFull(row) : blogPostFallback(slug);
  } catch {
    return blogPostFallback(slug);
  }
}

export async function getAllPostsForAdmin(): Promise<AdminBlogPost[]> {
  try {
    const rows = await prisma.blogPost.findMany({ orderBy: { date: "desc" } });
    return rows.map(toAdmin);
  } catch {
    return [];
  }
}

export async function getPostByIdForAdmin(id: string): Promise<AdminBlogPost | null> {
  try {
    const row = await prisma.blogPost.findUnique({ where: { id } });
    return row ? toAdmin(row) : null;
  } catch {
    return null;
  }
}

export { BLOG_PILLS };
