import type { ServiceItem } from "@/lib/cms/types";

// Mirrors the original hardcoded services in components/sections/Services.tsx.
export const SERVICES_FALLBACK: ServiceItem[] = [
  {
    id: "fallback-express-entry",
    title: "Express Entry",
    description: "Skilled worker pathways to permanent residence.",
    iconName: "Stamp",
    href: "#contact",
  },
  {
    id: "fallback-family-sponsorship",
    title: "Family Sponsorship",
    description: "Reunite with your loved ones in Canada.",
    iconName: "Heart",
    href: "#contact",
  },
  {
    id: "fallback-study-permits",
    title: "Study Permits",
    description: "Study in Canada and build your future.",
    iconName: "GraduationCap",
    href: "#contact",
  },
  {
    id: "fallback-work-permits",
    title: "Work Permits",
    description: "Work in Canada with employer-specific or open work permits.",
    iconName: "Briefcase",
    href: "#contact",
  },
];
