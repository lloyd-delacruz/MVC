export type HeroContent = {
  eyebrow: string;
  headline: string;
  dek: string;
  guarantees: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string;
  imageAlt: string;
  founderName: string;
  founderTitle: string;
  founderQuote: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  href: string;
};

export type TeamMemberItem = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
  bio: string | null;
};

export type TrustBadgeItem = {
  id: string;
  iconName: string;
  title: string;
  description: string;
};

export type WhyChooseItem = {
  id: string;
  iconName: string;
  title: string;
  description: string;
};

export type CtaBannerContent = {
  headline: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
};
