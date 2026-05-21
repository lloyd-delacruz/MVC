# CMS / Admin Panel for the MVC Site — Design Spec

**Date:** 2026-05-20
**Status:** Approved (design); pending implementation plan
**Author:** Brainstormed with Claude Code

## 1. Goal

Let the client (My Visa For Canada) edit website content after launch **without touching code**, via a database-driven admin panel, while keeping the public-facing design **byte-for-byte identical** to today.

Editable modules: (1) Homepage hero, (2) About page, (3) Services, (4) Team members, (5) Testimonials, (6) FAQs, (7) Blog posts, (8) Contact information, (9) SEO metadata — plus the remaining hardcoded homepage text (trust badges, why-choose, CTA banner) so nothing on the homepage stays hardcoded.

## 2. Decisions (locked during brainstorming)

| Decision | Choice |
|---|---|
| Hosting | Vercel (serverless) |
| Build approach | Custom build inside the existing Next.js app (no third-party CMS) |
| Database | Neon Postgres via Prisma ORM |
| Image storage | Vercel Blob |
| Auth | Custom: `bcryptjs` password hashing + `jose` signed httpOnly JWT session cookie, enforced in `middleware.ts`. One role, a few named logins. |
| Editor UX | Markdown for long-form (blog, about body); plain fields for short content. Markdown editor = `<textarea>` + live `react-markdown` preview. |
| Publishing | Instant publish via on-demand revalidation; blog posts have a Draft/Published toggle. |
| Pathways | Out of scope — stay as markdown files. |

## 3. MVC layering inside Next.js

| Layer | Location | Responsibility |
|---|---|---|
| **Model** | `prisma/schema.prisma` + `lib/cms/repositories/*` | Schema/tables and the **only** code that talks to the DB. One repository file per module exposing typed read/write functions, each read wrapped in cache + fallback. |
| **Controller** | `lib/cms/actions/*` (Server Actions), `middleware.ts`, `lib/cms/auth.ts` | All admin writes: validate (Zod) → sanitize → handle image upload → persist → `revalidateTag`/`revalidatePath`. Auth/session + route protection. |
| **View** | Public: existing components (`components/sections/*`, `components/site/*`, `app/**/page.tsx`). Admin: `app/admin/**`. | Public views refactored only to accept content as props (markup unchanged). Admin views are plain functional forms/tables. |

**Design-preservation guarantee:** public component JSX and Tailwind classes do not change. Each hardcoded constant is replaced by a prop whose value comes from a repository read that falls back to today's exact value. Because the markup is untouched, the visual design cannot drift.

## 4. New dependencies

- `prisma`, `@prisma/client`
- `@vercel/blob`
- `zod`
- `bcryptjs` (+ `@types/bcryptjs`)
- `jose`
- `sharp`

Markdown rendering reuses the existing `react-markdown` + `remark-gfm`. No rich-text or CMS dependency added.

## 5. Data model (Prisma)

### Singletons (single-row, edited as one form)
- **HeroSection** — `eyebrow`, `headline`, `dek`, `guarantees String[]`, `primaryCtaLabel`, `primaryCtaHref`, `secondaryCtaLabel`, `secondaryCtaHref`, `imageUrl`, `imageAlt`, `founderName`, `founderTitle`, `founderQuote`.
- **AboutContent** — `heading`, `lede`, `bodyMarkdown`, `imageUrl?`, `imageAlt?`.
- **ContactInfo** — `phone`, `email`, `addressLine`, with child rows:
  - **Office** — `label`, `lines String[]`, `order`.
  - **BookingOption** — `title`, `price`, `description`, `href` (Calendly), `order`.
  - **SocialLink** — `platform`, `url`, `order`.
  - (ContactInfo + children power **both** the contact page and the footer.)
- **HomepageExtras** — captures remaining hardcoded homepage text:
  - **TrustBadge[]** — `iconName`, `title`, `description`, `order`.
  - **WhyChooseItem[]** — `iconName`, `title`, `description`, `order`.
  - **CtaBanner** fields — `headline`, `body`, `buttonLabel`, `buttonHref`.

### Collections (list + add/edit/reorder/delete; each has `order` and `published`)
- **Service** — `title`, `description`, `iconName`, `href`.
- **TeamMember** — `name`, `role`, `imageUrl`, `imageAlt`, `bio?`.
- **Testimonial** — `author`, `location?`, `quote`, `rating?`, `imageUrl?`. (Maps to Success Stories.)
- **Faq** — `category`, `question`, `answer`, `order`.
- **BlogPost** — `slug` (unique), `title`, `dek`, `date`, `author`, `readTime`, `coverImageUrl?`, `status` (DRAFT/PUBLISHED), `bodyMarkdown`, plus SEO `seoTitle?`, `seoDescription?`, `ogImageUrl?`. Replaces `content/blog/*.md`.

### Cross-cutting
- **SeoMeta** — `pageKey` (unique: `home`, `about`, `contact`, `faq`, `why-canada`, `success-stories`, `get-started`, `blog`), `title`, `description`, `ogImageUrl?`. Plus a global default record and a default OG image. Blog-post SEO lives on `BlogPost`. Consumed by Next.js `generateMetadata`.
- **AdminUser** — `email` (unique), `passwordHash`, `name`, `createdAt`. Single role.

