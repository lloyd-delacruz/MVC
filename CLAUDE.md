# CLAUDE.md

Project context for Claude Code sessions on this repo.

## What this is

Marketing site for **My Visa For Canada (MVC)** — a Vancouver-based RCIC immigration consultancy. The site is a port of the client's previous static HTML site into a clean Next.js 14 + Tailwind codebase. Brand identity (logo, colors, type) and section structure follow the reference screenshot at `assets/mvc_revised.png`.

## Stack

- **Next.js 14** (App Router, RSC)
- **Tailwind CSS 3**
- **TypeScript**
- **lucide-react** for icons
- **gray-matter** + **react-markdown** + **remark-gfm** for content
- **Fonts:** Playfair Display (display) + DM Sans (body) via `next/font/google`

## Dev commands

```bash
npm install          # first-time setup
npm run dev          # dev server on port 3000
npm run build        # production build (also validates all routes)
npm run lint         # next lint
```

Open `http://localhost:3000`.

## Directory layout

```
app/
  layout.tsx              # root layout — Header, Footer, global fonts
  page.tsx                # homepage
  globals.css             # Tailwind layers + prose-mvc styles
  about/page.tsx
  contact/page.tsx
  get-started/page.tsx
  why-canada/page.tsx
  success-stories/page.tsx
  faq/page.tsx
  blog/
    page.tsx              # blog index
    [slug]/page.tsx       # individual blog post (markdown rendered)
  pathways/
    page.tsx                       # all-pathways index, grouped by category
    [category]/page.tsx            # category landing — /pathways/<category>
    [category]/[slug]/page.tsx     # individual pathway — /pathways/<category>/<slug>

components/
  site/                   # cross-page chrome
    Header.tsx
    Footer.tsx
  sections/               # homepage + about sections
    Hero.tsx
    TrustBadges.tsx
    Services.tsx
    WhyChoose.tsx
    Team.tsx              # compact homepage team strip
    TeamGallery.tsx       # client component: about-page grid + lightbox modal w/ LanguageChips
    AccoladesGallery.tsx  # client component: about-page badges grid + lightbox modal
    CtaBanner.tsx
  ui/                     # primitives, used everywhere
    Button.tsx            # variants: primary | outline | outlineLight; trail: arrow | calendar | none
    Logo.tsx              # serves /public/logo.svg with light/dark variant
    MapleLeaf.tsx         # inline SVG accent
    PageHero.tsx          # navy-bg banner used at top of inner pages
    SectionHeading.tsx    # centered eyebrow + title + lede
    BottomCta.tsx         # closing "Ready to start your journey?" section
    Prose.tsx             # wraps long-form text with prose-mvc class
    LanguageChips.tsx     # pill row of languages spoken (used inside TeamGallery modal)

content/                  # source-of-truth content; pages read from here
  pages/                  # one .md per top-level page (custom YAML-ish format)
  pathways/               # nested by category — one .md per pathway
    permanent-residence/  # express-entry, canadian-experience-class, federal-skilled-{worker,trades}, provincial-nominee
    work/                 # work-permits, iec, caregiver-program
    study/                # study-permits, partner-schools
    visit/                # visitor-visas
    family/               # family-sponsorship
    citizenship/          # canadian-citizenship
    business/             # entrepreneur-base-category, entrepreneur-regional-pilot
  blog/                   # one .md per post (standard frontmatter + markdown body)

lib/
  pathway-taxonomy.ts     # client-safe: PATHWAY_CATEGORIES + types + categoryForSlug() + pathwayHref()
  pathways.ts             # SERVER-only: markdown parser + loaders. Re-exports the taxonomy.
  blog.ts                 # getAllPosts() and getPost(slug)
  markdown.tsx            # tiny inline renderer for **bold** and [links] inside pathway content; rewrites legacy /pages/* and bare /pathways/<slug> links

public/
  logo.svg                # MVC monogram + wordmark
  team/                   # consultant + team headshots (yaniv.jpg + yaniv.png, adrienne, carisse, khristine, marianne, michelle, nico)
  accolades/              # award + designation badges shown on /about (cicc, tbr-2021..2024)
  why-canada/             # photo library for /why-canada (cities, seasons, "matter-*" topical photos)

assets/                   # original migration source (DO NOT serve from here)
  mvc_revised.png         # reference screenshot the design follows
  logo.svg                # original logo (also copied to /public)
  team/*.png              # original team photos (also copied to /public)

pages/                    # client's old HTML site, kept for reference
  *.html
  blog/*.html
  pathways/*.html

docs/superpowers/specs/   # design spec written during initial brainstorming
```

