import { describe, it, expect, vi, beforeEach } from "vitest";
import { HERO_FALLBACK } from "@/lib/cms/fallbacks/hero";

vi.mock("@/lib/cms/db", () => ({
  prisma: { heroSection: { findUnique: vi.fn() } },
}));
// Bypass the Next cache wrapper in unit tests.
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { prisma } from "@/lib/cms/db";
import { getHero } from "./hero";

const findUnique = prisma.heroSection.findUnique as unknown as ReturnType<typeof vi.fn>;

describe("getHero", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns fallback when the DB is empty", async () => {
    findUnique.mockResolvedValue(null);
    expect(await getHero()).toEqual(HERO_FALLBACK);
  });

  it("returns fallback when the DB throws", async () => {
    findUnique.mockRejectedValue(new Error("db down"));
    expect(await getHero()).toEqual(HERO_FALLBACK);
  });

  it("returns the DB row when present", async () => {
    findUnique.mockResolvedValue({
      ...HERO_FALLBACK,
      id: "singleton",
      headline: "Custom headline",
      updatedAt: new Date(),
    });
    expect((await getHero()).headline).toBe("Custom headline");
  });
});