### Icons
Lucide icons are stored as a **string name** and resolved at render against an allowlist map in `lib/cms/icons.ts`, with a fallback icon for unknown names. Admin presents a dropdown of allowed icons only — no arbitrary code, no broken icons.

## 6. Fallback safety (required)

`lib/cms/fallbacks/*` holds today's exact hardcoded values (extracted from current components). Every repository read returns DB content, or — if empty **or the DB throws** — the fallback (wrapped in try/catch). Consequences:
- Site renders identically before any seeding.
- Site survives a DB outage.
- No public page can hard-crash on missing content.

## 7. Rendering & instant publish

- Public reads wrapped in `unstable_cache` with a per-module tag, so pages stay fast/static-like and avoid per-request DB hits.
- Admin save controllers call `revalidateTag` (and/or `revalidatePath`) for affected content → edits go live within seconds.
- Public site adds **no** authentication and no per-request auth cost.

## 8. Admin area

```
app/admin/
  login/page.tsx        # only unauthenticated admin route
  layout.tsx            # admin shell: sidebar nav + sign-out (NOT the public design)
  page.tsx              # dashboard
  hero/  homepage/  about/  services/  team/
  testimonials/  faqs/  blog/ (+ blog/[id])  contact/  seo/  users/
middleware.ts           # protects /admin/* except /admin/login
```

- Login → signed httpOnly JWT cookie (`jose`) → `middleware.ts` guards every other `/admin` route.
- Security: bcrypt password hashing; cookie `httpOnly` + `secure` + `sameSite=lax`; login rate-limiting; origin checks on mutations; admin users created via a documented script / seeded first admin (no public signup).
- Admin UI uses Tailwind but is its own simple functional design; it does not import or alter public design.

## 9. Validation, sanitization, uploads

- **Validation:** one Zod schema per module in `lib/cms/validation/`, shared by the form and the server action. Enforces required fields, lengths, URL/email/slug formats.
- **Sanitization:** Markdown rendered **without** `rehype-raw`, so any embedded HTML is inert (XSS-safe by default). Plain fields trimmed and length-capped. Defense-in-depth sanitize pass on save.
- **Uploads (`lib/cms/images.ts`):** validate MIME (`jpeg`/`png`/`webp`) + size (≤ ~5MB) → `sharp` resize to sane max dimensions, convert to WebP, strip metadata → upload to Vercel Blob under organized prefixes (`hero/`, `team/`, `services/`, `testimonials/`, `blog/`, `about/`, `seo/`) → persist returned URL. Add the Blob hostname to `next.config.mjs` `images.remotePatterns` so `next/image` keeps optimizing.

## 10. Migration, docs, testing

- **Seed script** (`prisma/seed.ts` or `scripts/seed-cms.ts`) populates the DB from current content and migrates `content/blog/*.md` into `BlogPost` rows so launch content is identical. Existing markdown kept as backup until verified in production.
- **Docs:**
  - `docs/cms/CLIENT-GUIDE.md` — how the client logs in and edits each module, uploads images, publishes, manages drafts.
  - `docs/cms/SETUP.md` — env vars (`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`), creating the first admin, running migrations/seed, deploy notes.
- **Testing (TDD):** Zod schemas; sanitization; fallback behavior (empty + throwing DB); icon resolution; image pipeline; auth/middleware (unauthenticated `/admin` blocked, login flow); smoke test that public pages render correctly with both an empty and a seeded DB.

## 11. Scope boundaries

**In scope:** the 9 modules + remaining hardcoded homepage text (trust badges, why-choose, CTA banner); admin auth; image uploads; validation/sanitization; SEO fields incl. OG image; seed/migration; client + setup docs.

**Out of scope:**
- Pathways pages — remain markdown files (`content/pathways/**`), unchanged.
- Contact-form **submit handler** — still markup-only; wiring to Formspree/Resend is a separate task. The CMS only makes the displayed contact details editable.
- Calendly URLs become editable fields, but the client supplies the real links.
- No change to public design, routing, or pathways/blog URL structure.

## 12. Build phases (for the implementation plan)

0. **Foundation** — Prisma + Neon, Vercel Blob, Zod base, auth + `middleware.ts`, admin shell + login + dashboard, the repository/cache/fallback pattern, image pipeline, icon allowlist.
1. **Homepage** — Hero, Services, Team, TrustBadges, WhyChoose, CtaBanner (models, fallbacks, admin forms, public wiring).
2. **About, Contact (+ footer), Testimonials, FAQs.**
3. **Blog** — Markdown editor + draft/publish + migration from markdown.
4. **SEO metadata** — per-page + global defaults wired into `generateMetadata`.
5. **Seed/migrate, docs, full verification** — build passes, public pages identical with empty and seeded DB.

## 13. Success criteria

- Client can log into `/admin`, edit all 9 modules + homepage extras, upload images, and see changes live within seconds.
- Public pages are visually identical to pre-CMS (verified against current render / `assets/mvc_revised.png`).
- With an empty or unreachable DB, every public page still renders today's content via fallbacks.
- No auth on any public route; `/admin/*` fully protected.
- `npm run build` and `npm run lint` pass; tests green.
- Client + setup documentation complete.
