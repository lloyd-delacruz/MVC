# Blog Page Build — Design Spec

**Date:** 2026-04-29
**Status:** Approved (chat) — awaiting written-spec confirmation
**Build mode:** Mode C (from-scratch, design DNA from CLAUDE.md)

## Goal

Add a fully-built blog to the MVC Immigration site: one index page plus seven individual post pages, each with a verified Unsplash hero photo and ~800–1,200 words of warm, accurate, RCIC-compliant immigration content.

## File structure

```
pages/blog.html                      # index (card grid)
pages/blog/
  ├── express-entry-explained.html
  ├── pnp-which-province-is-right.html
  ├── family-sponsorship-guide.html
  ├── refusal-letter-how-to-recover.html
  ├── first-90-days-in-canada.html
  ├── when-is-the-right-time-to-apply.html
  └── 2026-immigration-changes.html
src/styles/blog.css                  # shared layout + card grid
src/styles/blog-post.css             # post typography (drop cap, pull quote, prose)
src/scripts/blog.js                  # nothing complex — possibly nothing at all
src/assets/blog/                     # downloaded photos
  ├── express-entry.jpg              (1600w + 800w retina variant per slug)
  ├── pnp.jpg
  ├── family-sponsorship.jpg
  ├── refusal-letter.jpg
  ├── first-90-days.jpg
  ├── right-time-to-apply.jpg
  └── 2026-changes.jpg
tools/fetch-blog-images.mjs          # one-time fetch script (user runs locally)
```

## Index page (`pages/blog.html`)

- Compact navy hero (40–50vh): eyebrow "Resources", H1 "Immigration insights", one-liner sub.
- 7 post cards, 2-col desktop / 1-col mobile, gap-6.
- Card structure:
  - 16:9 photo (lazy-load, explicit width/height)
  - Category pill (amber bg) — one of: Pathway Guide / Process / Settlement / Reflection / Policy Update
  - Date string (e.g. "Mar 14, 2026")
  - H3 title (Fraunces, serif)
  - 2-line dek
  - "Read article →" link (whole card clickable)
- Bottom CTA strip: navy bg, "Got a specific question? Book a free consultation."

## Individual post layout

- Compact navy hero (40–50vh) with category eyebrow, H1, dek, meta line: "Mar 14, 2026 · 6 min read · MVC Editorial Team."
- Hero photo full-bleed below the navy strip, 16:9, ~480px tall desktop / scaled on mobile.
- Single-column prose, max-w 65ch, generous line-height.
- Drop cap on first paragraph (Fraunces, ~4 lines tall).
- One pull quote at roughly 50% scroll position.
- H2 + H3 inline, lists, blockquotes, callout boxes for "Important note" or "RCIC honest take" (these are key trust-builders).
- End of post: author bio strip (placeholder name + RCIC #), "Related articles" (2 cards), "Book a Free Consultation" CTA.

## The 7 posts — topic, slug, category, date, length

| # | Topic | Slug | Category | Date | Words |
|---|---|---|---|---|---|
| 1 | Express Entry Explained | `express-entry-explained` | Pathway Guide | Mar 14, 2026 | ~1,100 |
| 2 | PNP: Which Province Is Right For You | `pnp-which-province-is-right` | Pathway Guide | Feb 22, 2026 | ~1,200 |
| 3 | Family Sponsorship: A Guide for Sponsors | `family-sponsorship-guide` | Pathway Guide | Feb 4, 2026 | ~1,000 |
| 4 | Got a Refusal Letter? Here's What to Do | `refusal-letter-how-to-recover` | Process | Jan 18, 2026 | ~900 |
| 5 | Your First 90 Days in Canada | `first-90-days-in-canada` | Settlement | Dec 28, 2025 | ~1,000 |
| 6 | When Is the Right Time to Apply? | `when-is-the-right-time-to-apply` | Reflection | Nov 30, 2025 | ~800 |
| 7 | 2026 Immigration Changes You Should Know | `2026-immigration-changes` | Policy Update | Oct 19, 2025 | ~900 |

## Photo strategy

- One verified Unsplash photo per post.
- Process: WebSearch for relevant scene → WebFetch the Unsplash photo page → confirm photo ID + photographer → record in fetch script.
- Photos must match topic semantically. No generic handshakes.
- `tools/fetch-blog-images.mjs`: takes URL list, downloads to `src/assets/blog/<slug>.jpg` at 1600w + 800w; user runs once: `node tools/fetch-blog-images.mjs`.
- Each post HTML credits photographer in a small footnote at the bottom.

## SEO

- Each post: unique `<title>`, `<meta description>`, `<link rel="canonical">`, OG tags, `BlogPosting` JSON-LD with datePublished, author, image, articleBody preview.
- Index: `Blog` JSON-LD with `blogPost` array referencing all 7 posts.

## Trust / regulatory constraints (CLAUDE.md)

- Never guarantee outcomes.
- Never paraphrase Government of Canada program names — use Express Entry, LMIA, PGWP exactly.
- Acknowledge anxiety, lead with humans.
- Author byline: `MVC Editorial Team. Reviewed by [Consultant Name], RCIC #RXXXXXXX.` — `<!-- CLIENT: replace -->` markers throughout.

## Cross-site updates

- 12 HTML files: `/blog` placeholder → `/pages/blog.html` in nav + footer.
- Index page also gets a "From our blog" preview strip linking to 3 latest posts (deferred — only if scope allows).

## Out of scope

- Per-post comments, RSS feed, search, tag pages, author pages.
- Image optimization beyond two width variants.
- Backend or CMS integration.

## Open defaults (locked unless user pushes back)

- Author placeholder + RCIC# stays as `[Consultant Name]` / `#RXXXXXXX`.
- Dates staggered as in table above.
- Layout: drop cap + 1 pull quote + related-posts strip per post.
