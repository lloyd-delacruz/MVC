import type { SeoMetaContent } from "@/lib/cms/types";

export const SEO_DEFAULT_KEY = "__default__";

// Mirrors the current per-page metadata exports (and the root layout default).
export const SEO_FALLBACKS: Record<string, SeoMetaContent> = {
  __default__: {
    pageKey: "__default__",
    title: "My Visa For Canada — Canadian Immigration Guidance You Can Trust",
    description:
      "Licensed RCIC consultancy in Vancouver, BC. Personal review and real guidance for families, workers, students, and businesses moving to Canada.",
    ogImageUrl: null,
  },
  about: {
    pageKey: "about",
    title: "About MVC Immigration",
    description:
      "Regulated Canadian Immigration Consultants in Vancouver. Personal review and real guidance for families, workers, students, and businesses.",
    ogImageUrl: null,
  },
  contact: {
    pageKey: "contact",
    title: "Contact MVC Immigration",
    description:
      "Get in touch with MVC Immigration — send us a message, visit our offices, or book a 1:1 consultation with a Regulated Canadian Immigration Consultant.",
    ogImageUrl: null,
  },
  faq: {
    pageKey: "faq",
    title: "Frequently Asked Questions",
    description: "Clear answers to the questions we hear most often.",
    ogImageUrl: null,
  },
  "why-canada": {
    pageKey: "why-canada",
    title: "Why Canada",
    description:
      "Universal healthcare. Tuition-free public schools. Safe streets, breathtaking nature, and a culture that genuinely makes room for everyone.",
    ogImageUrl: null,
  },
  "success-stories": {
    pageKey: "success-stories",
    title: "Success Stories",
    description:
      "Real people, real outcomes. Every story here represents a family reunited, a career launched, a new life begun.",
    ogImageUrl: null,
  },
  "get-started": {
    pageKey: "get-started",
    title: "How to Immigrate to Canada — Find Your Pathway",
    description:
      "Answer six quick questions and get a real reply from an RCIC within 1 business day. Always free.",
    ogImageUrl: null,
  },
  blog: {
    pageKey: "blog",
    title: "Immigration Insights",
    description:
      "Plain-English guides, honest answers, and timely commentary on Canadian immigration — written by regulated consultants who actually work the files.",
    ogImageUrl: null,
  },
};

// Pages exposed in the admin SEO editor. "__default__" also covers the homepage.
export const SEO_PAGES = [
  { key: "__default__", label: "Site default (also homepage)" },
  { key: "about", label: "About" },
  { key: "contact", label: "Contact" },
  { key: "faq", label: "FAQ" },
  { key: "why-canada", label: "Why Canada" },
  { key: "success-stories", label: "Success Stories" },
  { key: "get-started", label: "Get Started" },
  { key: "blog", label: "Blog index" },
];

export function seoFallback(pageKey: string): SeoMetaContent {
  return SEO_FALLBACKS[pageKey] ?? SEO_FALLBACKS.__default__;
}
