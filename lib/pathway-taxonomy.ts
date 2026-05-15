// Client-safe taxonomy. Mirrors content/pathways/<category>/<slug>.md layout.
// Keep titles in sync with the markdown frontmatter when you rename a pathway.

export type PathwayCategory =
  | "permanent-residence"
  | "work"
  | "study"
  | "visit"
  | "family"
  | "citizenship"
  | "business";

export interface PathwayLink {
  slug: string;
  title: string;
}

export interface PathwayCategoryGroup {
  id: PathwayCategory;
  label: string;
  description: string;
  pathways: PathwayLink[];
}

export const PATHWAY_CATEGORIES: PathwayCategoryGroup[] = [
  {
    id: "permanent-residence",
    label: "Permanent Residence",
    description:
      "Express Entry and provincial pathways to Canadian permanent residence.",
    pathways: [
      { slug: "express-entry", title: "Express Entry" },
      { slug: "canadian-experience-class", title: "Canadian Experience Class" },
      { slug: "federal-skilled-worker", title: "Federal Skilled Worker" },
      { slug: "federal-skilled-trades", title: "Federal Skilled Trades" },
      { slug: "provincial-nominee", title: "Provincial Nominee" },
    ],
  },
  {
    id: "work",
    label: "Work in Canada",
    description: "Work permits, youth mobility, and caregiver pathways.",
    pathways: [
      { slug: "work-permits", title: "Work Permits" },
      { slug: "post-graduation-work-permit", title: "Post-Graduation Work Permit" },
      { slug: "iec", title: "International Experience Canada" },
      { slug: "caregiver-program", title: "Caregiver Program" },
      { slug: "spousal-open-work-permit", title: "Spousal Open Work Permit" },
    ],
  },
  {
    id: "study",
    label: "Study in Canada",
    description:
      "Study permits and our partner Designated Learning Institutions.",
    pathways: [
      { slug: "study-permits", title: "Study Permits" },
      { slug: "partner-schools", title: "Partner Schools" },
    ],
  },
  {
    id: "visit",
    label: "Visit Canada",
    description: "Temporary Resident Visas for tourism, family, and business.",
    pathways: [{ slug: "visitor-visas", title: "Visitor Visas" }],
  },
  {
    id: "family",
    label: "Family",
    description: "Sponsor your spouse, partner, children, or parents.",
    pathways: [{ slug: "family-sponsorship", title: "Family Sponsorship" }],
  },
  {
    id: "citizenship",
    label: "Citizenship",
    description: "The final step — becoming a Canadian citizen.",
    pathways: [{ slug: "canadian-citizenship", title: "Canadian Citizenship" }],
  },
  {
    id: "business",
    label: "Business & Entrepreneur",
    description: "BC PNP entrepreneur streams for business owners.",
    pathways: [
      { slug: "entrepreneur-base-category", title: "Entrepreneur — Base Category" },
      { slug: "entrepreneur-regional-pilot", title: "Entrepreneur — Regional Pilot" },
    ],
  },
];

export function pathwayHref(slug: string): string {
  for (const cat of PATHWAY_CATEGORIES) {
    if (cat.pathways.some((p) => p.slug === slug)) {
      return `/pathways/${cat.id}/${slug}`;
    }
  }
  return "/pathways";
}

export function categoryForSlug(slug: string): PathwayCategory | null {
  const found = PATHWAY_CATEGORIES.find((c) =>
    c.pathways.some((p) => p.slug === slug),
  );
  return found?.id ?? null;
}
