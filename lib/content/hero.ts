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
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "Explore Immigration Pathways",
  secondaryCtaHref: "/pathways",
  imageUrl: "/team/yaniv.jpg",
  imageAlt: "Yaniv Babani, Founder & RCIC at My Visa For Canada",
  founderName: "Yaniv Babani",
  founderTitle: "Founder & RCIC (RCIC: #R519412)",
  founderQuote: "Your immigration goals, our priority.",
};

export async function getHero(): Promise<HeroContent> {
  return HERO;
}
