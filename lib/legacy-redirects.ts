/**
 * Old-URL → new-URL map for the launch of the Next.js site on mvcimmigration.com.
 *
 * Sources: Wayback Machine CDX index for mvcimmigration.com (WordPress/Elementor
 * site 2022–2026 and the older Webs.com site, /pages/* and /blogs/*), plus
 * Google `site:` results. The full table with reasons lives in
 * docs/launch/redirect-map.csv.
 *
 * Keys are lowercase paths without a trailing slash. Values are either a new
 * path (served as a single 301 by middleware.ts) or GONE (served as 410).
 * Anything not listed falls through to the normal router (404 if unknown).
 *
 * Rule of thumb: map to the closest page with the same intent. Never dump
 * unrelated URLs on the homepage. Dated news with no equivalent → 410.
 */

export const GONE = 410 as const;
export type LegacyTarget = string | typeof GONE;

const PR = "/pathways/permanent-residence";
const EE = `${PR}/express-entry`;
const CEC = `${PR}/canadian-experience-class`;
const FSW = `${PR}/federal-skilled-worker`;
const FST = `${PR}/federal-skilled-trades`;
const PNP = `${PR}/provincial-nominee`;
const WORK = "/pathways/work";
const WORK_PERMITS = `${WORK}/work-permits`;
const IEC = `${WORK}/iec`;
const CAREGIVER = `${WORK}/caregiver-program`;
const STUDY = "/pathways/study";
const STUDY_PERMITS = `${STUDY}/study-permits`;
const PARTNER_SCHOOLS = `${STUDY}/partner-schools`;
const VISITOR = "/pathways/visit/visitor-visas";
const FAMILY = "/pathways/family/family-sponsorship";
const CITIZENSHIP = "/pathways/citizenship/canadian-citizenship";
const BUSINESS = "/pathways/business";

