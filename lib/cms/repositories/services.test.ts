import { describe, it, expect, vi, beforeEach } from "vitest";
import { SERVICES_FALLBACK } from "@/lib/cms/fallbacks/services";

vi.mock("@/lib/cms/db", () => ({
  prisma: { service: { findMany: vi.fn() } },
}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { prisma } from "@/lib/cms/db";
import { getServices } from "./services";

const findMany = prisma.service.findMany as unknown as ReturnType<typeof vi.fn>;

describe("getServices", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns fallback when there are no rows", async () => {
    findMany.mockResolvedValue([]);
    expect(await getServices()).toEqual(SERVICES_FALLBACK);
  });

  it("returns fallback when the DB throws", async () => {
    findMany.mockRejectedValue(new Error("db down"));
    expect(await getServices()).toEqual(SERVICES_FALLBACK);
  });

  it("maps published rows when present", async () => {
    findMany.mockResolvedValue([
      { id: "1", title: "T", description: "D", iconName: "Stamp", href: "/x", order: 0, published: true },
    ]);
    const result = await getServices();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("T");
  });
});
