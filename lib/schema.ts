import { absoluteUrl, BUSINESS, FOUNDER, SITE_URL } from "@/lib/site";

/**
 * JSON-LD builders. Every property maps to information visible on the site
 * (contact page, about page, footer) or the Google Business Profile.
 * Deliberately NOT included: aggregateRating/review (self-serving reviews are
 * not eligible and must not be marked up), openingHoursSpecification (days not
 * published), price ranges, and any credential not shown on the site.
 */

export const IDS = {
  business: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  founder: `${SITE_URL}/about#yaniv-babani`,
};

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": IDS.business,
        name: BUSINESS.name,
        alternateName: [...BUSINESS.alternateNames],
        description:
          "Regulated Canadian Immigration Consultant (RCIC) practice in Burnaby, British Columbia, helping families, workers, students and businesses with Canadian immigration.",
        url: SITE_URL,
        logo: absoluteUrl(BUSINESS.logoPath),
        image: absoluteUrl("/og-default.jpg"),
        telephone: BUSINESS.telephone,
        email: BUSINESS.email,
        address: { "@type": "PostalAddress", ...BUSINESS.address },
        geo: { "@type": "GeoCoordinates", ...BUSINESS.geo },
        hasMap: BUSINESS.googleBusinessProfileUrl,
        areaServed: [
          { "@type": "City", name: "Burnaby" },
          { "@type": "City", name: "Vancouver" },
          { "@type": "AdministrativeArea", name: "British Columbia" },
          { "@type": "Country", name: "Canada" },
        ],
        knowsLanguage: [...BUSINESS.languages],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: BUSINESS.telephone,
          email: BUSINESS.email,
          availableLanguage: [...BUSINESS.languages],
        },
        founder: { "@id": IDS.founder },
        sameAs: [...BUSINESS.sameAs],
      },
      {
        "@type": "Person",
        "@id": IDS.founder,
        name: FOUNDER.name,
        jobTitle: FOUNDER.jobTitle,
        image: absoluteUrl(FOUNDER.imagePath),
        url: absoluteUrl("/about"),
        worksFor: { "@id": IDS.business },
        knowsLanguage: [...FOUNDER.languages],
        alumniOf: FOUNDER.alumniOf.map((name) => ({ "@type": "CollegeOrUniversity", name })),
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "license",
          name: "Regulated Canadian Immigration Consultant (RCIC)",
          identifier: FOUNDER.rcicNumber,
          recognizedBy: {
            "@type": "Organization",
            name: FOUNDER.regulator.name,
            url: FOUNDER.regulator.url,
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": IDS.website,
        url: SITE_URL,
        name: BUSINESS.name,
        alternateName: [...BUSINESS.alternateNames],
        inLanguage: "en-CA",
        publisher: { "@id": IDS.business },
      },
    ],
  };
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function blogPosting(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
}) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    ...(post.date ? { datePublished: post.date } : {}),
    inLanguage: "en-CA",
    image: absoluteUrl("/og-default.jpg"),
    // Posts are bylined "MVC Editorial Team" on the page, so the author is the
    // organisation — not a named person.
    author: {
      "@type": "Organization",
      name: post.author || BUSINESS.name,
      url: absoluteUrl("/about"),
    },
    publisher: { "@id": IDS.business },
  };
}

/** Serialise for a <script type="application/ld+json"> tag (escapes "<"). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
