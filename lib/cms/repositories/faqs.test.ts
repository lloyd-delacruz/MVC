import { describe, it, expect, vi, beforeEach } from "vitest";
import { FAQS_FALLBACK } from "@/lib/cms/fallbacks/faqs";

vi.mock("@/lib/cms/db", () => ({ prisma: { faq: { findMany: vi.fn() } } }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { prisma } from "@/lib/cms/db";
import { getFaqs } from "./faqs";

const findMany = prisma.faq.findMany as unknown as ReturnType<typeof vi.fn>;

describe("getFaqs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns fallback when empty", async () => {
    findMany.mockResolvedValue([]);
    expect(await getFaqs()).toEqual(FAQS_FALLBACK);
  });

  it("returns fallback when the DB throws", async () => {
    findMany.mockRejectedValue(new Error("db down"));
    expect(await getFaqs()).toEqual(FAQS_FALLBACK);
  });

  it("maps rows when present", async () => {
    findMany.mockResolvedValue([
      { id: "1", category: "general", question: "Q?", answer: "A", order: 0, published: true },
    ]);
    expect((await getFaqs())[0].question).toBe("Q?");
  });
});