## Theme tokens (from `tailwind.config.ts`)

| Token | Hex | Use |
|---|---|---|
| `navy.900` | `#001a35` | Footer |
| `navy.800` | `#002242` | Header text, headings, navy banners |
| `navy.700` | `#0a3055` | Hovers on dark |
| `brand.red` | `#c91f1a` | Primary CTAs, accent text, maple leaf |
| `brand.redDark` | `#a01612` | CTA hover |
| `brand.redSoft` | `#fef2f1` | Soft red backgrounds (icon halos, etc.) |
| `cream.50` | `#faf6f0` | Soft section backgrounds, BottomCta bg |

Headlines: `headline-serif` utility class (Playfair Display, weight 500, tight letter-spacing).
Container: `container-x` utility (max-w-1200, responsive padding).

## Content system

### Pathway pages (`content/pathways/<category>/<slug>.md`)

Custom YAML-ish format — frontmatter, then `# Section: Name` blocks containing key/value fields, lists (`-`), nested objects, and block scalars (`|`). Parsed by `lib/pathways.ts` into a typed `PathwayData` object.

URLs are nested by category: `/pathways/<category>/<slug>` (e.g. `/pathways/work/work-permits`). The seven categories are defined in `PATHWAY_CATEGORIES` in `lib/pathways.ts` and each declares which slugs belong to it.

**Adding a new pathway:**

1. Decide which of the 7 categories it belongs to (`permanent-residence`, `work`, `study`, `visit`, `family`, `citizenship`, `business`).
2. Add the slug to the matching `PATHWAY_CATEGORIES` group in `lib/pathways.ts`.
3. Create `content/pathways/<category>/<slug>.md` matching the existing structure (Hero / Overview / Key Facts / Do You Qualify / How It Works / optional FAQ / Bottom CTA).
4. The `[category]/[slug]` route picks it up automatically via `generateStaticParams()`.

Use `pathwayHref(slug)` from `lib/pathways.ts` whenever you need to link to a pathway — it resolves the correct nested URL from the slug. The markdown link rewriter in `lib/markdown.tsx` also auto-rewrites legacy `/pages/pathways/<slug>.html` references to the new nested form.

Some pathways have non-standard sections (Latest Updates, Three Streams, Schools Grid, In-Demand Industries) — `app/pathways/[category]/[slug]/page.tsx` already handles them.

### Blog posts (`content/blog/*.md`)

Standard markdown with YAML frontmatter (`title`, `slug`, `date`, `dek`, `author`, `readTime`). Body is rendered via `react-markdown` + `remark-gfm`. The body opens with a literal `# Body` heading that the renderer strips before display. Adding a post: drop a file in `content/blog/`, the index and `[slug]` route both pick it up.

### Top-level pages (`content/pages/*.md`)

Each top-level page (`/about`, `/contact`, etc.) was hand-built from a corresponding `content/pages/*.md` extract. These markdown files are reference material — the pages don't currently read from them at runtime. Edit copy directly in the `app/<page>/page.tsx` file.

## Patterns to follow

- **Inner page shell:** `<PageHero eyebrow="..." title="..." lede="..." /> ... <BottomCta />`. Sections in between use `container-x` and `py-16 lg:py-20`.
- **Cards:** `rounded-xl border border-slate-100 bg-white p-6 shadow-card hover:shadow-cardHover hover:-translate-y-1`.
- **Icons:** lucide-react. Stroke-width 1.6–1.8 for line icons feels on-brand. Red icons inside a small red square outline work for "service" cards.
- **CTAs:** primary red CTAs get `trail="calendar"` when they're booking-related; outline CTAs get `trail="arrow"`.
- **Active nav state:** derived from `usePathname()` in `Header.tsx` — don't hard-code `active: true`.
- **Lightbox galleries** (`AccoladesGallery`, `TeamGallery`): both are `"use client"`, manage their own `active` state, lock `document.body.style.overflow` while open, and close on `Escape`. Match this pattern for any new modal/lightbox component instead of pulling in a library.

