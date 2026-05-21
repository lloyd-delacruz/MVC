import { describe, it, expect, vi, beforeEach } from "vitest";
import { TESTIMONIALS_FALLBACK } from "@/lib/cms/fallbacks/testimonials";

vi.mock("@/lib/cms/db", () => ({ prisma: { testimonial: { findMany: vi.fn() } } }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { prisma } from "@/lib/cms/db";
import { getTestimonials } from "./testimonials";

const findMany = prisma.testimonial.findMany as unknown as ReturnType<typeof vi.fn>;

describe("getTestimonials", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns fallback when empty", async () => {
    findMany.mockResolvedValue([]);
    expect(await getTestimonials()).toEqual(TESTIMONIALS_FALLBACK);
  });

  it("returns fallback when the DB throws", async () => {
    findMany.mockRejectedValue(new Error("db down"));
    expect(await getTestimonials()).toEqual(TESTIMONIALS_FALLBACK);
  });

  it("maps rows when present", async () => {
    findMany.mockResolvedValue([
      { id: "1", author: "A", location: "L", year: "2024", pathway: "P", quote: "Q", order: 0, published: true },
    ]);
    expect((await getTestimonials())[0].author).toBe("A");
  });
});
