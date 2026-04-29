# Blog Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution. This is a content-heavy build with prose content drafted at execution time per task; subagent-driven flow is overkill. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add a fully-built blog (1 index + 7 long-form posts) to the MVC Immigration site with verified Unsplash hero photography, RCIC-compliant copy, and full SEO/JSON-LD coverage.

**Architecture:** Static HTML/CSS that follows the existing pathway-page pattern. Two new shared stylesheets — `blog.css` (index + card grid) and `blog-post.css` (prose typography, drop cap, pull quote). One Node script `tools/fetch-blog-images.mjs` user runs once locally to download verified Unsplash photos to `src/assets/blog/`. Nav/footer `/blog` placeholders rewritten to `/pages/blog.html` across 12 existing HTML files.

**Tech stack:** HTML5, CSS3, vanilla ES modules. Puppeteer (existing) for visual verification. `node:fs/promises` + `node:https` for image fetch. WebSearch + WebFetch for photo research (Claude tools).

---

## Reference: project conventions (do not deviate)

- Section padding: `py-16 md:py-20`. Never `py-24`/`py-32`.
- No `mt-` / `mb-` on `<section>` elements.
- Page hero on inner pages: 40–50vh, navy gradient, no photo.
- Logo: `/src/assets/logo.svg` in nav, `/src/assets/logo-mono.svg` in footer.
- Nav + footer markup must match `/pages/about.html` exactly (copy-paste, then change `is-active` link).
- All paths root-relative (start with `/`).
- Every page: `page-top-offset` class on first `<section>`.
- Sequence: nav → main (with first section having page-top-offset) → footer.
- Run from project root. Server: `node serve.mjs` → http://localhost:3000.

---

## Task 1: Verify project state and start server

**Files:** none modified.

- [ ] **Step 1.1: Confirm dev server is reachable**

```bash
curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:3000/ || node serve.mjs &
```

Expected: `200`. If not 200, start in background, wait, retest.

- [ ] **Step 1.2: Confirm directory layout**

```bash
ls -d pages pages/pathways src/assets src/styles src/scripts tools .screenshots && echo OK
```

Expected: `OK`. If a directory is missing, the prior refactor wasn't applied — stop and report.

---

## Task 2: Photo research — find 7 verified Unsplash photo URLs

**Files:** none yet (research + URL list, written into Task 3 script).

For each topic, use WebSearch then WebFetch to identify a real Unsplash photo. The URL format must be `https://images.unsplash.com/photo-<id>` so the photo CDN can be hit directly. Photographer attribution must be captured for the post footnote.

- [ ] **Step 2.1: Research photo for "Express Entry Explained"**

Goal scene: a focused person at a laptop / a single mature professional in a Canadian-feeling office or apartment. Avoid generic handshake stock.

```
WebSearch query: "unsplash person laptop home office Canadian apartment"
```

Then `WebFetch` the resulting Unsplash photo page URL (e.g., `https://unsplash.com/photos/<slug>`) and confirm the photo exists. Extract:
- Photo ID (the `photo-1234...` segment)
- Photographer name (visible in page metadata)
- Direct CDN URL: `https://images.unsplash.com/photo-<id>?w=1600&q=80`

Record in a scratch list (will be baked into Task 3 script).

- [ ] **Step 2.2: Repeat for the other 6 topics**

Repeat the same Search → Fetch → Verify loop for these scenes:

| Slug | Photo direction |
|---|---|
| `pnp-which-province-is-right` | Canadian provincial landscape — Banff/Rockies, BC coast, prairie fields. Open, decision-making feeling. |
| `family-sponsorship-guide` | Multigenerational family at a window or doorway, soft daylight. Real moment, not posed. |
| `refusal-letter-how-to-recover` | A person at a desk reviewing paperwork, contemplative — not distressed. Honest tone. |
| `first-90-days-in-canada` | Newcomer with luggage, snow or city background — Toronto/Vancouver/Calgary. Hopeful. |
| `when-is-the-right-time-to-apply` | Quiet reflective scene — coffee at a window, journal, calendar. Decision-making mood. |
| `2026-immigration-changes` | Canadian Parliament Hill, IRCC building, or Ottawa skyline. Policy/government tone. |

For each: capture photo ID, photographer name, direct CDN URL.

- [ ] **Step 2.3: Verify all 7 URLs return 200**

