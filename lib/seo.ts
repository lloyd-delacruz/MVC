import type { Metadata } from "next";
import { absoluteUrl, BUSINESS } from "@/lib/site";

/**
 * Page-by-page SEO mapping. The same table is documented (with search intent,
 * target keyword and H1) in docs/launch/seo-metadata-map.csv — keep them in sync.
 *
 * Titles are absolute (no template) so each one is written deliberately and
 * stays ≈ 60 characters. Descriptions aim for 120–160 characters and only state
 * facts that appear on the page.
 */
export interface PageSeo {
  title: string;
  description: string;
  /** Override the default social image (absolute or site-relative path). */
  image?: string;
}

export const DEFAULT_OG_IMAGE = {
  url: "/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "MVC Immigration Consulting — Regulated Canadian Immigration Consultant in Burnaby, BC",
};

export const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    title: "Immigration Consultant Burnaby & Vancouver | MVC Immigration",
    description:
      "Regulated Canadian Immigration Consultant (RCIC) in Burnaby, serving Vancouver and clients worldwide: Express Entry, work and study permits, sponsorship.",
  },
  "/about": {
    title: "About MVC Immigration | Yaniv Babani, RCIC in Burnaby",
    description:
      "Meet Yaniv Babani, RCIC #R519412, and our team. Advice in English, Spanish and Hebrew, with Tagalog- and Cebuano-speaking support for Filipino clients.",
  },
  "/services": {
    title: "Canadian Immigration Services in Burnaby | MVC Immigration",
    description:
      "Express Entry, BC PNP, work permits and LMIA, study permits, visitor visas, family sponsorship, business immigration and citizenship, guided by an RCIC.",
  },
  "/pathways": {
    title: "Canadian Immigration Pathways: PR, Work, Study & Family | MVC",
    description:
      "Every Canadian immigration pathway we handle: Express Entry, provincial nominee programs, work and study permits, family sponsorship and citizenship.",
  },
  "/get-started": {
    title: "How to Immigrate to Canada: Find Your Pathway | MVC Immigration",
    description:
      "Not sure where to start? Answer six quick questions and a Regulated Canadian Immigration Consultant will reply within one business day. Always free.",
  },
  "/free-assessment": {
    title: "Free Canadian Immigration Assessment | MVC Immigration",
    description:
      "Tell us about your goals, education, work and language skills. A Regulated Canadian Immigration Consultant will review your profile and reply with your options.",
  },
  "/why-canada": {
    title: "Why Immigrate to Canada? Life, Work & Family | MVC Immigration",
    description:
      "Universal healthcare, tuition-free public schools, safe communities and room for everyone. What life in Canada offers newcomers and their families.",
  },
  "/success-stories": {
    title: "Client Success Stories & Reviews | MVC Immigration Consulting",
    description:
      "Real clients, real outcomes — families reunited, careers launched and new lives begun in Canada with help from MVC Immigration Consulting in Burnaby, BC.",
  },
  "/faq": {
    title: "Canadian Immigration FAQ | MVC Immigration Consulting",
    description:
      "Clear answers to the questions we hear most about Canadian immigration and about working with MVC, a regulated immigration consultancy in Burnaby, BC.",
  },
  "/blog": {
    title: "Canadian Immigration Blog & Guides | MVC Immigration",
    description:
      "Plain-English guides on Canadian immigration — Express Entry, settlement funds, IELTS, choosing a province and more — from regulated consultants.",
  },
  "/contact": {
    title: "Contact MVC Immigration | Immigration Consultant in Burnaby, BC",
    description:
      "Call +1 778 288 7388, email us, or visit our Burnaby office on Willingdon Avenue by appointment. Book a free assessment with a licensed RCIC.",
  },
  "/privacy": {
    title: "Privacy Policy | MVC Immigration Consulting",
    description:
      "How MVC Immigration Consulting collects, uses and protects the personal information you share through this website, our assessment form and by email.",
  },

  // ── Pathway categories ──────────────────────────────────────────────
  "/pathways/permanent-residence": {
    title: "Permanent Residence in Canada: Express Entry & PNP | MVC",
    description:
      "Express Entry (FSW, CEC, FST) and provincial nominee pathways to Canadian permanent residence, with guidance from a Regulated Canadian Immigration Consultant.",
  },
  "/pathways/work": {
    title: "Work in Canada: Work Permits, LMIA, IEC & Caregivers | MVC",
    description:
      "Work permits with or without an LMIA, International Experience Canada (working holiday) and caregiver pathways — RCIC-led help from MVC Immigration in Burnaby.",
  },
  "/pathways/study": {
    title: "Study in Canada: Study Permits & Partner Schools | MVC",
    description:
      "Study permits and MVC's partner Designated Learning Institutions — plan your studies in Canada and the pathway to permanent residence after graduation.",
  },
  "/pathways/visit": {
    title: "Visit Canada: Visitor Visa (TRV) Help | MVC Immigration",
    description:
      "Temporary Resident Visas for tourism, visiting family and business trips to Canada, prepared and reviewed by a Regulated Canadian Immigration Consultant.",
  },
  "/pathways/family": {
    title: "Family Sponsorship in Canada | MVC Immigration",
    description:
      "Sponsor your spouse, common-law partner, dependent children or parents to Canada, with every step of the application handled by a licensed RCIC.",
  },
  "/pathways/citizenship": {
    title: "Canadian Citizenship Applications | MVC Immigration",
    description:
      "The final step of your immigration journey: eligibility checks and a complete Canadian citizenship application, prepared by a licensed RCIC.",
  },
  "/pathways/business": {
    title: "Business Immigration Consultant: BC PNP Entrepreneur | MVC",
    description:
      "Business immigration to British Columbia through the BC PNP Entrepreneur Base Category and Regional Pilot — RCIC guidance for owners and investors.",
  },

  // ── Pathways (service pages) ────────────────────────────────────────
  "/pathways/permanent-residence/express-entry": {
    title: "Express Entry Consultant in Burnaby & Vancouver | MVC",
    description:
      "RCIC-led Express Entry help — eligibility, CRS strategy, your profile and the PR application under FSW, CEC and the Federal Skilled Trades. Free assessment.",
  },
  "/pathways/permanent-residence/canadian-experience-class": {
    title: "Canadian Experience Class (CEC) Application Help | MVC",
    description:
      "Already working in Canada? The Canadian Experience Class is an Express Entry route to PR for skilled workers with Canadian experience. See if you qualify.",
  },
  "/pathways/permanent-residence/federal-skilled-worker": {
    title: "Federal Skilled Worker Program (FSWP) | MVC Immigration",
    description:
      "The Federal Skilled Worker Program under Express Entry, for foreign-trained professionals immigrating to Canada — eligibility, points and how we help.",
  },
  "/pathways/permanent-residence/federal-skilled-trades": {
    title: "Federal Skilled Trades Program (FSTP) | MVC Immigration",
    description:
      "The Federal Skilled Trades Program under Express Entry, for journeypersons and tradespeople immigrating to Canada — requirements and next steps.",
  },
  "/pathways/permanent-residence/provincial-nominee": {
    title: "BC PNP & Provincial Nominee Program Consultant | MVC",
    description:
      "Provincial Nominee Programs including BC PNP, OINP, AINP and SINP — RCIC guidance on choosing a stream and applying for nomination and permanent residence.",
  },
  "/pathways/work/work-permits": {
    title: "Work Permit & LMIA Consultant in Burnaby | MVC Immigration",
    description:
      "Work legally in Canada with an LMIA-backed job offer, an LMIA-exempt permit or an open work permit. RCIC help for workers and employers.",
  },
  "/pathways/work/iec": {
    title: "International Experience Canada (IEC) & Working Holiday | MVC",
    description:
      "Travel and work in Canada through International Experience Canada — Working Holiday, Young Professionals and International Co-op streams.",
  },
  "/pathways/work/caregiver-program": {
    title: "Caregiver Immigration Pathways to Canada | MVC Immigration",
    description:
      "With the federal caregiver pilots in transition, RCIC guidance on the work-permit, PNP and Express Entry routes open to caregivers today.",
  },
  "/pathways/study/study-permits": {
    title: "Study Permit Consultant | Study in Canada | MVC Immigration",
    description:
      "Study at a Designated Learning Institution in Canada. RCIC help with your study permit application and planning a path to permanent residence.",
  },
  "/pathways/study/partner-schools": {
    title: "Partner Schools (DLIs) in Canada | MVC Immigration",
    description:
      "Study at one of MVC's partner Designated Learning Institutions in British Columbia, Alberta and Ontario, and plan how to stay in Canada after you graduate.",
  },
  "/pathways/visit/visitor-visas": {
    title: "Visitor Visa Consultant: Canada TRV Applications | MVC",
    description:
      "Temporary Resident Visa (TRV) applications for tourism, family visits and business — prepared and reviewed by a Regulated Canadian Immigration Consultant.",
  },
  "/pathways/family/family-sponsorship": {
    title: "Family Sponsorship Consultant: Spouse, Partner & Parents | MVC",
    description:
      "Reunite with your spouse, partner, children or parents in Canada. A licensed RCIC prepares your sponsorship application and guides you through every step.",
  },
  "/pathways/citizenship/canadian-citizenship": {
    title: "Canadian Citizenship Application Help | MVC Immigration",
    description:
      "Ready to become a Canadian citizen? We check your eligibility and prepare your citizenship application start to finish, so you can focus on the test.",
  },
  "/pathways/business/entrepreneur-base-category": {
    title: "BC PNP Entrepreneur Immigration: Base Category | MVC",
    description:
      "Start or buy a business in British Columbia and become a permanent resident through the BC PNP Entrepreneur Immigration Base Category.",
  },
  "/pathways/business/entrepreneur-regional-pilot": {
    title: "BC PNP Entrepreneur Regional Pilot | MVC Immigration",
    description:
      "Start a business in a smaller B.C. community and earn permanent residence through the BC PNP Entrepreneur Immigration Regional Pilot.",
  },
};

interface BuildOpts {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}

/** Build Next metadata with a self-referencing absolute canonical. */
export function buildMetadata(path: string, opts: BuildOpts): Metadata {
  const canonical = absoluteUrl(path);
  const images = opts.image
    ? [{ url: opts.image, width: 1200, height: 630, alt: opts.title }]
    : [DEFAULT_OG_IMAGE];
  return {
    title: { absolute: opts.title },
    description: opts.description,
    alternates: { canonical },
    openGraph: {
      type: opts.type ?? "website",
      url: canonical,
      siteName: BUSINESS.name,
      locale: "en_CA",
      title: opts.title,
      description: opts.description,
      images,
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: images.map((i) => i.url),
    },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Metadata for a route listed in PAGE_SEO. */
export function pageMetadata(path: string): Metadata {
  const seo = PAGE_SEO[path];
  if (!seo) throw new Error(`No SEO entry for ${path} — add it to PAGE_SEO in lib/seo.ts`);
  return buildMetadata(path, seo);
}

/** Truncate to a meta-description length on a word boundary. */
export function clampDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
