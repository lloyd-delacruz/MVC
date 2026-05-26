import type { TeamMemberItem } from "@/lib/content/types";

const TEAM: TeamMemberItem[] = [
  { id: "yaniv", name: "Yaniv Babani", role: "Owner & RCIC", imageUrl: "/team/yaniv.jpg", imageAlt: "Yaniv Babani", bio: null },
  { id: "adrienne", name: "Adrienne Omega", role: "Marketing", imageUrl: "/team/adrienne.png", imageAlt: "Adrienne Omega", bio: null },
  { id: "carisse", name: "Carisse Solatorio", role: "Operations", imageUrl: "/team/carisse.png", imageAlt: "Carisse Solatorio", bio: null },
  { id: "khristine", name: "Khristinne Araneta", role: "Operations", imageUrl: "/team/khristine.png", imageAlt: "Khristinne Araneta", bio: null },
  { id: "marianne", name: "Marianne Fulguirinas", role: "Admin Support", imageUrl: "/team/marianne.png", imageAlt: "Marianne Fulguirinas", bio: null },
  { id: "nico", name: "Nico Pelayo", role: "Case Processing", imageUrl: "/team/nico.png", imageAlt: "Nico Pelayo", bio: null },
];

export async function getTeam(): Promise<TeamMemberItem[]> {
  return TEAM;
}