```bash
for url in <list of 7 URLs>; do
  echo "$(curl -sIL -o /dev/null -w '%{http_code}' "$url") $url"
done
```

Expected: all `200`. If any 404, retry research for that topic.

---

## Task 3: Image fetch tool

**Files:** Create `tools/fetch-blog-images.mjs`.

- [ ] **Step 3.1: Write the fetch script**

Full code (replace `<URLS>` array with the 7 verified URLs from Task 2):

```js
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import https from 'node:https';

const OUT_DIR = './src/assets/blog';

// [VERIFIED IN TASK 2 — replace photographer + photoId per slug]
const photos = [
  { slug: 'express-entry',       photoId: '<id>', photographer: '<name>', unsplashUrl: '<page url>' },
  { slug: 'pnp',                 photoId: '<id>', photographer: '<name>', unsplashUrl: '<page url>' },
  { slug: 'family-sponsorship',  photoId: '<id>', photographer: '<name>', unsplashUrl: '<page url>' },
  { slug: 'refusal-letter',      photoId: '<id>', photographer: '<name>', unsplashUrl: '<page url>' },
  { slug: 'first-90-days',       photoId: '<id>', photographer: '<name>', unsplashUrl: '<page url>' },
  { slug: 'right-time-to-apply', photoId: '<id>', photographer: '<name>', unsplashUrl: '<page url>' },
  { slug: '2026-changes',        photoId: '<id>', photographer: '<name>', unsplashUrl: '<page url>' },
];

const variants = [
  { suffix: '',     w: 1600 }, // default desktop
  { suffix: '@2x',  w: 2400 }, // retina
  { suffix: '-sm',  w: 800  }, // mobile
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'mvc-image-fetch/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`${res.statusCode} ${url}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => writeFile(dest, Buffer.concat(chunks)).then(resolve, reject));
      res.on('error', reject);
    }).on('error', reject);
  });
}

await mkdir(OUT_DIR, { recursive: true });

