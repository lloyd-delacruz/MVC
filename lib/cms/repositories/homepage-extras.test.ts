import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  TRUST_BADGES_FALLBACK,
  WHY_CHOOSE_FALLBACK,
  CTA_BANNER_FALLBACK,
} from "@/lib/cms/fallbacks/homepage-extras";

vi.mock("@/lib/cms/db", () => ({
  prisma: {
    trustBadge: { findMany: vi.fn() },
    whyChooseItem: { findMany: vi.fn() },
    ctaBanner: { findUnique: vi.fn() },
  },
}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { prisma } from "@/lib/cms/db";
import { getTrustBadges, getWhyChoose, getCtaBanner } from "./homepage-extras";

const badges = prisma.trustBadge.findMany as unknown as ReturnType<typeof vi.fn>;
const why = prisma.whyChooseItem.findMany as unknown as ReturnType<typeof vi.fn>;
const cta = prisma.ctaBanner.findUnique as unknown as ReturnType<typeof vi.fn>;

describe("homepage-extras repositories", () => {
  beforeEach(() => vi.clearAllMocks());

  it("trust badges fall back when empty or throwing", async () => {
    badges.mockResolvedValue([]);
    expect(await getTrustBadges()).toEqual(TRUST_BADGES_FALLBACK);
    badges.mockRejectedValue(new Error("x"));
    expect(await getTrustBadges()).toEqual(TRUST_BADGES_FALLBACK);
  });

  it("why-choose falls back when empty", async () => {
    why.mockResolvedValue([]);
    expect(await getWhyChoose()).toEqual(WHY_CHOOSE_FALLBACK);
  });

  it("cta banner falls back when missing", async () => {
    cta.mockResolvedValue(null);
    expect(await getCtaBanner()).toEqual(CTA_BANNER_FALLBACK);
  });
});
