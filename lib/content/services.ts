import type { ServiceItem } from "@/lib/content/types";

const SERVICES: ServiceItem[] = [
  {
    id: "express-entry",
    title: "Express Entry",
    description: "Immigration pathway for skilled workers located in and out of Canada.",
    iconName: "Stamp",
    href: "/pathways/permanent-residence/express-entry",
  },
  {
    id: "family-sponsorship",
    title: "Family / Spouse Sponsorship",
    description: "Guidance for spouses, partners, parents and family members to reunite in Canada.",
    iconName: "Heart",
    href: "/pathways/family/family-sponsorship",
  },
  {
    id: "work-permits",
    title: "LMIA / Work Permits",
    description: "Help with employers needing to hire foreign nationals and vice versa.",
    iconName: "Briefcase",
    href: "/pathways/work/work-permits",
  },
  {
    id: "study-permits",
    title: "Study Permits",
    description: "Support for students planning to study in Canada.",
    iconName: "GraduationCap",
    href: "/pathways/study/study-permits",
  },
];

export async function getServices(): Promise<ServiceItem[]> {
  return SERVICES;
}
