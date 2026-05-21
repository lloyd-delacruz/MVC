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

export type AboutContent = {
  eyebrow: string;
  heading: string;
  lede: string;
  bodyMarkdown: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

export type TestimonialItem = {
  id: string;
  author: string;
  location: string | null;
  quote: string;
  rating: number | null;
  imageUrl: string | null;
};

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export type OfficeItem = { id: string; iconName: string; label: string; lines: string[] };
export type BookingOptionItem = {
  id: string;
  title: string;
  price: string;
  description: string;
  href: string;
};
export type SocialLinkItem = { id: string; platform: string; url: string };

export type ContactContent = {
  phone: string;
  email: string;
  addressLine: string;
  offices: OfficeItem[];
  bookingOptions: BookingOptionItem[];
  socialLinks: SocialLinkItem[];
};
