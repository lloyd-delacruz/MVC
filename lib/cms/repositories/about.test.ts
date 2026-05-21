import { describe, it, expect, vi, beforeEach } from "vitest";
import { ABOUT_FALLBACK } from "@/lib/cms/fallbacks/about";

vi.mock("@/lib/cms/db", () => ({ prisma: { aboutContent: { findUnique: vi.fn() } } }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { prisma } from "@/lib/cms/db";
import { getAbout } from "./about";

const findUnique = prisma.aboutContent.findUnique as unknown as ReturnType<typeof vi.fn>;

describe("getAbout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns fallback when empty", async () => {
    findUnique.mockResolvedValue(null);
    expect(await getAbout()).toEqual(ABOUT_FALLBACK);
  });

  it("returns fallback when the DB throws", async () => {
    findUnique.mockRejectedValue(new Error("db down"));
    expect(await getAbout()).toEqual(ABOUT_FALLBACK);
  });

  it("maps the row when present", async () => {
    findUnique.mockResolvedValue({ ...ABOUT_FALLBACK, id: "singleton", heading: "New heading" });
    expect((await getAbout()).heading).toBe("New heading");
  });
});
