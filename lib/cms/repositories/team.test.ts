import { describe, it, expect, vi, beforeEach } from "vitest";
import { TEAM_FALLBACK } from "@/lib/cms/fallbacks/team";

vi.mock("@/lib/cms/db", () => ({ prisma: { teamMember: { findMany: vi.fn() } } }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { prisma } from "@/lib/cms/db";
import { getTeam } from "./team";

const findMany = prisma.teamMember.findMany as unknown as ReturnType<typeof vi.fn>;

describe("getTeam", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns fallback when empty", async () => {
    findMany.mockResolvedValue([]);
    expect(await getTeam()).toEqual(TEAM_FALLBACK);
  });

  it("returns fallback when the DB throws", async () => {
    findMany.mockRejectedValue(new Error("db down"));
    expect(await getTeam()).toEqual(TEAM_FALLBACK);
  });

  it("maps rows when present", async () => {
    findMany.mockResolvedValue([
      { id: "1", name: "Jo", role: "Ops", imageUrl: "/x.png", imageAlt: "Jo", bio: null, order: 0, published: true },
    ]);
    expect((await getTeam())[0].name).toBe("Jo");
  });
});
