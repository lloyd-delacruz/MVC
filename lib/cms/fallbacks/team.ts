import type { TeamMemberItem } from "@/lib/cms/types";

// Mirrors the original hardcoded team in components/sections/Team.tsx.
export const TEAM_FALLBACK: TeamMemberItem[] = [
  { id: "fallback-adrienne", name: "Adrienne Omega", role: "Marketing", imageUrl: "/team/adrienne.png", imageAlt: "Adrienne Omega", bio: null },
  { id: "fallback-carisse", name: "Carisse Solatorio", role: "Operations", imageUrl: "/team/carisse.png", imageAlt: "Carisse Solatorio", bio: null },
  { id: "fallback-khristine", name: "Khristine Arancta", role: "Operations", imageUrl: "/team/khristine.png", imageAlt: "Khristine Arancta", bio: null },
  { id: "fallback-marianne", name: "Marianne Folgurinas", role: "Admin", imageUrl: "/team/marianne.png", imageAlt: "Marianne Folgurinas", bio: null },
];
