import type { ServiceItem } from "@/lib/content/types";

// Service card photos are self-hosted in /public/services (sourced from Unsplash,
// free license). iconName is retained as a fallback but the cards now render photos.

const SERVICES: ServiceItem[] = [
  {
    id: "express-entry",
    title: "Express Entry",
    description: "Skilled worker pathways to permanent residence.",
    iconName: "Stamp",
    href: "/pathways/permanent-residence/express-entry",
    imageUrl: "/services/express-entry.jpg",
    imageAlt: "Toronto skyline at sunset with the CN Tower — a new life in Canada",
  },
  {
    id: "family-sponsorship",
    title: "Family & Spouse Sponsorship",
    description: "Support for spouses, partners, children, parents, and other eligible family members.",
    iconName: "Heart",
    href: "/pathways/family/family-sponsorship",
    imageUrl: "/services/family-sponsorship.jpg",
    imageAlt: "A father smiling with his two young children, reunited as a family",
  },
  {
    id: "work-permits",
    title: "LMIA / Work Permits",
    description: "Guidance for employers and workers navigating Canadian work authorization.",
    iconName: "Briefcase",
    href: "/pathways/work/work-permits",
    imageUrl: "/services/work-permits.jpg",
    imageAlt: "Two professionals shaking hands in an office after a successful hire",
  },
  {
    id: "study-permits",
    title: "Study Permits",
    description: "Support for students planning to study in Canada.",
    iconName: "GraduationCap",
    href: "/pathways/study/study-permits",
    imageUrl: "/services/study-permits.jpg",
    imageAlt: "International graduates throwing their caps in the air to celebrate",
  },
];

export async function getServices(): Promise<ServiceItem[]> {
  return SERVICES;
}
