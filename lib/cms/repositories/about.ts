import type { AboutContent as AboutRow } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { ABOUT_FALLBACK } from "@/lib/cms/fallbacks/about";
import type { AboutContent } from "@/lib/cms/types";

function mapAbout(r: AboutRow): AboutContent {
  return {
    eyebrow: r.eyebrow,
    heading: r.heading,
    lede: r.lede,
    bodyMarkdown: r.bodyMarkdown,
    imageUrl: r.imageUrl,
    imageAlt: r.imageAlt,
  };
}

export const getAbout = cached(
  async (): Promise<AboutContent> => {
    try {
      const row = await prisma.aboutContent.findUnique({ where: { id: "singleton" } });
      return row ? mapAbout(row) : ABOUT_FALLBACK;
    } catch {
      return ABOUT_FALLBACK;
    }
  },
  ["cms:about"],
  ["cms:about"],
);

export async function getAboutForAdmin(): Promise<AboutContent> {
  try {
    const row = await prisma.aboutContent.findUnique({ where: { id: "singleton" } });
    return row ? mapAbout(row) : ABOUT_FALLBACK;
  } catch {
    return ABOUT_FALLBACK;
  }
}
