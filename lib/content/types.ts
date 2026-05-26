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
  languages?: string[];
  imagePosition?: string;
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
  location: string;
  year: string;
  pathway: string;
  quote: string;
};

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export type OfficeItem = {
  id: string;
  iconName: string;
  label: string;
  lines: string[];
  mapsQuery?: string;
};
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

export type SeoMetaContent = {
  pageKey: string;
  title: string;
  description: string;
  ogImageUrl: string | null;
};

export interface BlogPostMeta {
  slug: string;
  title: string;
  dek: string;
  pill: string;
  date: string;
  author: string;
  readTime: string;
  coverImageUrl: string | null;
}

export interface BlogPostFull extends BlogPostMeta {
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
}