export const LEGACY_REDIRECTS: Record<string, LegacyTarget> = {
  // ── WordPress pages ────────────────────────────────────────────────
  "/about-us": "/about",
  "/how-to-get-started": "/get-started",
  "/assessment": "/free-assessment",
  "/reviews": "/success-stories",
  "/immigrate": PR,
  "/immigrate/express-entry-system": EE,
  "/immigrate/express-entry-system/canadian-experience-class-cec": CEC,
  "/immigrate/express-entry-system/federal-skilled-worker-skill-trades-worker": FSW,
  "/immigrate/provincial-nominee-programpnp": PNP,
  "/immigrate/family-sponsorship-immigration-consultant-vancouver": FAMILY,
  "/immigrate/canadian-citizenship": CITIZENSHIP,
  "/bc-pnp-entrepreneur-program": BUSINESS,
  "/business": BUSINESS,
  "/study": STUDY,
  "/study/study-permit-program": STUDY_PERMITS,
  "/study/partner-schools": PARTNER_SCHOOLS,
  // PGWP / SOWP pages were retired; both are work permits.
  "/study/post-graduation-work-permit-program": WORK_PERMITS,
  "/study/spousal-open-work-permit-program": WORK_PERMITS,
  "/work": WORK,
  "/work/lmia-work-permit": WORK_PERMITS,
  "/work/international-experience-canada-iec": IEC,
  "/work/caregiver-program": CAREGIVER,
  // Team member pages → team section on About
  "/adrienne-omega": "/about",
  "/carisse-solatorio": "/about",
  "/khristinne-araneta": "/about",
  "/marianne-fulguirinas": "/about",
  "/michelle-rose-gallemit": "/about",
  "/michelle-rose-gallemit%ef%bf%bc": "/about",
  "/nico-pelayo": "/about",
  "/yaniv-babani": "/about",
  // Builder/test pages
  "/landing": GONE,
  "/new-one": GONE,
  "/test": GONE,

  // ── WordPress posts with a migrated equivalent ─────────────────────
  "/am-i-too-old-to-immigrate-to-canada": "/blog/am-i-too-old-to-immigrate",
  "/become-a-pr-much-faster-through-these-77-jobs": "/blog/77-jobs-that-fast-track-pr",
  "/busted-dont-believe-these-canadian-immigration-myths": "/blog/immigration-myths-busted",
  "/show-money-or-settlement-funds": "/blog/settlement-funds-explained",
  "/the-most-underrated-immigration-pathway-explained": "/blog/canadas-underrated-pathway",
  "/top-3-mistakes-in-canadian-immigration": "/blog/top-3-immigration-mistakes",
  "/which-canadian-province-should-i-immigrate-to": "/blog/which-canadian-province-is-right",
  "/why-ielts-scores-are-so-important": "/blog/ielts-scores-matter",
  "/why-you-should-hire-an-immigration-consultant": "/blog/when-hiring-a-consultant-pays-off",

  // ── WordPress posts → closest topical page ─────────────────────────
  "/bc-pnp-changes-2026": PNP,
  "/study-permit-inside-canada-2026-can-visitors-workers-or-students-apply-without-leaving-canada":
    STUDY_PERMITS,
  "/study-in-canada-no-need-for-ielts": STUDY_PERMITS,
  "/international-experience-class-or-working-holiday-visa-is-now-open-for-2021": IEC,
  "/immigrate-to-canada-in-2021": "/get-started",
  "/what-makes-mvc-immigration-consulting-stand-out": "/about",
  "/51-most-child-friendly-cities-in-canada": "/why-canada",
  "/most-canadians-happy-globe-survey-finds": "/why-canada",
  "/canada-tops-us-as-most-attractive-destination-for-foreign-workers": "/why-canada",
  "/a-new-ranking-is-giving-canadas-approach-to-immigrants-top-marks-with-a-notable-exception":
    "/why-canada",
  "/latest-changes-in-canadian-immigration-a-pathway-for-future-immigrants-workers-and-students":
    "/blog",

  // ── Dated news with no current equivalent → 410 Gone ───────────────
  "/announcing-the-new-website": GONE,
  "/how-covid-19-affected-canadian-immigration": GONE,
  "/how-covid-19-has-affected-canadian-immigration-part-ii": GONE,
  "/canadian-passport-ranks-among-the-most-powerful-in-the-world-for-2022": GONE,
  "/affordable-living-for-b-c-as-per-2022-economic-plan": GONE,
  "/in-demand-jobs-for-2022-british-columbia-canada": GONE,
  "/atlantic-immigration-pilot-program-aipp-in-2021": GONE,
  "/new-public-policy-for-permanent-residency-in-canada-fastest-pathway": GONE,
  "/beginning-next-year-highly-skilled-immigrants-will-have-a-new-path-to-remaining-in-newfoundland-and-labrador":
    GONE,
  "/canada-proposes-enabling-temporary-residents-to-become-citizens": GONE,
  "/finding-a-job-in-canada": GONE,
  // NOTE: /lost-your-status-in-canada-what-you-can-do-in-2026 is intentionally
  // NOT mapped — it is a recent post with no equivalent. Recommend migrating it
  // to /blog; until then it returns 404.

  // ── WordPress category archives → matching pathway, else blog ─────
  "/category/express-entry": EE,
  "/category/express-entry-canada": EE,
  "/category/federal-skilled-worker": FSW,
  "/category/federal-skilled-trades": FST,
  "/category/family-sponsorship": FAMILY,
  "/category/sponsorship-visa": FAMILY,
  "/category/bc-pnp-immigration-consultant": PNP,
  "/category/bc-provincial-nominee-program": PNP,
  "/category/lmia": WORK_PERMITS,
  "/category/work-permit": WORK_PERMITS,
  "/category/work-visa": WORK_PERMITS,
  "/category/workingholidayvisa": IEC,
  "/category/study-in-canada": STUDY_PERMITS,
  "/category/study-permit": STUDY_PERMITS,
  "/category/studyabroad": STUDY_PERMITS,
  "/category/visitor-visa": VISITOR,
  "/category/canadian-tourist-visa": VISITOR,
  "/category/life-in-canada": "/why-canada",
  "/category/covid-19": GONE,

  // ── Old WordPress sitemaps / feeds ─────────────────────────────────
  "/sitemap_index.xml": "/sitemap.xml",
  "/wp-sitemap.xml": "/sitemap.xml",
  "/page-sitemap.xml": "/sitemap.xml",
  "/post-sitemap.xml": "/sitemap.xml",
  "/category-sitemap.xml": "/sitemap.xml",
  "/feed": GONE,
  "/comments/feed": GONE,

  // ── Older Webs.com site (still partly in Google's index) ───────────
  "/pages/home": "/",
  "/pages/about-mvc-immigration-consulting": "/about",
  "/pages/contact-immigration-consultant-vancouver-canada": "/contact",
  "/pages/assessment": "/free-assessment",
  "/pages/how-to-get-started": "/get-started",
  "/pages/how-to-get-started/assessment-form": "/free-assessment",
  "/pages/how-to-get-started/assessment-form-spanish": "/free-assessment",
  "/pages/how-to-get-started/faq": "/faq",
  "/pages/reviews": "/success-stories",
  "/pages/why-canada": "/why-canada",
  "/pages/immigrate": "/pathways",
  "/pages/immigrate-to-canada": "/pathways",
  "/pages/immigrate/immigrate-to-canada": "/pathways",
  "/pages/immigrate/express-entry-system": EE,
  "/pages/immigrate/express-entry-system/canada-express-entry": EE,
  "/pages/immigrate/express-entry-system/canadian-experience-class-program": CEC,
  "/pages/immigrate/express-entry-system/canadian-federal-skilled-worker-program": FSW,
  "/pages/immigrate/bc-provincial-nominee-program": PNP,
  "/pages/immigrate/canada-family-sponsorship": FAMILY,
  "/pages/immigrate/canadian-citizenship": CITIZENSHIP,
  "/pages/bc-pnp-entrepreneur-program": BUSINESS,
  "/pages/study": STUDY,
  "/pages/study-permit-canada": STUDY_PERMITS,
  "/pages/study/canada-study-permit-program": STUDY_PERMITS,
  "/pages/study/partner-schools": PARTNER_SCHOOLS,
  "/pages/study/post-graduation-work-permit-program-canada": WORK_PERMITS,
  "/pages/study/spousal-open-work-permit-program-canada": WORK_PERMITS,
  "/pages/work": WORK,
  "/pages/work-permit-canada": WORK_PERMITS,
  "/pages/work/work-permit-canada": WORK_PERMITS,
  "/pages/work/labour-market-impact-assessment-work-permit": WORK_PERMITS,
  "/pages/work/canada-caregiver-program": CAREGIVER,
  "/pages/work/canadian-international-experience": IEC,
  "/blogs/vancouver-immigration-consultant-blog": "/blog",
  "/blogs/vancouver-immigration-consultant-blog/477209-why-ielts-scores-are-so-important":
    "/blog/ielts-scores-matter",
  "/blogs/vancouver-immigration-consultant-blog/655118-why-you-should-hire-an-immigration-consultant":
    "/blog/when-hiring-a-consultant-pays-off",
  "/blogs/vancouver-immigration-consultant-blog/774656-show-money-or-settlement-funds":
    "/blog/settlement-funds-explained",
  "/blogs/vancouver-immigration-consultant-blog/765027-study-in-canada---no-need-for-ielts":
    STUDY_PERMITS,
  "/blogs/vancouver-immigration-consultant-blog/658158-atlantic-immigration-pilot-program--aipp--in-2021":
    GONE,
  "/blogs/vancouver-immigration-consultant-blog/665867-new-public-policy-for-permanent-residency-in-canada--fastest-pathway":
    GONE,
  "/blogs/vancouver-immigration-consultant-blog/477159-new-website-under-construction": GONE,
  "/blogs/vancouver-immigration-consultant-blog/477200-announcing-the-new-website": GONE,
  "/blogs/vancouver-immigration-consultant-blog/811329-finding-a-job-in-canada": GONE,
  "/blogs/vancouver-immigration-consultant-blog/832397-canadian-passport-ranks-among-the-most-powerful-in-the-world-for-2022":
    GONE,
  "/blogs/vancouver-immigration-consultant-blog/848304-affordable-living-for-b-c--as-per-2022-economic-plan":
    GONE,
  "/blogs/google-reviews": "/success-stories",
  "/blogs/reviews": "/success-stories",
};

