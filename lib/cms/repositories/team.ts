import type { TeamMember } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { TEAM_FALLBACK } from "@/lib/cms/fallbacks/team";
import type { TeamMemberItem } from "@/lib/cms/types";

export type AdminTeamMember = TeamMemberItem & { order: number; published: boolean };

function mapMember(r: TeamMember): TeamMemberItem {
  return { id: r.id, name: r.name, role: r.role, imageUrl: r.imageUrl, imageAlt: r.imageAlt, bio: r.bio };
}

export const getTeam = cached(
  async (): Promise<TeamMemberItem[]> => {
    try {
      const rows = await prisma.teamMember.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      });
      return rows.length ? rows.map(mapMember) : TEAM_FALLBACK;
    } catch {
      return TEAM_FALLBACK;
    }
  },
  ["cms:team"],
  ["cms:team"],
);

export async function getTeamForAdmin(): Promise<AdminTeamMember[]> {
  try {
    const rows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ ...mapMember(r), order: r.order, published: r.published }));
  } catch {
    return [];
  }
}
