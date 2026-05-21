import type { TrustBadgeItem, WhyChooseItem, CtaBannerContent } from "@/lib/cms/types";

// Mirrors components/sections/TrustBadges.tsx
export const TRUST_BADGES_FALLBACK: TrustBadgeItem[] = [
  { id: "fallback-rcic", iconName: "MapleLeaf", title: "RCIC Licensed", description: "Regulated by the College of Immigration and Citizenship Consultants" },
  { id: "fallback-cases", iconName: "Users", title: "500+ Cases Assisted", description: "Helping individuals and families achieve their Canadian dreams" },
  { id: "fallback-experience", iconName: "Star", title: "12+ Years Experience", description: "Deep knowledge of Canadian immigration pathways" },
  { id: "fallback-multilingual", iconName: "MessageCircle", title: "Multilingual Support", description: "English, Spanish, Hebrew, Cebuano, Tagalog & Bangla" },
];

// Mirrors components/sections/WhyChoose.tsx
export const WHY_CHOOSE_FALLBACK: WhyChooseItem[] = [
  { id: "fallback-honest", iconName: "ShieldCheck", title: "Honest Advice", description: "Clear, straightforward guidance that's in your best interest." },
  { id: "fallback-personal", iconName: "UserRound", title: "Personal Attention", description: "Every case is personally reviewed and tailored to your situation." },
  { id: "fallback-regulated", iconName: "ScrollText", title: "Regulated Expertise", description: "Licensed RCIC with in-depth knowledge of Canadian immigration law." },
];

// Mirrors components/sections/CtaBanner.tsx
export const CTA_BANNER_FALLBACK: CtaBannerContent = {
  headline: "Your Canadian journey starts with a conversation.",
  body: "Book your free 15-minute assessment and let's explore your best pathway together.",
  buttonLabel: "Book Your Free Assessment",
  buttonHref: "#book",
};
