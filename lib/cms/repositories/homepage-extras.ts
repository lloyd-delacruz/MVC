import type { TrustBadge, WhyChooseItem as WhyChooseRow, CtaBanner } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import {
  TRUST_BADGES_FALLBACK,
  WHY_CHOOSE_FALLBACK,
  CTA_BANNER_FALLBACK,
} from "@/lib/cms/fallbacks/homepage-extras";
import type { TrustBadgeItem, WhyChooseItem, CtaBannerContent } from "@/lib/cms/types";

const TAG = "cms:homepage-extras";

export type AdminTrustBadge = TrustBadgeItem & { order: number };
export type AdminWhyChoose = WhyChooseItem & { order: number };

function mapBadge(r: TrustBadge): TrustBadgeItem {
  return { id: r.id, iconName: r.iconName, title: r.title, description: r.description };
}
function mapWhy(r: WhyChooseRow): WhyChooseItem {
  return { id: r.id, iconName: r.iconName, title: r.title, description: r.description };
}
function mapCta(r: CtaBanner): CtaBannerContent {
  return { headline: r.headline, body: r.body, buttonLabel: r.buttonLabel, buttonHref: r.buttonHref };
}

export const getTrustBadges = cached(
  async (): Promise<TrustBadgeItem[]> => {
    try {
      const rows = await prisma.trustBadge.findMany({ orderBy: { order: "asc" } });
      return rows.length ? rows.map(mapBadge) : TRUST_BADGES_FALLBACK;
    } catch {
      return TRUST_BADGES_FALLBACK;
    }
  },
  ["cms:trust-badges"],
  [TAG],
);

export const getWhyChoose = cached(
  async (): Promise<WhyChooseItem[]> => {
    try {
      const rows = await prisma.whyChooseItem.findMany({ orderBy: { order: "asc" } });
      return rows.length ? rows.map(mapWhy) : WHY_CHOOSE_FALLBACK;
    } catch {
      return WHY_CHOOSE_FALLBACK;
    }
  },
  ["cms:why-choose"],
  [TAG],
);

export const getCtaBanner = cached(
  async (): Promise<CtaBannerContent> => {
    try {
      const row = await prisma.ctaBanner.findUnique({ where: { id: "singleton" } });
      return row ? mapCta(row) : CTA_BANNER_FALLBACK;
    } catch {
      return CTA_BANNER_FALLBACK;
    }
  },
  ["cms:cta-banner"],
  [TAG],
);

export async function getTrustBadgesForAdmin(): Promise<AdminTrustBadge[]> {
  try {
    const rows = await prisma.trustBadge.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ ...mapBadge(r), order: r.order }));
  } catch {
    return [];
  }
}
export async function getWhyChooseForAdmin(): Promise<AdminWhyChoose[]> {
  try {
    const rows = await prisma.whyChooseItem.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ ...mapWhy(r), order: r.order }));
  } catch {
    return [];
  }
}
export async function getCtaBannerForAdmin(): Promise<CtaBannerContent> {
  try {
    const row = await prisma.ctaBanner.findUnique({ where: { id: "singleton" } });
    return row ? mapCta(row) : CTA_BANNER_FALLBACK;
  } catch {
    return CTA_BANNER_FALLBACK;
  }
}
