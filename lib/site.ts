/**
 * Single source of truth for the production URL, environment-based indexing,
 * and the verified business facts used in metadata and JSON-LD.
 *
 * Indexing rule (see docs/launch/README.md):
 *   - Only a Vercel *production* build (VERCEL_ENV=production) renders
 *     `index, follow`. Preview/development builds render `noindex, nofollow`.
 *   - Independently of the build, middleware.ts adds `X-Robots-Tag: noindex,
 *     nofollow` to every response that is NOT served from the canonical host,
 *     so a production build reached through *.vercel.app is still excluded.
 *   - SITE_INDEXABLE=true/false can force the build-level rule when the site
 *     is hosted somewhere other than Vercel. Nothing else toggles indexing.
 */

export const SITE_HOST = "mvcimmigration.com";
export const SITE_URL = `https://${SITE_HOST}`;

/** Hosts that should 301 to SITE_HOST (path + query preserved). */
export const REDIRECT_HOSTS = ["www.mvcimmigration.com"];

/** True when this build may be indexed (production build only). */
export function isIndexableBuild(): boolean {
  const override = process.env.SITE_INDEXABLE;
  if (override === "true") return true;
  if (override === "false") return false;
  return process.env.VERCEL_ENV === "production";
}

/** Absolute production URL for a site path ("/about" → "https://mvcimmigration.com/about"). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${SITE_URL}${clean}`;
}

/**
 * Business facts. Everything here is visible on the site and/or matches the
 * Google Business Profile (checked 2026-10-17). Do not add ratings, reviews,
 * credentials or affiliations that are not published and verifiable.
 */
export const BUSINESS = {
  name: "MVC Immigration Consulting", // Google Business Profile name
  alternateNames: ["MVC Immigration", "My Visa For Canada"],
  url: SITE_URL,
  telephone: "+1-778-288-7388",
  email: "info@myvisa4canada.com",
  address: {
    streetAddress: "2025 Willingdon Avenue, Suite 900",
    addressLocality: "Burnaby",
    addressRegion: "BC",
    // NOTE: website says V5C 0J3; Google Business Profile says V5C 5J3.
    // Confirm with the client and make both sources match.
    postalCode: "V5C 0J3",
    addressCountry: "CA",
  },
  geo: { latitude: 49.266152, longitude: -123.0037664 }, // from the GBP listing
  // Website: "9:00am – 5:00pm, by appointment only". Days are not published,
  // so openingHours is intentionally omitted from JSON-LD until confirmed.
  hoursText: "9:00am – 5:00pm, by appointment only",
  languages: ["English", "Spanish", "Hebrew", "Tagalog", "Cebuano"],
  areaServed: ["Burnaby", "Vancouver", "British Columbia", "Canada"],
  googleBusinessProfileUrl:
    "https://www.google.com/maps/place/?q=place_id:ChIJbeG5rINxhlQRmeXgbkAzXxg",
  sameAs: [
    "https://www.facebook.com/MVCImmigrationCanada",
    "https://www.instagram.com/mvc_immigration",
    "https://www.youtube.com/channel/UChG3MXi0XBvJCXb1rPBZYmA",
  ],
  logoPath: "/logo-header.png",
} as const;

export const FOUNDER = {
  name: "Yaniv Babani",
  jobTitle: "Founder & Regulated Canadian Immigration Consultant (RCIC)",
  rcicNumber: "R519412",
  imagePath: "/team/yaniv.jpg",
  languages: ["English", "Spanish", "Hebrew"],
  alumniOf: [
    "Ashton College",
    "College of Management Academic Studies",
  ],
  regulator: {
    name: "College of Immigration and Citizenship Consultants",
    url: "https://college-ic.ca/",
  },
} as const;