## Relationship to the parent `Websitegemms/CLAUDE.md`

The parent folder's `CLAUDE.md` describes a generic "calm/healing/welcoming" template (sage/clay palette, Fraunces/Cormorant type, full-bleed hero with embedded trust bar). **Those defaults do not apply here.** MVC has its own established brand identity:

- Palette is navy + red + cream — not earth tones. Use the tokens in `tailwind.config.ts`, not the parent doc's `#304830` / `#C0D878`.
- Type pairing is Playfair Display + DM Sans, not Fraunces/Inter.
- Hero (`components/sections/Hero.tsx`) is the existing two-column composition matching `assets/mvc_revised.png` — do **not** rebuild it to the parent doc's full-bleed pattern without explicit client sign-off.
- Footer (`components/site/Footer.tsx`) uses `navy.900`, not `#1C1F1B`.

The parent doc's process rules (mobile-first, four interactive states, Lighthouse 90+, WCAG AA, no `transition-all`, JSON-LD, etc.) **do** apply — those are quality bars, not visual prescriptions.

## Editable content

The site is fully static — no database, no admin panel. All editable content lives in plain TypeScript modules under `lib/content/`:

- `hero.ts`, `services.ts`, `team.ts`, `homepage-extras.ts` — homepage sections
- `about.ts`, `testimonials.ts`, `faqs.ts`, `contact.ts` — inner page content
- `blog.ts` — wraps `lib/blog.ts`, which reads `content/blog/*.md`
- `types.ts` — shared content types (note: `TeamMemberItem` includes a `languages?: string[]` field surfaced by `LanguageChips` inside the `TeamGallery` modal)

The **Accolades** array on `/about` is currently defined inline in `app/about/page.tsx` as a local `ACCOLADES: Accolade[]` const (not yet moved to `lib/content/`). Move it there if it grows.

The **`/why-canada` page** keeps its `stats` and `matters` arrays inline in `app/why-canada/page.tsx` and pulls imagery from `public/why-canada/*.jpg`. Photo filenames are referenced by string — keep them in sync if renaming files.

Other helpers:

- `lib/seo.ts` — per-page metadata (`buildPageMetadata(pageKey)`)
- `lib/icons.ts` — allowlist of lucide icons referenced by name in content
- `lib/faq-categories.ts` — FAQ section grouping

To change copy, edit the relevant `lib/content/*.ts` file and reload. Pathways still live in `content/pathways/<category>/<slug>.md` and are parsed by `lib/pathways.ts`.

## Known gaps & placeholders

- **Calendly URLs** in `lib/content/contact.ts` are `REPLACE-WITH-MVC-CALENDLY/...` — swap when the client provides them.
- **Contact form** is markup-only (no submit handler). Wire to Formspree, Resend, or similar before launch.
- **Consultant photo backdrop** — Yaniv's photo (`/public/team/yaniv.png`) has a transparent/white cutout; the warm-brown studio backdrop from the reference screenshot is achieved via the `bg-[#8a6f5d]` on the wrapper div behind the image. If client provides a version with the brown backdrop baked in, drop the wrapper bg.
- **Team photos** in `public/team/` include faces not currently surfaced in `lib/content/team.ts` — add them when desired.
- **Stray duplicate:** `lib/content/hero 2.ts` is an editor-created duplicate of `hero.ts` — safe to delete; nothing imports it.
- **Git index drift:** every tracked file currently appears as `deleted` in `git status` with an identical untracked copy on disk. The working tree is the source of truth; the index needs to be rebuilt (`git add -A` on a clean review) before the next commit.
- **Security advisory** on `next@14.2.x` — `npm audit fix` to bump.

## What NOT to touch without asking

- The reference image `assets/mvc_revised.png` is the source of design truth. If you're tempted to change colors / typography / section layout, look at it first.
- Logo SVG (`public/logo.svg`) is the client's actual brand asset, not a placeholder.
- Team photos in `public/team/` are real headshots from the client.
- The original HTML in `pages/` is the source of truth for copy if anything seems off in the migration — pull from there, not from your own writing.
