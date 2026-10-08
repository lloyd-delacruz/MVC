import { FREE_ASSESSMENT_URL } from "@/lib/links";
import type { HeroContent } from "@/lib/content/types";

const HERO: HeroContent = {
  eyebrow: "Regulated Canadian Immigration Consultant",
  headline: "Get clear, honest guidance for your Canadian immigration journey.",
  dek: "We help families, workers, students, and businesses understand their Canadian immigration options with clear, personalized advice.",
  guarantees: [
    "RCIC Licensed & Regulated",
    "Personalized Case Review",
    "Multilingual Support",
    "Practical, Honest Guidance",
  ],
  primaryCtaLabel: "Book a Free Assessment",
  primaryCtaHref: FREE_ASSESSMENT_URL,
  secondaryCtaLabel: "Explore Immigration Pathways",
  secondaryCtaHref: "/pathways",
  imageUrl: "/team/yaniv.jpg",
  imageAlt: "Yaniv Babani, Founder & RCIC at My Visa For Canada",
  founderName: "Yaniv Babani",
  founderTitle: "Founder & RCIC (RCIC: #R519412)",
  founderQuote: "Your immigration goals, our priority.",
  reviewsCtaLabel: "See our Google Reviews",
  // Client-supplied share.google short link (Comments 2026-10-07, item 16).
  reviewsCtaHref: "https://share.google/wQnL1oCuOCvkR7jwu",
};

export async function getHero(): Promise<HeroContent> {
  return HERO;
}
