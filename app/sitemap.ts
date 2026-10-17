import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { PATHWAY_CATEGORIES, getAllCategorySlugPairs } from "@/lib/pathways";
import { getAllPosts } from "@/lib/blog";

/**
 * Only canonical, indexable production URLs (no trailing slashes, no
 * redirects, no noindex pages such as /thank-you). lastModified is only set
 * where we have a real date (blog posts) — no invented dates.
 */
const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/pathways",
  "/get-started",
  "/free-assessment",
  "/why-canada",
  "/success-stories",
  "/faq",
  "/blog",
  "/contact",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({ url: absoluteUrl(p) }));

  const categories = PATHWAY_CATEGORIES.map((c) => ({ url: absoluteUrl(`/pathways/${c.id}`) }));

  const pathways = getAllCategorySlugPairs().map(({ category, slug }) => ({
    url: absoluteUrl(`/pathways/${category}/${slug}`),
  }));

  const posts = getAllPosts().map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    ...(p.date ? { lastModified: new Date(`${p.date}T12:00:00Z`) } : {}),
  }));

  return [...pages, ...categories, ...pathways, ...posts];
}
