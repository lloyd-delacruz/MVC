import type { HeroContent } from "@/lib/cms/types";

// Mirrors the original hardcoded hero in components/sections/Hero.tsx so the
// site renders identically when the DB is empty or unreachable.
export const HERO_FALLBACK: HeroContent = {
  eyebrow: "Regulated Canadian Immigration Consultant",
  headline: "Canadian immigration guidance you can trust.",
  dek: "Licensed RCIC. Personal review. Real guidance for families, workers, students, and businesses—tailored to your goals.",
  guarantees: [
    "RCIC Licensed & Regulated",
    "Proven Results",
    "Personalized, Honest Advice",
    "Multilingual Support",
  ],
  primaryCtaLabel: "Book a Free Assessment",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Explore Pathways",
  secondaryCtaHref: "/pathways",
  imageUrl: "/team/yaniv.png",
  imageAlt: "Yaniv Babani, Founder & RCIC at My Visa For Canada",
  founderName: "Yaniv Babani",
  founderTitle: "Founder & RCIC (RCIC: #R519412)",
  founderQuote: "Your immigration goals, our priority.",
};
