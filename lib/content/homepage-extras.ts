import type { TrustBadgeItem, WhyChooseItem, CtaBannerContent } from "@/lib/content/types";

const TRUST_BADGES: TrustBadgeItem[] = [
  { id: "rcic", iconName: "MapleLeaf", title: "RCIC Licensed", description: "Authorized by the Canadian government to represent, advise, and consult individuals on immigration, citizenship, and refugee matters." },
  { id: "cases", iconName: "Users", title: "2000+ Cases Assisted", description: "Supporting clients across different immigration pathways" },
  { id: "experience", iconName: "Star", title: "12+ Years Experience", description: "Practical knowledge of Canadian immigration programs" },
  { id: "multilingual", iconName: "MessageCircle", title: "Multilingual Support", description: "English, Spanish, Hebrew, Cebuano & Tagalog" },
];

const WHY_CHOOSE: WhyChooseItem[] = [
  { id: "honest", iconName: "ShieldCheck", title: "Clear, Honest Advice", description: "We explain your options in a practical way, so you understand the process before making decisions." },
  { id: "personal", iconName: "UserRound", title: "Personalized Attention", description: "Every case is reviewed based on your background, goals, and immigration pathway." },
  { id: "regulated", iconName: "ScrollText", title: "Led by Regulated Expertise", description: "Your file is guided by a licensed RCIC with in-depth knowledge of Canadian immigration programs." },
];

const CTA_BANNER: CtaBannerContent = {
  headline: "Your Canadian immigration journey starts with a conversation.",
  body: "Book your free 15-minute assessment and let's review your best next step.",
  buttonLabel: "Book Your Free Assessment",
  buttonHref: "#book",
};

export async function getTrustBadges(): Promise<TrustBadgeItem[]> {
  return TRUST_BADGES;
}

export async function getWhyChoose(): Promise<WhyChooseItem[]> {
  return WHY_CHOOSE;
}

export async function getCtaBanner(): Promise<CtaBannerContent> {
  return CTA_BANNER;
}
