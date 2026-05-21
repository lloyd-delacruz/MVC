import type { Metadata } from "next";
import type { SeoMeta } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { seoFallback, SEO_PAGES } from "@/lib/cms/fallbacks/seo";
import type { SeoMetaContent } from "@/lib/cms/types";

function mapSeo(r: SeoMeta): SeoMetaContent {
  return { pageKey: r.pageKey, title: r.title, description: r.description, ogImageUrl: r.ogImageUrl };
}

export const getSeo = cached(
  async (pageKey: string): Promise<SeoMetaContent> => {
    try {
      const row = await prisma.seoMeta.findUnique({ where: { pageKey } });
      return row ? mapSeo(row) : seoFallback(pageKey);
    } catch {
      return seoFallback(pageKey);
    }
  },
  ["cms:seo"],
  ["cms:seo"],
);

export async function getAllSeoForAdmin(): Promise<SeoMetaContent[]> {
  let rows: SeoMeta[] = [];
  try {
    rows = await prisma.seoMeta.findMany();
  } catch {
    rows = [];
  }
  const byKey = new Map(rows.map((r) => [r.pageKey, mapSeo(r)]));
  return SEO_PAGES.map((p) => byKey.get(p.key) ?? seoFallback(p.key));
}

/** Build a Next.js Metadata object for a page from its stored SEO. */
export async function buildPageMetadata(
  pageKey: string,
  opts?: { absoluteTitle?: boolean },
): Promise<Metadata> {
  const seo = await getSeo(pageKey);
  const images = seo.ogImageUrl ? [seo.ogImageUrl] : undefined;
  return {
    title: opts?.absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description, ...(images ? { images } : {}) },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      ...(images ? { images } : {}),
    },
  };
}
