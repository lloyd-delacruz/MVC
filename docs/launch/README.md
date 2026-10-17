# Production launch runbook — mvcimmigration.com

How SEO, indexing, redirects and analytics are wired, and the exact steps
still needed to go live. Data files in this folder:

- `seo-metadata-map.csv` — every indexable URL: intent, target keyword, title, description, H1, canonical, JSON-LD
- `redirect-map.csv` — every recovered old URL → new URL (or 410), reason, verification result

## How it works

| Concern | Where | Behaviour |
|---|---|---|
| Production URL | `lib/site.ts` | `SITE_URL = https://mvcimmigration.com`; used for canonicals, OG, sitemap, JSON-LD |
| Indexing (build) | `lib/site.ts → isIndexableBuild()` + `app/layout.tsx` | `index, follow` only when `VERCEL_ENV=production`; every preview/dev build renders `noindex, nofollow`. `SITE_INDEXABLE=true/false` overrides (non-Vercel hosting only) |
| Indexing (host) | `middleware.ts` | Any host other than `mvcimmigration.com` (e.g. `mvc-bay.vercel.app`, deployment URLs) gets `X-Robots-Tag: noindex, nofollow` — even for a production build |
| www → apex | `middleware.ts` | `www.mvcimmigration.com/*` → 301 to `https://mvcimmigration.com/*` (path + query kept) |
| HTTP → HTTPS | Vercel | Automatic 308 at the edge |
| Trailing slash | `middleware.ts` + `skipTrailingSlashRedirect` | `/about/` → 301 `/about`, merged with the legacy/www redirect so old URLs resolve in one hop |
| Old URLs | `lib/legacy-redirects.ts` | 137 exact + 12 pattern rules → 301 to the closest page, or 410 Gone |
| robots.txt | `app/robots.ts` | Production: allow all + sitemap. Preview: allow all, no sitemap (crawling stays allowed so Google can see the noindex) |
| Sitemap | `app/sitemap.ts` | 43 canonical, indexable URLs (no `/thank-you`, no redirects) |
| Metadata | `lib/seo.ts` | Per-page titles/descriptions, absolute self-canonicals, Open Graph + Twitter, `public/og-default.jpg` |
| JSON-LD | `lib/schema.ts` | ProfessionalService + Person (Yaniv Babani) + WebSite on every page; BreadcrumbList on pathway and blog pages; BlogPosting on articles |
| 404 / 410 | `app/not-found.tsx`, `middleware.ts` | Helpful 404 with genuine 404 status; retired URLs return 410 |
| GA4 | `components/analytics/*` | Loads only for a production build **and** only on `mvcimmigration.com`; no PII; CTA click events + `generate_lead` on `/thank-you` |

## Go-live steps (in order)

1. **Merge the PR** → Vercel builds production.
2. **Vercel → Project `mvc` → Settings → Environment Variables** (Production only):
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = the client's GA4 web-stream ID (`G-…`)
   - optional `GOOGLE_SITE_VERIFICATION` = HTML-tag token, only if a URL-prefix Search Console property is used instead of the DNS method
   - Redeploy production after adding them.
3. **Vercel → Project `mvc` → Settings → Domains**:
   - Add `mvcimmigration.com` → *Production*.
   - Add `www.mvcimmigration.com` → *Production*, **no Vercel redirect** (the middleware does a single 301 to the apex; a Vercel-level redirect would add an extra hop for old `www` URLs).
4. **GoDaddy DNS** (nameservers `ns13/ns14.domaincontrol.com`):
   - `A  @  76.76.21.21` (replace the current `107.180.118.58`)
   - `CNAME  www  cname.vercel-dns.com.`
   - Keep all MX / TXT (email, SPF, DKIM) records unchanged.
   - Wait for Vercel to show both domains as *Valid* and the SSL certificate as issued.
5. **Smoke test** (each should pass):
   ```
   curl -sI https://mvcimmigration.com/                 # 200, no X-Robots-Tag
   curl -sI https://www.mvcimmigration.com/about-us/     # 301 → https://mvcimmigration.com/about
   curl -sI http://mvcimmigration.com/                  # 308 → https
   curl -sI https://mvcimmigration.com/feed/            # 410
   curl -sI https://mvc-bay.vercel.app/                 # X-Robots-Tag: noindex, nofollow (or Vercel login)
   curl -s  https://mvcimmigration.com/robots.txt       # Sitemap line present
   ```
6. **Google Search Console** (business-owned Google account):
   - Add a **Domain property** `mvcimmigration.com`; add the TXT record Google shows at GoDaddy; verify.
   - Add Lloyd (and anyone else) as *Full* user; the business account stays *Owner*.
   - Sitemaps → submit `https://mvcimmigration.com/sitemap.xml`.
   - URL Inspection → *Request indexing* for `/`, `/about`, `/contact` and the service pages listed in `seo-metadata-map.csv`.
7. **GA4** (business-owned account): confirm the property's web stream URL is `https://mvcimmigration.com`; mark `generate_lead` as a key event; open *Realtime* and load the site to confirm page views and a `phone_click`.
8. **Zoho**: set the assessment form's *redirect after submission* URL to `https://mvcimmigration.com/thank-you` so successful submissions record `generate_lead`.
9. **Google Business Profile**: set *Website* to `https://mvcimmigration.com`; make the postal code match the site (see below).

## Open business questions

- Postal code: website `V5C 0J3` vs Google Business Profile `V5C 5J3` — confirm and make both match (`lib/site.ts`, `lib/content/contact.ts`).
- Opening days (site says "9:00am – 5:00pm, by appointment only") — confirm days to add `openingHoursSpecification`.
- Experience: homepage badge says "12+ years", bios say "more than thirteen years".
- Business name varies: "MVC Immigration Consulting" (GBP), "My Visa For Canada", "MVC Immigration Firm" (footer).
- Privacy Policy (`/privacy`) is a factual draft of what the site does — needs the client's review.
- `/lost-your-status-in-canada-what-you-can-do-in-2026/` (recent post) has no new equivalent — migrate it, then add a 301.

## Re-running the checks

The verification scripts used for the launch report live outside the repo; the
same checks can be repeated against any build with `next start`:
`curl -H "Host: mvcimmigration.com" localhost:3000/<path>` for canonical-host
behaviour and `-H "Host: mvc-bay.vercel.app"` for staging behaviour.
