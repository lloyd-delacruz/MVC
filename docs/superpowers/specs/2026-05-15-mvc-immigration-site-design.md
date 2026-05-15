# My Visa For Canada (MVC) — Marketing Site Design Spec

**Date:** 2026-05-15
**Reference:** `assets/mvc_revised.png`
**Goal:** Recreate the reference screenshot as a production-quality marketing site for an RCIC immigration consultancy in Vancouver, BC.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Fonts:** Playfair Display (headlines) + Inter (body) via `next/font/google`
- **Images:** Unsplash for consultant + team photos; inline SVG for the maple-leaf accent and logo mark

## Brand

| | |
|---|---|
| Firm | My Visa For Canada (MVC) — "My Visa For Canada Immigration Firm" |
| Tagline | Canadian immigration guidance you can trust. |
| Consultant | Yaniv Babani, Founder & RCIC |
| Location | Vancouver, British Columbia, Canada |
| Contact | +1 (604) 123-4567 · info@myvisaforcanada.com |
| RCIC # | R519412 |

## Color tokens (Tailwind extension)

| Token | Hex | Use |
|---|---|---|
| `navy.900` | `#0a1428` | Footer background |
| `navy.800` | `#14213d` | Header bg, CTA banner bg, headline text |
| `navy.700` | `#1c2a4d` | Hovers, borders on dark |
| `red.600` | `#c8102e` | Primary CTAs, accents, maple leaf |
| `red.700` | `#a40d24` | CTA hover |
| `cream.50` | `#faf6f0` | "Why Clients Choose" section bg |
| `slate.600` | `#475569` | Body copy |
| `slate.200` | `#e2e8f0` | Card borders, dividers |

## Section structure

1. **Header** (sticky white) — MVC wordmark + nav links + red "Book a Free Assessment" pill
2. **Hero** (white bg) — split 60/40
   - Left: eyebrow "REGULATED CANADIAN IMMIGRATION CONSULTANT" · serif H1 with red maple-leaf accent · subhead · 2×2 checkmark grid · two CTAs ("Book a Free Assessment" red, "Explore Pathways" outline)
   - Right: rounded photo of consultant; floating dark name card overlay bottom-left
3. **Trust badges row** (white) — 4 stat cards in a single row, each with circular icon, number/title, supporting text
4. **How We Can Help** (white) — centered title; 4 service cards in a row (icon, title, description, red arrow link); "View all services →" link
5. **Why Clients Choose MVC** (cream bg) — centered title; 3 value props with red icon, title, description
6. **Meet the Team** (white) — centered title; 4 circular avatars row; "Meet the full team →"
7. **CTA banner** (navy bg) — headline + subhead + red button
8. **Footer** (navy.900) — 4 columns (Brand+socials, Quick Links, Services, Contact Us) + bottom strip

## File layout

```
app/
  layout.tsx          # fonts, metadata
  page.tsx            # composes all sections
  globals.css         # tailwind + global resets
components/
  site/
    Header.tsx
    Footer.tsx
  sections/
    Hero.tsx
    TrustBadges.tsx
    Services.tsx
    WhyChoose.tsx
    Team.tsx
    CtaBanner.tsx
  ui/
    Button.tsx        # red + outline variants
    MapleLeaf.tsx     # inline SVG accent
    Logo.tsx          # MVC wordmark
tailwind.config.ts
next.config.mjs
package.json
```

## Responsive behavior

- **≥1024px (lg):** layout as shown in screenshot
- **768–1023px (md):** trust badges 2×2; services 2×2; team stays 4 across
- **<768px (mobile):** hero stacks (photo above text); all card rows collapse to 1 column; nav becomes hamburger drawer; footer columns stack

## Acceptance criteria

- Visual match: side-by-side comparison with `assets/mvc_revised.png` shows matching layout, colors, typography hierarchy, and component shapes.
- All 8 sections rendered with content from the spec.
- Loads cleanly via `npm run dev` at `http://localhost:3000`.
- No console errors. No layout shift on load.
- Responsive at 375px, 768px, 1280px.

## Out of scope

- Backend (no working form submission — CTAs link to `#contact` anchor).
- CMS integration.
- Subpages (About, Services detail, etc.).
- Analytics / SEO beyond basic meta tags.
- Accessibility audit beyond semantic HTML and alt text.