/**
 * Prefix rules for families of URLs (checked after the exact map).
 * Order matters: first match wins.
 */
export const LEGACY_PREFIX_RULES: { prefix: string; target: LegacyTarget }[] = [
  { prefix: "/pages/meet-the-team/", target: "/about" },
  { prefix: "/blogs/google-reviews/", target: "/success-stories" },
  { prefix: "/blogs/reviews/", target: "/success-stories" },
  { prefix: "/blogs/vancouver-immigration-consultant-blog/tagged/", target: "/blog" },
  // Remaining generic category archives (immigration-news, rcic, vancouver…)
  { prefix: "/category/", target: "/blog" },
  { prefix: "/author/", target: GONE },
  { prefix: "/wp-content/", target: GONE },
  { prefix: "/wp-includes/", target: GONE },
  { prefix: "/wp-admin", target: GONE },
  { prefix: "/wp-json", target: GONE },
  { prefix: "/wp-login.php", target: GONE },
  { prefix: "/xmlrpc.php", target: GONE },
];

export function resolveLegacy(pathname: string): LegacyTarget | null {
  let key = pathname.toLowerCase();
  if (key.length > 1) key = key.replace(/\/+$/, "");
  const exact = LEGACY_REDIRECTS[key];
  if (exact !== undefined) return exact;
  // Paginated archives: /category/x/page/2 → same target as /category/x
  const unpaged = key.replace(/\/page\/\d+$/, "");
  if (unpaged !== key && LEGACY_REDIRECTS[unpaged] !== undefined) return LEGACY_REDIRECTS[unpaged];
  for (const rule of LEGACY_PREFIX_RULES) {
    if (key.startsWith(rule.prefix) || `${key}/` === rule.prefix) return rule.target;
  }
  return null;
}
