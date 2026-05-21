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
  sections/               # homepage sections (also used on /about)
    Hero.tsx
    TrustBadges.tsx
    Services.tsx
    WhyChoose.tsx
    Team.tsx
    CtaBanner.tsx
  ui/                     # primitives, used everywhere
    Button.tsx            # variants: primary | outline | outlineLight; trail: arrow | calendar | none
    Logo.tsx              # serves /public/logo.svg with light/dark variant
    MapleLeaf.tsx         # inline SVG accent
    PageHero.tsx          # navy-bg banner used at top of inner pages
    SectionHeading.tsx    # centered eyebrow + title + lede
    BottomCta.tsx         # closing "Ready to start your journey?" section
    Prose.tsx             # wraps long-form text with prose-mvc class

content/                  # source-of-truth content; pages read from here
  pages/                  # one .md per top-level page (custom YAML-ish format)
  pathways/               # nested by category — one .md per pathway
    permanent-residence/  # express-entry, canadian-experience-class, federal-skilled-{worker,trades}, provincial-nominee
    work/                 # work-permits, post-graduation-work-permit, iec, caregiver-program, spousal-open-work-permit
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
  team/*.png              # consultant + team headshots (yaniv, adrienne, carisse, khristine, marianne, michelle, nico)

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

## CMS / Admin panel

A database-driven CMS lets the client edit content at `/admin` without code. See
`docs/cms/SETUP.md` (developer) and `docs/cms/CLIENT-GUIDE.md` (client).

- **MVC layering:** Models = `prisma/schema.prisma` + `lib/cms/repositories/*` (only DB callers; reads cached + fallback-wrapped). Controllers = server actions in `lib/cms/actions/*` + `middleware.ts` + `lib/cms/auth/*`. Views = the existing public components (now prop-driven, markup unchanged) + admin UI in `app/admin/`.
- **Auth:** custom — bcrypt + `jose` JWT cookie, `middleware.ts` guards `/admin/*` (except `/admin/login`); the `(panel)` route group adds a `requireUser()` layout. No auth on the public site.
- **Public chrome:** `components/site/ChromeGate.tsx` hides Header/Footer on `/admin` while keeping public pages statically rendered.
- **Fallbacks:** every public read falls back to `lib/cms/fallbacks/*` (the original hardcoded content) when the DB is empty/unreachable — the site renders identically with no DB. Blog falls back to `content/blog/*.md`.
- **Editable modules:** hero, homepage extras (trust badges / why-choose / CTA), about, services, team, testimonials, FAQs, blog (with drafts), contact info (+ footer), SEO. Pathways are intentionally NOT in the CMS (still markdown).
- **Publishing:** save → `revalidateTag`/`revalidatePath` → live in seconds.
- **Stack:** Prisma 6 + Postgres (Neon), Vercel Blob (images, optimized via `sharp`), Zod validation, Vitest. Env vars: `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`.
- **Adding a CMS field:** add it to the model in `schema.prisma` → `prisma generate` → update the matching `types.ts`, `fallbacks/*`, `repositories/*` mapper, `validation/*`, `actions/*`, the admin form, and the public component.
- **Tests run via Vitest** (`npm test`). The config uses the `forks` pool for sandbox compatibility; DB is mocked in repository tests.

## Known gaps & placeholders

- **Calendly URLs** in the contact page are `REPLACE-WITH-MVC-CALENDLY/...` — swap when client provides them. (Now editable in the admin Contact section.)
- **Contact form** is markup-only (no submit handler). Wire to Formspree, Resend, or similar before launch.
- **Phone number** — the footer placeholder `+1 (604) 123-4567` was reconciled to the real Burnaby number `+1 778 288 7388` in the contact fallback (`lib/cms/fallbacks/contact.ts`) and is editable in the admin Contact section.
- **Consultant photo backdrop** — Yaniv's photo (`/public/team/yaniv.png`) has a transparent/white cutout; the warm-brown studio backdrop from the reference screenshot is achieved via the `bg-[#8a6f5d]` on the wrapper div behind the image. If client provides a version with the brown backdrop baked in, drop the wrapper bg.
- **Team photos** include `nico.png` and `michelle.png` that aren't currently surfaced — the homepage Team section only shows 4 of the 6 available faces. Add to `components/sections/Team.tsx` when you want them.
- **Security advisory** on `next@14.2.5` — `npm audit fix` to bump.

## What NOT to touch without asking

- The reference image `assets/mvc_revised.png` is the source of design truth. If you're tempted to change colors / typography / section layout, look at it first.
- Logo SVG (`public/logo.svg`) is the client's actual brand asset, not a placeholder.
- Team photos in `public/team/` are real headshots from the client.
- The original HTML in `pages/` is the source of truth for copy if anything seems off in the migration — pull from there, not from your own writing.
