import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/cms/db", () => ({
  prisma: { blogPost: { findMany: vi.fn(), findFirst: vi.fn() } },
}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/cms/fallbacks/blog", () => ({
  BLOG_PILLS: {},
  blogMetaFallback: () => [
    { slug: "fb", title: "FB", dek: "d", pill: "Insights", date: "2026-01-01", author: "A", readTime: "1 min", coverImageUrl: null },
  ],
  blogPostFallback: (slug: string) =>
    slug === "fb"
      ? { slug: "fb", title: "FB", dek: "d", pill: "Insights", date: "2026-01-01", author: "A", readTime: "1 min", coverImageUrl: null, body: "hi" }
      : null,
}));

import { prisma } from "@/lib/cms/db";
import { getAllPosts, getPost } from "./blog";

const findMany = prisma.blogPost.findMany as unknown as ReturnType<typeof vi.fn>;
const findFirst = prisma.blogPost.findFirst as unknown as ReturnType<typeof vi.fn>;

describe("blog repository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getAllPosts returns markdown fallback when DB empty", async () => {
    findMany.mockResolvedValue([]);
    expect((await getAllPosts())[0].slug).toBe("fb");
  });

  it("getAllPosts returns fallback when DB throws", async () => {
    findMany.mockRejectedValue(new Error("db down"));
    expect((await getAllPosts())[0].slug).toBe("fb");
  });

  it("getAllPosts maps published rows when present", async () => {
    findMany.mockResolvedValue([
      { slug: "x", title: "X", dek: "d", pill: "Process", date: "2026-02-02", author: "A", readTime: "2 min", coverImageUrl: null, bodyMarkdown: "b", status: "PUBLISHED" },
    ]);
    const result = await getAllPosts();
    expect(result[0].slug).toBe("x");
  });

  it("getPost returns DB post body when present", async () => {
    findFirst.mockResolvedValue({ slug: "x", title: "X", dek: "d", pill: "Process", date: "2026-02-02", author: "A", readTime: "2 min", coverImageUrl: null, bodyMarkdown: "body!", status: "PUBLISHED" });
    expect((await getPost("x"))?.body).toBe("body!");
  });

  it("getPost falls back to markdown when DB has no row", async () => {
    findFirst.mockResolvedValue(null);
    expect((await getPost("fb"))?.body).toBe("hi");
    expect(await getPost("missing")).toBeNull();
  });
});