for (const p of photos) {
  for (const v of variants) {
    const url = `https://images.unsplash.com/photo-${p.photoId}?w=${v.w}&q=80&fm=jpg&fit=crop`;
    const dest = join(OUT_DIR, `${p.slug}${v.suffix}.jpg`);
    process.stdout.write(`fetching ${p.slug}${v.suffix} (${v.w}w) ... `);
    try {
      await download(url, dest);
      const s = await stat(dest);
      console.log(`✓ ${(s.size / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }
}

// Write attribution manifest for posts to reference
const manifest = photos.map(p => ({
  slug: p.slug, photographer: p.photographer, unsplashUrl: p.unsplashUrl,
}));
await writeFile(join(OUT_DIR, 'attribution.json'), JSON.stringify(manifest, null, 2));
console.log('\nwrote attribution.json');
```

- [ ] **Step 3.2: Sanity-check syntax**

```bash
node --check tools/fetch-blog-images.mjs && echo OK
```

Expected: `OK`.

- [ ] **Step 3.3: Run it (downloads photos)**

```bash
node tools/fetch-blog-images.mjs
```

Expected: 21 lines of `✓ <size> KB` (7 photos × 3 variants), then `wrote attribution.json`. If anything fails, do not proceed; debug.

- [ ] **Step 3.4: Confirm assets**

```bash
ls -la src/assets/blog/ | head -25
```

Expected: 21 `.jpg` files plus `attribution.json`.

---

## Task 4: Build `src/styles/blog.css` (index + card grid)

**Files:** Create `src/styles/blog.css`.

- [ ] **Step 4.1: Write blog.css**

```css
/* ===========================================================
   Blog index — card grid
   =========================================================== */

.blog-grid-section {
  padding: var(--space-16) var(--space-6);
}
@media (min-width: 768px) {
  .blog-grid-section {
    padding: var(--space-20) var(--space-12);
  }
}

.blog-grid-section__inner {
  max-width: var(--max-w-content);
  margin-inline: auto;
}

.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  margin-top: var(--space-10);
}
@media (min-width: 768px) {
  .blog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-8);
  }
}

.blog-card {
  display: flex;
  flex-direction: column;
  background: var(--color-base-100);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform   var(--duration-base) var(--ease-out),
    box-shadow  var(--duration-base) var(--ease-out);
}
.blog-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 48px -16px rgba(40, 30, 20, 0.12);
}

.blog-card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--color-base-300);
  overflow: hidden;
}
.blog-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.blog-card__body {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
}

.blog-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}

.blog-card__pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: rgba(193, 83, 42, 0.12);
  color: var(--color-amber-deep);
  border-radius: 999px;
  font-weight: 500;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.blog-card__date {
  font-size: 12px;
}

.blog-card__title {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.4vw, 28px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-ink);
  font-weight: 500;
  margin: 0;
}

.blog-card__dek {
  color: var(--color-ink-muted);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.blog-card__cta {
  margin-top: auto;
  padding-top: var(--space-3);
  color: var(--color-amber-deep);
  font-size: 14px;
  font-weight: 500;
  align-self: flex-start;
  transition: color var(--duration-fast) var(--ease-out);
}
.blog-card__cta:hover {
  color: var(--color-amber);
}

/* whole card clickable wrapper */
.blog-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 16px;
}
.blog-card-link:focus-visible {
  outline: 2px solid var(--color-amber);
  outline-offset: 4px;
}

/* Bottom CTA strip — reused from pathway pages, no extra rules needed */
```

- [ ] **Step 4.2: Verify CSS parses**

```bash
node -e "const fs=require('fs');const css=fs.readFileSync('src/styles/blog.css','utf8');console.log(css.length>2000?'OK':'too short')"
```

Expected: `OK`.

---

## Task 5: Build `src/styles/blog-post.css` (post typography & layout)

**Files:** Create `src/styles/blog-post.css`.

- [ ] **Step 5.1: Write blog-post.css**

```css
/* ===========================================================
   Blog post — hero photo + prose
   =========================================================== */

/* Full-bleed hero photo below the navy title strip */
.post-hero-photo {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 520px;
  background: var(--color-base-300);
  overflow: hidden;
  margin: 0;
}
.post-hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Article body */
.post-body {
  padding: var(--space-12) var(--space-6) var(--space-16);
}
@media (min-width: 768px) {
  .post-body {
    padding: var(--space-16) var(--space-12) var(--space-20);
  }
}

.post-prose {
  max-width: 65ch;
  margin-inline: auto;
  font-size: 17px;
  line-height: 1.75;
  color: var(--color-ink);
}
@media (min-width: 768px) {
  .post-prose {
    font-size: 18px;
  }
}

.post-prose > p {
  margin: 0 0 var(--space-6);
}

/* Drop cap on first paragraph */
.post-prose > p:first-of-type::first-letter {
  font-family: var(--font-display);
  float: left;
  font-size: 4.6em;
  line-height: 0.85;
  font-weight: 500;
  color: var(--color-amber-deep);
  padding: 0.08em 0.12em 0 0;
  font-style: normal;
}

.post-prose h2 {
  font-family: var(--font-display);
  font-size: clamp(26px, 3vw, 32px);
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--color-ink);
  font-weight: 500;
  margin: var(--space-12) 0 var(--space-4);
}

.post-prose h3 {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1.25;
  color: var(--color-ink);
  font-weight: 500;
  margin: var(--space-8) 0 var(--space-3);
}

.post-prose ul,
.post-prose ol {
  margin: 0 0 var(--space-6);
  padding-left: var(--space-6);
}
.post-prose li {
  margin-bottom: var(--space-2);
}
.post-prose strong {
  font-weight: 600;
  color: var(--color-ink);
}
.post-prose em {
  font-style: italic;
}
.post-prose a {
  color: var(--color-amber-deep);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
.post-prose a:hover {
  color: var(--color-amber);
}

/* Pull quote */
.post-pullquote {
  margin: var(--space-12) 0;
  padding: var(--space-6) 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(22px, 2.6vw, 28px);
  line-height: 1.35;
  color: var(--color-ink);
  text-align: center;
  letter-spacing: -0.01em;
}

/* Callout boxes */
.post-callout {
  margin: var(--space-8) 0;
  padding: var(--space-5) var(--space-6);
  background: var(--color-base-200);
  border-left: 3px solid var(--color-amber);
  border-radius: 4px;
}
.post-callout__label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-amber-deep);
  font-weight: 600;
  margin-bottom: var(--space-2);
}
.post-callout p {
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
}

/* Author bio strip */
.post-author {
  max-width: 65ch;
  margin: var(--space-12) auto 0;
  padding: var(--space-6);
  background: var(--color-base-200);
  border-radius: 12px;
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}
.post-author__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-base-300);
  flex-shrink: 0;
}
.post-author__info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-ink-muted);
}
.post-author__info strong {
  display: block;
  color: var(--color-ink);
  margin-bottom: 4px;
}

/* Photo footnote (Unsplash attribution) */
.post-photo-credit {
  max-width: 65ch;
  margin: var(--space-6) auto 0;
  font-size: 12px;
  color: var(--color-ink-muted);
  letter-spacing: 0.04em;
}
.post-photo-credit a {
  color: inherit;
  text-decoration: underline;
}

/* Related articles strip */
.post-related {
  background: var(--color-base-200);
  padding: var(--space-12) var(--space-6);
}
@media (min-width: 768px) {
  .post-related {
    padding: var(--space-16) var(--space-12);
  }
}
.post-related__inner {
  max-width: var(--max-w-content);
  margin-inline: auto;
}
.post-related__head {
  font-family: var(--font-display);
  font-size: 24px;
  margin: 0 0 var(--space-6);
  letter-spacing: -0.01em;
  color: var(--color-ink);
}
.post-related__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}
@media (min-width: 768px) {
  .post-related__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 5.2: Verify CSS file size**

```bash
wc -c src/styles/blog-post.css
```

Expected: > 4000 bytes.

---

## Task 6: Build `pages/blog.html` (index)

**Files:** Create `pages/blog.html`.

- [ ] **Step 6.1: Copy header / nav / footer scaffolding from `pages/about.html`**

```bash
head -100 pages/about.html
```

Read the head, nav, and footer chunks to use as the scaffold — preserves identical structure (paths, classes, ARIA, JSON-LD pattern).

- [ ] **Step 6.2: Write `pages/blog.html`**

Full skeleton (head + nav + main + footer). The main section contains:
- `<section class="page-hero page-top-offset" aria-labelledby="blog-title">` with eyebrow "Resources", H1 "Immigration insights", sub one-liner.
- `<section class="blog-grid-section">` with `<div class="blog-grid">` containing 7 `<a class="blog-card-link" href="/pages/blog/<slug>.html">` cards. Each card body includes the meta line (pill + date), title, dek, and "Read article →" CTA.
- Bottom CTA strip (navy, py-16, "Got a specific question?" + Book a Free Consultation).

JSON-LD `Blog` schema in `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "MVC Immigration — Insights",
  "url": "https://example.com/pages/blog",
  "blogPost": [
    { "@type": "BlogPosting", "headline": "Express Entry Explained", "datePublished": "2026-03-14", "url": "https://example.com/pages/blog/express-entry-explained" },
    { "@type": "BlogPosting", "headline": "PNP: Which Province Is Right For You", "datePublished": "2026-02-22", "url": "https://example.com/pages/blog/pnp-which-province-is-right" },
    { "@type": "BlogPosting", "headline": "Family Sponsorship: A Guide for Sponsors", "datePublished": "2026-02-04", "url": "https://example.com/pages/blog/family-sponsorship-guide" },
    { "@type": "BlogPosting", "headline": "Got a Refusal Letter? Here's What to Do", "datePublished": "2026-01-18", "url": "https://example.com/pages/blog/refusal-letter-how-to-recover" },
    { "@type": "BlogPosting", "headline": "Your First 90 Days in Canada", "datePublished": "2025-12-28", "url": "https://example.com/pages/blog/first-90-days-in-canada" },
    { "@type": "BlogPosting", "headline": "When Is the Right Time to Apply?", "datePublished": "2025-11-30", "url": "https://example.com/pages/blog/when-is-the-right-time-to-apply" },
    { "@type": "BlogPosting", "headline": "2026 Immigration Changes You Should Know", "datePublished": "2025-10-19", "url": "https://example.com/pages/blog/2026-immigration-changes" }
  ]
}
```

Stylesheet: include `/src/styles/global.css`, `/src/styles/inner-shared.css` (if it's used elsewhere), `/src/styles/blog.css`.

Card data:

| Slug | Pill | Date | Title | Dek (one sentence) |
|---|---|---|---|---|
| `express-entry-explained` | Pathway Guide | Mar 14, 2026 | Express Entry, Explained | Canada's fastest route to permanent residence — what the CRS actually measures, how the draws work, and what to do if your score isn't there yet. |
| `pnp-which-province-is-right` | Pathway Guide | Feb 22, 2026 | PNP: Which Province Is Right For You | A practical comparison of the major provincial nominee streams, framed by occupation, language, and where you actually want to live. |
| `family-sponsorship-guide` | Pathway Guide | Feb 4, 2026 | Family Sponsorship: A Guide for Sponsors | Reuniting your family in Canada — what you commit to as a sponsor, what IRCC will ask, and how to build a strong evidentiary file from day one. |
| `refusal-letter-how-to-recover` | Process | Jan 18, 2026 | Got a Refusal Letter? Here's What to Do | A refusal isn't the end of the road. Here's how to read the grounds, decide between reapply / reconsider / appeal, and rebuild your case. |
| `first-90-days-in-canada` | Settlement | Dec 28, 2025 | Your First 90 Days in Canada | A practical, warm checklist for newcomers — SIN, health card, banking, housing, and the small wins that make Canada feel like home. |
| `when-is-the-right-time-to-apply` | Reflection | Nov 30, 2025 | When Is the Right Time to Apply? | Honest answers on timing — language readiness, finances, life stability — from someone whose job is to tell you the truth, not push paperwork. |
| `2026-immigration-changes` | Policy Update | Oct 19, 2025 | 2026 Immigration Changes You Should Know | A clear-eyed look at what's shifted in Canada's immigration landscape this year and what it means for prospective applicants. |

- [ ] **Step 6.3: Verify the page loads with no console errors**

```bash
curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:3000/pages/blog.html
```

Expected: `200`. Then run a screenshot to verify visually:

```bash
node tools/screenshot.mjs http://localhost:3000/pages/blog.html blog-index
```

Expected: 5 screenshots written to `.screenshots/`, no console errors.

- [ ] **Step 6.4: Read the desktop screenshot**

Use the Read tool on `.screenshots/screenshot-desktop-blog-index.png`. Verify: nav at top, hero with "Immigration insights" H1, 7 cards in 2-col grid, footer at bottom.

---

## Tasks 7–13: Build the 7 individual post pages

Each task follows the same template. The structure is identical; only content + slug + photo differ.

For every post:

- [ ] **Step N.1: Read scaffold from existing pathway page** (`pages/pathways/express-entry.html`) for nav/footer markup pattern. Each post copies this nav/footer wholesale.
- [ ] **Step N.2: Create `pages/blog/<slug>.html`**.
- [ ] **Step N.3: Verify HTTP 200 + console errors clean**.
- [ ] **Step N.4: Read desktop screenshot, confirm visual.**

The post HTML template (replace `<slug>`, `<date>`, `<read time>`, `<photo>`, `<photographer>`, `<unsplash url>`, `<H1>`, `<dek>`, `<category-pill>`, `<H2 sections>`, `<paragraphs>`, `<pull quote>`):

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#1B3557">
  <meta name="color-scheme" content="light">

  <title><H1> · MVC Immigration</title>
  <meta name="description" content="<150-160 char post summary>">
  <link rel="canonical" href="https://example.com/pages/blog/<slug>">

  <meta property="og:type" content="article">
  <meta property="og:title" content="<H1>">
  <meta property="og:description" content="<short summary>">
  <meta property="og:url" content="https://example.com/pages/blog/<slug>">
  <meta property="og:image" content="/src/assets/blog/<photo>.jpg">
  <meta property="article:published_time" content="<ISO date>">
  <meta property="article:author" content="MVC Editorial Team">

  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap">

  <link rel="stylesheet" href="/src/styles/global.css">
  <link rel="stylesheet" href="/src/styles/inner-shared.css">
  <link rel="stylesheet" href="/src/styles/blog-post.css">

  <link rel="icon" type="image/svg+xml" href="/src/assets/logo.svg">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "<H1>",
    "description": "<150-char summary>",
    "image": "https://example.com/src/assets/blog/<photo>.jpg",
    "datePublished": "<ISO date>",
    "author": { "@type": "Person", "name": "[Consultant Name], RCIC #RXXXXXXX" },
    "publisher": { "@type": "Organization", "name": "MVC Immigration" },
    "mainEntityOfPage": "https://example.com/pages/blog/<slug>"
  }
  </script>
</head>
<body>
  <a class="skip-to-content" href="#main">Skip to content</a>

  <!-- NAV: copy verbatim from pages/about.html, change is-active to none, no aria-current="page" -->
  <nav class="site-nav" aria-label="Primary"> [...identical to pages/about.html...] </nav>

  <main id="main" tabindex="-1">
    <section class="page-hero page-top-offset" aria-labelledby="post-title">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow"><category-pill> · <date></p>
        <h1 id="post-title" class="page-hero__title"><H1></h1>
        <p class="page-hero__sub"><dek></p>
        <p class="page-hero__meta"><read time> · MVC Editorial Team</p>
      </div>
    </section>

    <figure class="post-hero-photo">
      <img src="/src/assets/blog/<photo>.jpg"
           srcset="/src/assets/blog/<photo>-sm.jpg 800w, /src/assets/blog/<photo>.jpg 1600w, /src/assets/blog/<photo>@2x.jpg 2400w"
           sizes="100vw"
           alt="<descriptive alt>"
           width="1600" height="900"
           fetchpriority="high">
    </figure>

    <section class="section bg-base-100 post-body">
      <article class="post-prose">
        <p>[opening paragraph — drop cap auto-applied]</p>

        <h2>[Section 1 heading]</h2>
        <p>[paragraphs]</p>

        <h2>[Section 2 heading]</h2>
        <p>[paragraphs]</p>

        <blockquote class="post-pullquote">
          [Pull quote — placed at ~50% scroll]
        </blockquote>

        <h2>[Section 3 heading]</h2>
        <p>[paragraphs]</p>

        <div class="post-callout">
          <span class="post-callout__label">RCIC honest take</span>
          <p>[trust-builder note about no guarantees / when to seek help / regulator reminder]</p>
        </div>

        <h2>[Final section]</h2>
        <p>[paragraphs]</p>
      </article>

      <aside class="post-author">
        <div class="post-author__avatar"></div>
        <div class="post-author__info">
          <strong>MVC Editorial Team</strong>
          <p>Reviewed by [Consultant Name], Regulated Canadian Immigration Consultant (RCIC #RXXXXXXX). <!-- CLIENT: replace --></p>
        </div>
      </aside>

      <p class="post-photo-credit">
        Photo by <a href="<unsplash url>" rel="noopener">@<photographer></a> on
        <a href="https://unsplash.com" rel="noopener">Unsplash</a>.
      </p>
    </section>

    <section class="post-related">
      <div class="post-related__inner">
        <h2 class="post-related__head">Related articles</h2>
        <div class="post-related__grid">
          [2 related blog cards — same .blog-card structure as index]
        </div>
      </div>
    </section>

    <section class="section bottom-cta">
      [navy bg + Book a Free Consultation CTA — identical to bottom CTA on pathway pages]
    </section>
  </main>

  <!-- FOOTER: copy verbatim from pages/about.html -->
  <footer class="site-footer"> [...identical to pages/about.html...] </footer>

  <script src="/src/scripts/nav.js" defer></script>
</body>
</html>
```

The 7 posts to build, with content outlines:

### Task 7: Express Entry Explained

- Slug: `express-entry-explained`
- Date: 2026-03-14
- Read time: 6 min
- Sections (H2):
  1. What Express Entry actually is (define IRCC, ITA, EE pool, three programs: FSW, CEC, FST)
  2. The CRS — what it really measures (age, education, language, work experience, adaptability)
  3. The 6-month myth (timeline reality + what causes delays)
  4. What to do if your score isn't competitive (LMIA, PNP nomination, language retest, additional ECA, education upgrades)
  5. When a consultant earns their fee (profile optimization, document strategy, defensible representations)
- Pull quote: e.g. "A 470 CRS today doesn't mean a 470 CRS in six months — the system rewards momentum."
- RCIC callout: no consultant can guarantee a draw cut-off. We help you build the strongest profile we can; the rest is IRCC.

### Task 8: PNP — Which Province Is Right For You

- Slug: `pnp-which-province-is-right`
- Date: 2026-02-22
- Read time: 7 min
- Sections (H2):
  1. Why PNP exists (federal vs. provincial intent)
  2. Base vs. enhanced streams (and the 600 CRS bonus)
  3. Province-by-province at a glance — Ontario (OINP), British Columbia (BCPNP), Alberta (AAIP), Saskatchewan (SINP), Manitoba (MPNP), Atlantic provinces, Quebec note
  4. How to choose — start with occupation, layer in language and Canadian connection
  5. Common mistakes (applying to the wrong stream, not declaring intent honestly, weak ties to province)
- Pull quote: e.g. "The right province isn't the one with the lowest cut-off — it's the one where you'll actually be living a year from now."
- RCIC callout: stream eligibility shifts every quarter. Don't anchor on what was true last year.

### Task 9: Family Sponsorship — A Guide for Sponsors

- Slug: `family-sponsorship-guide`
- Date: 2026-02-04
- Read time: 6 min
- Sections (H2):
  1. Who you can sponsor (spouses, partners, dependent children, parents/grandparents)
  2. The undertaking — what you're actually agreeing to (3 years for spouses, 20 for parents)
  3. Building a genuine relationship file (photos, joint accounts, communications history)
  4. Income thresholds (LICO, MNI for parents)
  5. Processing realities (12–24 months, what causes delays, biometrics, medicals)
- Pull quote: e.g. "IRCC isn't checking whether you love each other. They're checking whether your story holds up on paper."
- RCIC callout: refusals often come from thin documentation, not relationship validity. Start gathering evidence the day you decide to apply.

### Task 10: Got a Refusal Letter? Here's What to Do.

- Slug: `refusal-letter-how-to-recover`
- Date: 2026-01-18
- Read time: 5 min
- Sections (H2):
  1. First, breathe — a refusal isn't a verdict on you
  2. Read the letter carefully — finding the actual grounds
  3. Three paths: reapply, reconsider, appeal — when each applies
  4. What stays the same and what you change in the next file
  5. The risk of going alone after a refusal
- Pull quote: e.g. "A refusal letter is the most expensive feedback you'll ever get. Use it."
- RCIC callout: appeals (Immigration Appeal Division) have strict timelines — typically 30 days. Don't sit on a refusal letter.

### Task 11: Your First 90 Days in Canada

- Slug: `first-90-days-in-canada`
- Date: 2025-12-28
- Read time: 6 min
- Sections (H2):
  1. Week 1 — the essentials (SIN, bank account, phone plan)
  2. Weeks 2–4 — health card, transit, housing search
  3. Months 2–3 — driver's licence transfer, school enrolment, finding community
  4. The emotional arc no one warns you about
  5. Where to find help (settlement agencies, IRCC newcomer guide)
- Pull quote: e.g. "The paperwork ends. The settling-in begins. Both deserve patience."
- RCIC callout: settlement services are funded by IRCC — most are free for newcomers. You don't have to do this alone.

### Task 12: When Is the Right Time to Apply?

- Slug: `when-is-the-right-time-to-apply`
- Date: 2025-11-30
- Read time: 5 min
- Sections (H2):
  1. The honest answer (it's almost never "next year")
  2. Language readiness (CLB scores and what they mean)
  3. Finances (proof of funds reality)
  4. Life stability (family situation, employment, health)
  5. When *not* to apply (and why we'll tell you so)
- Pull quote: e.g. "We've talked clients out of applying when their file wasn't ready. That conversation costs us a fee. It saves them a refusal."
- RCIC callout: a strong consultant tells you when to wait. Be wary of any one who promises results without seeing your file.

### Task 13: 2026 Immigration Changes You Should Know

- Slug: `2026-immigration-changes`
- Date: 2025-10-19
- Read time: 5 min

Before drafting this post, run **WebSearch** for "Canada IRCC 2026 immigration changes" and similar queries to ground the content in real, current policy. Capture 3–4 actual updates (target levels, category-based draws, francophone targets, processing changes). Cite IRCC where possible.

- Sections (H2):
  1. The big picture — federal targets and direction
  2. Category-based Express Entry draws
  3. Francophone immigration targets outside Quebec
  4. PNP allocation shifts
  5. What this means if you're applying in 2026
- Pull quote: e.g. (use a real, attributable line from IRCC if possible — otherwise a synthesis sentence)
- RCIC callout: policy changes mid-year. What's true in Q1 may shift by Q3. Check current IRCC announcements before betting your file on a strategy.

For each task 7–13, the post HTML follows the template above. After each, run:

```bash
url="http://localhost:3000/pages/blog/<slug>.html"
curl -sf -o /dev/null -w "%{http_code} $url\n" "$url"
node tools/screenshot.mjs "$url" blog-<slug>
```

Confirm 200 + 0 console errors.

---

## Task 14: Update nav and footer `/blog` placeholders across 12 HTML files

**Files:** Modify all 12 HTML files (`index.html`, `pages/*.html`, `pages/pathways/*.html`).

- [ ] **Step 14.1: Find and replace**

```bash
for f in index.html pages/*.html pages/pathways/*.html; do
  sed -i '' 's|href="/blog"|href="/pages/blog.html"|g' "$f"
done
```

- [ ] **Step 14.2: Verify**

```bash
grep -hc '/blog"' index.html pages/*.html pages/pathways/*.html | awk '{s+=$1}END{print s}'
echo "expect 0 lingering /blog placeholders"
grep -h 'href="/blog"' index.html pages/*.html pages/pathways/*.html | head
echo "(should be empty)"
grep -hc '/pages/blog.html' index.html pages/*.html pages/pathways/*.html
```

Expected: zero `href="/blog"`, every page has at least one `/pages/blog.html` reference (footer link).

---

## Task 15: Final verification

**Files:** none modified. Validation only.

- [ ] **Step 15.1: HTTP probe of every blog URL**

```bash
for slug in blog \
            blog/express-entry-explained \
            blog/pnp-which-province-is-right \
            blog/family-sponsorship-guide \
            blog/refusal-letter-how-to-recover \
            blog/first-90-days-in-canada \
            blog/when-is-the-right-time-to-apply \
            blog/2026-immigration-changes; do
  printf "%s  /pages/%s.html\n" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/pages/$slug.html)" "$slug"
done
```

Expected: 8 × `200`.

- [ ] **Step 15.2: Run full batch screenshot check on all blog pages**

Update `tools/screenshot-batch.mjs` to add the 8 blog routes (or write a new `tools/screenshot-blog.mjs`). Run it. Expected: 0 console errors, 0 page errors, 0 broken image requests across 8 pages × 2 viewports.

- [ ] **Step 15.3: Visually verify by reading desktop screenshots**

Read these screenshots and confirm visually:
- `.screenshots/blog-d.png` — index with 7 cards, each with a real photo
- `.screenshots/blog-express-entry-explained-d.png` — full post with hero photo, drop cap, pull quote, RCIC callout, related articles strip
- One other post screenshot of choice for sanity

- [ ] **Step 15.4: Confirm no `py-24` / `py-32` introduced**

```bash
grep -rn 'py-24\|py-32\|padding: *6rem\|padding: *8rem' src/styles/blog*.css pages/blog.html pages/blog/*.html 2>/dev/null || echo "(none — clean)"
```

Expected: `(none — clean)`.

- [ ] **Step 15.5: Final stop-gate report**

Confirm:
- 8 new pages live at expected URLs (200 OK)
- 7 photos downloaded, 21 image variants in `src/assets/blog/`
- Nav `/blog` link works from every page
- Footer `/blog` link works from every page
- No console errors on any page
- No `py-24`/`py-32` padding violations
- Every post has BlogPosting JSON-LD
- Index has Blog JSON-LD with 7 entries
- `[Consultant Name]` placeholder visible (so the client knows what to replace)

Report results. Done.

---

## Self-review

**Spec coverage:** Every spec section maps to a task — file structure (Task 1), photos (Tasks 2–3), CSS (Tasks 4–5), index page (Task 6), 7 posts (Tasks 7–13), nav rewrites (Task 14), SEO/JSON-LD (covered inside Tasks 6 & 7–13), verification (Task 15).

**Placeholder scan:** No "TBD" / "TODO" / vague items. The post-content outlines list specific H2 headings and angles per post; full prose is drafted at execution time per task. The Task 13 instruction to WebSearch IRCC 2026 changes is concrete.

**Type consistency:** Class names match across CSS and HTML (`.blog-card`, `.post-prose`, `.post-pullquote`, `.post-callout`). Slugs match between fetch script, index card hrefs, and post filenames.

**Scope:** 15 tasks for 8 new pages, 2 new stylesheets, 1 new tool, 1 cross-site link rewrite, and verification. Single plan, no decomposition needed.

**Cautions for the executor:**
- The image fetch (Task 3.3) requires real internet access at execution time. If running unattended, the user must run it manually and confirm.
- Task 13 (2026 changes post) needs WebSearch grounding — do not invent policy facts.
- Each post body draft is ~800–1,200 words. Plan ~10–15 minutes of careful writing per post; total Tasks 7–13 ≈ 90 minutes.
