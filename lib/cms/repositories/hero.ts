import type { HeroSection } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { HERO_FALLBACK } from "@/lib/cms/fallbacks/hero";
import type { HeroContent } from "@/lib/cms/types";

function mapHero(row: HeroSection): HeroContent {
  return {
    eyebrow: row.eyebrow,
    headline: row.headline,
    dek: row.dek,
    guarantees: row.guarantees,
    primaryCtaLabel: row.primaryCtaLabel,
    primaryCtaHref: row.primaryCtaHref,
    secondaryCtaLabel: row.secondaryCtaLabel,
    secondaryCtaHref: row.secondaryCtaHref,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    founderName: row.founderName,
    founderTitle: row.founderTitle,
    founderQuote: row.founderQuote,
  };
}

// Public read: cached + fallback. The try/catch is the safety guarantee — an
// empty OR unreachable DB must never throw out of a public read.
export const getHero = cached(
  async (): Promise<HeroContent> => {
    try {
      const row = await prisma.heroSection.findUnique({ where: { id: "singleton" } });
      return row ? mapHero(row) : HERO_FALLBACK;
    } catch {
      return HERO_FALLBACK;
    }
  },
  ["cms:hero"],
  ["cms:hero"],
);

// Admin read: uncached so the editor always sees the latest saved values.
export async function getHeroForAdmin(): Promise<HeroContent> {
  try {
    const row = await prisma.heroSection.findUnique({ where: { id: "singleton" } });
    return row ? mapHero(row) : HERO_FALLBACK;
  } catch {
    return HERO_FALLBACK;
  }
}
