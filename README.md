# My Visa For Canada — Marketing Site

Marketing site for **My Visa For Canada (MVC)** — a Vancouver-based RCIC immigration consultancy. The site is a Next.js port of the client's previous static HTML site, with the original brand identity (logo, colors, type) and section structure preserved.

## Stack

- **Next.js 14** (App Router, React Server Components)
- **Tailwind CSS 3**
- **TypeScript**
- **lucide-react** for icons
- **gray-matter** + **react-markdown** + **remark-gfm** for content
- **Playfair Display** (display) + **DM Sans** (body) via `next/font/google`

## Getting started

```bash
npm install          # first-time setup
npm run dev          # dev server on http://localhost:3000
npm run build        # production build (also validates all routes)
npm run lint         # next lint
```

## Project layout

```
app/                          # App Router pages
  layout.tsx                  # root layout — header, footer, fonts
  page.tsx                    # homepage
  globals.css                 # Tailwind layers + prose styles
  about / contact / faq / …   # top-level pages
  blog/
    page.tsx                  # blog index
    [slug]/page.tsx           # individual post (markdown rendered)
  pathways/
    page.tsx                  # pathways index, grouped by category
    [category]/[slug]/page.tsx  # individual pathway page

components/
  site/                       # cross-page chrome (Header, Footer)
  sections/                   # Hero, TrustBadges, Services, WhyChoose, Team,
                              # TeamGallery, AccoladesGallery, CtaBanner
  ui/                         # primitives — Button, PageHero, SectionHeading,
                              # BottomCta, LanguageChips, Logo, MapleLeaf, Prose

content/                      # source-of-truth markdown content
  pages/                      # one .md per top-level page (reference only)
  pathways/                   # nested by category — one .md per pathway
  blog/                       # one .md per blog post

lib/
  pathways.ts                 # parser + types for pathway markdown (server)
  pathway-taxonomy.ts         # client-safe categories + pathwayHref()
  blog.ts                     # getAllPosts() / getPost(slug)
  markdown.tsx                # inline renderer + legacy /pages link rewriter
  seo.ts                      # per-page metadata via buildPageMetadata()
  icons.ts                    # allowlist of lucide icons usable in content
  faq-categories.ts           # FAQ section grouping
  content/                    # editable site copy (TS modules — see below)

public/                       # static assets
  logo.svg
  team/                       # team headshots
  accolades/                  # award + designation badges (shown on /about)
  why-canada/                 # photo library for /why-canada
```

## Theme tokens

Configured in `tailwind.config.ts`:

| Token | Hex | Used for |
|---|---|---|
| `navy.900` | `#001a35` | Footer |
| `navy.800` | `#002242` | Headings, navy banners |
| `navy.700` | `#0a3055` | Hovers on dark |
| `brand.red` | `#c91f1a` | Primary CTAs, accent text, maple leaf |
| `brand.redDark` | `#a01612` | CTA hover |
| `brand.redSoft` | `#fef2f1` | Soft red backgrounds (icon halos) |
| `cream.50` | `#faf6f0` | Soft section backgrounds, BottomCta bg |

Helpers: `headline-serif` utility (Playfair Display, weight 500, tight tracking) and `container-x` (max-w-1200 with responsive padding).

## Adding content

### A new pathway

1. Create `content/pathways/<category>/<slug>.md` matching the existing structure (Hero / Overview / Key Facts / Do You Qualify / How It Works / optional FAQ / Bottom CTA).
2. Add the slug to the appropriate category in `PATHWAY_CATEGORIES` in `lib/pathways.ts`.
3. The `[category]/[slug]` route picks it up automatically via `generateStaticParams()`.

### A new blog post

Drop a markdown file in `content/blog/` with frontmatter (`title`, `slug`, `date`, `dek`, `author`, `readTime`). The body opens with a literal `# Body` heading that the renderer strips. The index and `[slug]` route both pick it up automatically.

### Top-level pages

Top-level pages (`/about`, `/contact`, etc.) currently render copy directly from their `app/<page>/page.tsx` files. The `content/pages/*.md` extracts are reference material.

## Design patterns

- **Inner-page shell:** `<PageHero eyebrow title lede /> ... <BottomCta />` with sections in between using `container-x` and `py-16 lg:py-20`.
- **Cards:** `rounded-xl border border-slate-100 bg-white p-6 shadow-card hover:shadow-cardHover hover:-translate-y-1`.
- **CTAs:** primary red CTAs get `trail="calendar"` when they're booking-related; outline CTAs get `trail="arrow"`.
- **Active nav state:** derived from `usePathname()` in `Header.tsx` — don't hard-code `active: true`.
- **Lightbox galleries:** `AccoladesGallery` and `TeamGallery` are client components that manage their own modal state, lock `document.body.style.overflow` while open, and close on `Escape`. Reuse this pattern instead of pulling in a modal library.

## Editing content

The site is fully static — no database, no admin panel. Editable copy lives in plain TypeScript modules under `lib/content/`:

- `hero.ts`, `services.ts`, `team.ts`, `homepage-extras.ts` — homepage sections
- `about.ts`, `testimonials.ts`, `faqs.ts`, `contact.ts` — inner-page content
- `blog.ts` — wraps `lib/blog.ts`, which reads `content/blog/*.md`
- `types.ts` — shared content types (e.g. `TeamMemberItem.languages?: string[]`, surfaced by `LanguageChips` inside the `TeamGallery` modal)

Edit a file, save, refresh — that's it. The `ACCOLADES` array on `/about` and the `stats` / `matters` arrays on `/why-canada` are still defined inline in their respective `app/<page>/page.tsx` files; move them into `lib/content/` if they grow.

## Known gaps before launch

- **Calendly URLs** in the contact page are `REPLACE-WITH-MVC-CALENDLY/...` — swap when the client provides them.
- **Contact form** is markup-only — wire to Formspree, Resend, or equivalent before launch.
- **Placeholder phone number** `+1 (604) 123-4567` on the homepage footer needs to be reconciled with the real Burnaby number `+1 778 288 7388` (already in `app/contact/page.tsx`).
- **Security advisory** on `next@14.2.x` — run `npm audit fix` to bump.
- **Stray duplicate** `lib/content/hero 2.ts` is an editor-created copy of `hero.ts`; safe to delete.

## Photo credits

Photos on the Why Canada page are sourced from [Unsplash](https://unsplash.com) under their free license (commercial use allowed, attribution not required). Team headshots in `public/team/` are the client's own assets.
