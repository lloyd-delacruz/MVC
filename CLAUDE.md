# CLAUDE.md — Client Website Build Rules

Production rules for building bespoke client websites from a shared template. Speed comes from the template; soul comes from these rules.

**The vibe:** warm, human, hopeful, trustworthy. Sites should feel like a conversation with someone who genuinely cares — people are making life-changing decisions here. Grounded warmth, not corporate coldness. Never sterile, never bureaucratic, never intimidating.

**The bar:** FAANG-grade. Lighthouse 90+, WCAG 2.1 AA, fully responsive across mobile/tablet/desktop, SEO-structured, zero console noise. Every interactive element has four states. No exceptions.

---

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code. Every session.
- **Read everything in `assets/`** — screenshots of the client's current site, brand assets, inspiration. Whatever the client provided, ingest it before designing.
- **Identify the build mode** (below) before touching code.
- **Start `serve.mjs`** in the background. Don't start a second instance if it's running.

---

## Reference Folders

Check these at the start of every project:

- `assets/screenshots/` — the client's **current website** screenshots. The redesign reference (Mode A).
- `assets/brand/` (or any `brand_assets/` folder) — logos, color palettes, fonts, photography. **Authoritative** for identity. If a brand color, font, or logo is defined here, use it. Don't invent.
- `assets/inspiration/` — only present in Mode B. Sites the client wants to match exactly.

If both a screenshot folder and a brand folder exist, the brand folder wins for color, type, and logo. The screenshots win for content and structure.

---

## Build Modes

### Mode A — Redesign from client reference (DEFAULT)

The most common case. Screenshots in `assets/screenshots/` are the client's **current website** — context for the redesign, **not** a target to reproduce. You are improving on what they have, not cloning it.

**What to extract from the screenshots:**
- Information architecture: pages, sections, navigation structure.
- Content: headlines, body copy, visa pathways offered, testimonials, contact info, office hours, locations.
- Trust signals: RCIC number, CICC membership, years of experience, number of approved cases, countries served.
- Calls to action and conversion points.
- Brand hints: any logo, color cues, photography style (only authoritative if confirmed in `assets/brand/`).
- Business context: which immigration streams they specialize in, who they serve (skilled workers, families, students, refugees), what they emphasize.

**What to ignore from the screenshots:**
- Their existing layout — you're redesigning it.
- Their existing typography choices.
- Their existing color choices (unless `assets/brand/` confirms them as canonical).
- Anything dated, generic, or low-craft.

**Freedom to redesign:**
- Hero section: redesign freely. Reuse the headline copy or write a stronger version (flag rewrites).
- Page structure and section order: reorganize for clarity and flow.
- Footer: redesign with all contact / legal / nav info preserved.
- Blog cards, service cards (pathway cards), testimonials, pricing tables: redesign freely.
- Navigation: simplify if cluttered. Combine pages if overlapping.
- Page titles and section titles: reword if the original is weak. Keep core meaning.
- Blog post layout: redesign freely. Body copy stays.

**What stays the client's, untouched:**
- Business facts: services offered, RCIC number, office locations, hours, consultation fees, contact info.
- Brand colors and logo if defined in `assets/brand/`.
- Legal / regulatory copy (RCIC disclaimer, CICC compliance notices, privacy policy text).
- Any copy the client has explicitly flagged as approved.
- Testimonial wording (you can restyle, not rewrite).
- Government program names and legal terminology — never paraphrase official pathway names (Express Entry, PNP, LMIA, etc.).

If you're unsure whether to redesign or preserve something, **ask**.

### Mode B — Match an inspiration site

Rare. Triggered when the user explicitly says "make it look like [site]" or provides reference under `assets/inspiration/`.

- Match layout, spacing, typography, color, hierarchy **exactly**.
- Swap in client content from `assets/screenshots/` or the brief.
- Do not improve or add to the inspiration design.
- Run the screenshot comparison loop. Minimum 2 rounds.

### Mode C — From-scratch text brief

No reference at all. Design DNA does the heavy lifting.
- Default to the warm/human/trustworthy aesthetic unless the brief says otherwise.
- Self-critique your output before declaring done.

If reference and text brief conflict in any mode, **ask** — don't guess.

---

## Logo Rules

- **Always use the SVG** from `assets/brand/` or `brand_assets/`. Never use a PNG with a white background in the nav.
- If the SVG has a hardcoded `<rect fill="white"/>` or `background="white"`, remove it — the logo mark must sit on transparent.
- Nav logo: `<img src="logo.svg" alt="[Firm Name]" width="..." height="..." />` with explicit dimensions to prevent layout shift.
- If using Next.js `<Image>`, set `priority={true}` — it's above the fold.
- Logo must sit cleanly on the nav background with no bounding box, no white square, no border artifact.

---

## Hero Section — Non-Negotiable Pattern

The hero is the most important section on the site. It must immediately communicate safety, expertise, and hope — people arriving here are often anxious. One clear message. One clear action.

### Required layout: Full-width background image, text overlaid

```html
<section class="relative min-h-[92vh] flex items-end md:items-center">

  <!-- 1. Background image — fills edge to edge, no gaps -->
  <!-- Use a human photo: a family, a smiling professional, a city skyline with warmth -->
  <img
    src="hero.jpg"
    alt="A family smiling outside their new Canadian home on a sunny day"
    width="1920" height="1080"
    class="absolute inset-0 w-full h-full object-cover object-center"
    fetchpriority="high"
  />

  <!-- 2. Gradient overlay — dark at bottom/left for text legibility -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10
              md:bg-gradient-to-r md:from-black/65 md:via-black/30 md:to-transparent">
  </div>

  <!-- 3. Optional: subtle warm color wash over the image -->
  <div class="absolute inset-0 bg-[#8B2E16]/15 mix-blend-multiply"></div>

  <!-- 4. Content — left-aligned desktop, bottom-anchored mobile -->
  <div class="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-0">
    <p class="eyebrow text-white/70 mb-4">RCIC · Regulated Canadian Immigration Consultant</p>
    <h1 class="display-heading text-white max-w-2xl mb-6">
      Your path to Canada, <em class="text-[#E8A87C]">guided with care.</em>
    </h1>
    <p class="text-white/80 text-lg max-w-xl mb-10 leading-relaxed">
      We help families, workers, and students navigate Canada's immigration system — 
      step by step, with honesty and heart.
    </p>
    <div class="flex flex-wrap gap-4">
      <a href="#consultation" class="btn-primary">Book a Free Consultation</a>
      <a href="#pathways" class="btn-ghost-light">Check Your Pathway</a>
    </div>
  </div>

  <!-- 5. Trust bar — inside the hero, overlaid at bottom -->
  <div class="absolute bottom-0 left-0 right-0 z-10
              bg-gradient-to-t from-black/60 to-transparent
              px-6 md:px-12 py-5">
    <div class="max-w-7xl mx-auto flex flex-wrap gap-8 md:gap-16">
      <div>
        <span class="text-white text-2xl font-semibold">500+</span>
        <span class="text-white/60 text-xs uppercase tracking-widest ml-2">Cases Approved</span>
      </div>
      <div>
        <span class="text-white text-2xl font-semibold">12+</span>
        <span class="text-white/60 text-xs uppercase tracking-widest ml-2">Years of Experience</span>
      </div>
      <div>
        <span class="text-white text-2xl font-semibold">CICC</span>
        <span class="text-white/60 text-xs uppercase tracking-widest ml-2">Registered Member</span>
      </div>
    </div>
  </div>

</section>
```

### Hero Rules

**Layout:**
- `min-h-[92vh]` on desktop. Never a short banner. It must fill the viewport.
- Text left-aligned on desktop, bottom-anchored on mobile.
- Trust bar is **part of the hero** — overlaid at the bottom inside the same `<section>`, not a separate block. This eliminates the gap between hero and next section.
- No floating cards, decorative panels, abstract SVG shapes, or illustration columns beside the text.
- **No split layout. No image on the right. No image column. The image IS the background.**

**Image:**
- `object-cover object-center` — fills 100% of the section at all viewports.
- Explicit `width`/`height` on `<img>` to prevent CLS.
- `fetchpriority="high"` — this is the LCP element. Must load first.
- Never `loading="lazy"` on the hero image.
- Mobile: `object-position: center top` to keep faces in frame.
- Photo direction: real people, human moments — families arriving at airports, consultants meeting clients, Canadian cityscapes (Toronto, Vancouver, Calgary). Never generic stock-photo handshakes.
- Placeholder: `https://placehold.co/1920x1080/8B2E16/E8A87C` — brand palette so it looks intentional.

**Overlay:**
- Always a gradient overlay — text on an unprotected image is inaccessible.
- Mobile: `from-black/70` bottom-up (text is at the bottom).
- Desktop: `from-black/65` left-to-right (text is on the left).
- Optional warm wash: `bg-[#8B2E16]/15 mix-blend-multiply` to pull image into brand palette.

**Typography on hero:**
- Headline: `text-white` or bone `#F4EFE6`.
- Italic accent word: `text-[#E8A87C]` (warm amber) — pops on dark, feels human not corporate.
- Subheadline: `text-white/80`.
- Eyebrow: `text-white/60` — always include RCIC credential here.

**Fallback (no client photo):**
```html
<div class="absolute inset-0"
     style="background: radial-gradient(ellipse at 30% 50%, #2E4A6B 0%, #1B3045 40%, #0F1E2E 100%)">
</div>
<svg class="absolute inset-0 w-full h-full opacity-[0.04]">
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"/></filter>
  <rect width="100%" height="100%" filter="url(#grain)"/>
</svg>
```

---

## Footer — Non-Negotiable Pattern

The footer is a trust signal and navigation safety net. Organized columns, dark contrast, every important link present, RCIC disclaimer required. No clutter.

### Required layout

```html
<footer class="bg-[#0F1E2E] text-[#A0A8B0]">

  <!-- Pre-footer CTA strip -->
  <div class="border-b border-white/10 py-12 px-6 md:px-12">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row
                items-start md:items-center justify-between gap-6">
      <div>
        <h2 class="text-white text-2xl font-semibold mb-1">Ready to start your journey?</h2>
        <p class="text-white/50 text-sm">Book a free 30-minute consultation — no obligation.</p>
      </div>
      <a href="#consultation" class="btn-primary flex-shrink-0">Book a Free Consultation</a>
    </div>
  </div>

  <!-- Main footer grid -->
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16
              grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

    <!-- Brand -->
    <div class="col-span-2 md:col-span-1">
      <img src="logo.svg" alt="[Firm Name] Immigration" width="140" height="40"
           class="mb-4 brightness-0 invert opacity-80" />
      <p class="text-sm leading-relaxed mb-4">
        Regulated Canadian Immigration Consultants helping families, workers, 
        and students build their lives in Canada.
      </p>
      <!-- RCIC Disclaimer — mandatory, never remove -->
      <p class="text-xs text-white/30 leading-relaxed">
        RCIC #RXXXXXXX · Member of the College of Immigration 
        and Citizenship Consultants (CICC).
      </p>
    </div>

    <!-- Pathways -->
    <div>
      <h3 class="text-white/90 text-xs uppercase tracking-widest mb-4">Immigration Pathways</h3>
      <ul class="space-y-2 text-sm">
        <li><a href="/express-entry" class="hover:text-white/80 transition-colors duration-200">Express Entry</a></li>
        <li><a href="/provincial-nominee" class="hover:text-white/80 transition-colors duration-200">Provincial Nominee Program</a></li>
        <li><a href="/family-sponsorship" class="hover:text-white/80 transition-colors duration-200">Family Sponsorship</a></li>
        <li><a href="/work-permits" class="hover:text-white/80 transition-colors duration-200">Work Permits</a></li>
        <li><a href="/study-permits" class="hover:text-white/80 transition-colors duration-200">Study Permits</a></li>
        <li><a href="/visitor-visas" class="hover:text-white/80 transition-colors duration-200">Visitor Visas</a></li>
      </ul>
    </div>

    <!-- Navigate -->
    <div>
      <h3 class="text-white/90 text-xs uppercase tracking-widest mb-4">Navigate</h3>
      <ul class="space-y-2 text-sm">
        <li><a href="/" class="hover:text-white/80 transition-colors duration-200">Home</a></li>
        <li><a href="/about" class="hover:text-white/80 transition-colors duration-200">About Us</a></li>
        <li><a href="/success-stories" class="hover:text-white/80 transition-colors duration-200">Success Stories</a></li>
        <li><a href="/resources" class="hover:text-white/80 transition-colors duration-200">Free Resources</a></li>
        <li><a href="/blog" class="hover:text-white/80 transition-colors duration-200">Blog</a></li>
        <li><a href="/contact" class="hover:text-white/80 transition-colors duration-200">Contact</a></li>
      </ul>
    </div>

    <!-- Contact -->
    <div>
      <h3 class="text-white/90 text-xs uppercase tracking-widest mb-4">Contact</h3>
      <address class="not-italic text-sm leading-loose">
        [Office Address]<br>
        [City], [Province] [Postal Code]<br>
        <a href="tel:[PHONE]" class="hover:text-white/80 transition-colors duration-200">[Phone Number]</a><br>
        <a href="mailto:[EMAIL]" class="hover:text-white/80 transition-colors duration-200">[Email Address]</a><br>
        Mon–Fri · 9:00am – 6:00pm
      </address>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-white/10 px-6 md:px-12 py-5">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row
                justify-between items-center gap-3 text-xs text-white/30">
      <span>© 2025 [Firm Name] Immigration Consulting. All rights reserved.</span>
      <div class="flex gap-6">
        <a href="/privacy" class="hover:text-white/60 transition-colors duration-200">Privacy Policy</a>
        <a href="/terms" class="hover:text-white/60 transition-colors duration-200">Terms of Use</a>
        <a href="/disclaimer" class="hover:text-white/60 transition-colors duration-200">Legal Disclaimer</a>
      </div>
    </div>
  </div>

</footer>
```

### Footer Rules

**Color:**
- Background: deep navy `#0F1E2E` — trustworthy, not cold. Never pure black.
- Body text: `#A0A8B0` — muted cool-neutral. Never `text-gray-400` (too harsh).
- Column headings: `text-white/90` · Links: `text-white/50` default → `text-white/80` hover.
- Never a white footer. Never the same color as the page — it must visually close it.

**Structure:**
- Pre-footer CTA strip (border-separated) — converts users who scrolled to the bottom.
- 4-column grid desktop · 2-column tablet · 1-column mobile.
- Column headings: `text-xs uppercase tracking-widest`.
- Links: `space-y-2` — tight, not sprawling.
- Bottom bar: `border-t border-white/10` — copyright + legal only.

**Logo in footer:**
- `brightness-0 invert opacity-80` — renders any logo as muted white. Clean.

**What belongs:**
- Brand mark + tagline + RCIC number + CICC membership notice.
- Immigration pathway links (these are the site's core service pages).
- Full nav (all pages).
- Physical address, phone, email, hours in `<address>`.
- Consultation booking link + secondary CTAs.
- Copyright, Privacy, Terms, Legal Disclaimer.

**What does NOT belong:**
- Long copy blocks · Testimonials · Hero photography · Redundant CTAs.

**RCIC Disclaimer — mandatory in every footer:**
The footer brand column must always include the consultant's RCIC registration number and CICC membership notice. This is a regulatory requirement, never a design choice. Keep it visible but visually subordinate (`text-xs text-white/30`).

---

## Spacing — Purposeful Density, Not Random Gaps

The #1 mistake: defaulting to `py-24`/`py-32` everywhere, creating a loose, unfinished feel. FAANG sites use **purposeful density** — sections feel complete, not padded for padding's sake.

### Section padding scale
```
Mobile:  py-12  (48px)
Tablet:  py-16  (64px)
Desktop: py-20  (80px)  ← maximum for standard sections
Hero:    min-h-[92vh]   ← fills viewport, no section padding
Footer:  py-12 / py-16  ← fixed, tight
```

**Never use `py-24` or `py-32` as a default.** Reserve these only for deliberate editorial "breathing" moments (a full-bleed pull quote, a centered brand manifesto). All other sections: `py-16 md:py-20`.

### Eliminating gaps between sections
- Hero trust bar is **inside** the hero section — no gap between hero and next content.
- `<section>` elements have **zero** `mt-` or `mb-`. Spacing is padding inside, never margin between.
- Cards: `gap-4 md:gap-6`. Not `gap-8` unless cards are large feature blocks.
- Column gaps: `gap-6 md:gap-8`.

---

## Local Server
- Static builds: `node serve.mjs` → `http://localhost:3000`. Never `file:///`.
- Next.js builds: `npm run dev` → `http://localhost:3000`. No serve.mjs needed.

## Screenshot Workflow
- Puppeteer at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`.
- Always screenshot localhost: `node screenshot.mjs http://localhost:3000`
- Saves to `./temporary screenshots/screenshot-N.png`.
- Optional label: `node screenshot.mjs http://localhost:3000 hero`
- Read PNG with the Read tool after every shot.
- **Comparison must be specific:** "heading is 32px, reference is 24px" — not "looks close."
- **Required viewports every pass:** 375px · 768px · 1280px.

---

## Design DNA — Warm, Human, Trustworthy

This is an immigration consultancy. People come here in hope, in uncertainty, sometimes in fear. The design must communicate: *you are in safe hands. We've done this before. We care about you specifically.*

### Color

**Palette direction: warm navy + amber + cream. Grounded, human, trustworthy.**

- **Base:** `#FBF9F6`, `#F5F0EA`, `#EEE8DF`, `#E7DDD0`. **Never pure `#FFFFFF`.**
- **Primary accent:** warm amber / terracotta — `#C1532A`, `#E8A87C`, `#D4734A`. Conveys warmth and approachability.
- **Secondary accent:** deep navy — `#1B3557`, `#243B55`, `#2E4A6B`. Conveys trust, stability, professionalism.
- **Text:** `#1A1612`, `#2A221A`, `#3A2E24` body. `#6B5A4A` secondary.
- **Forbidden:** Tailwind blue/indigo as primary · neon · pure black on pure white · overly "government" greys that feel cold and bureaucratic.

**Avoid the government-website trap.** Canadian immigration sites often look like IRCC forms — sterile blue-and-white, dense text, intimidating. This site should feel like the *opposite*: the warm, knowledgeable friend who guides you through the process.

### Typography
- Always two fonts: serif display + humanist sans.
- **Headings:** Fraunces, Cormorant, EB Garamond, Newsreader — convey expertise and warmth simultaneously.
- **Body:** DM Sans, Inter, IBM Plex Sans.
- Display tracking: `-0.02em` to `-0.04em`. Line-height: `1.05–1.15`.
- Body: `16–18px`, `line-height: 1.65–1.8`, `max-w-[65ch]`.
- Weight: `500–600` headings (not 700+). `400` body.
- Italics on serif for soft emphasis — especially on emotional phrases and pathway names.
- Fluid type with `clamp()`.

### Surfaces & Depth
- Shadows: `box-shadow: 0 24px 48px -16px rgba(40, 30, 20, 0.12)`.
- Borders: `1px solid rgba(0,0,0,0.06)`.
- Radius: `12–20px` cards · `8–12px` buttons.
- Hero grain: SVG noise at 2–4% opacity.

### Motion
- `transform` and `opacity` only. **Never `transition-all`.**
- `300–500ms` · `cubic-bezier(0.22, 1, 0.36, 1)`.
- Honor `prefers-reduced-motion: reduce`.

### Content tone
- Write like a trusted friend, not a government agency.
- Lead with people, not process. "We helped Ahmed and his family reunite in under 8 months" over "Family reunification services available."
- Acknowledge anxiety: "We know this process can feel overwhelming — that's exactly why we're here."
- Never use immigration jargon in headlines without explanation. Explain in the subhead.
- Testimonials must feel real — include country of origin, pathway used, year.

---

## Immigration-Specific Content Patterns

### Pathway Cards
Every immigration stream gets a card. Consistent structure:

```html
<article class="pathway-card rounded-2xl bg-white border border-black/[0.06] p-8 
                hover:shadow-[0_24px_48px_-16px_rgba(40,30,20,0.12)] 
                transition-shadow duration-300">
  <div class="pathway-icon mb-4"><!-- SVG icon --></div>
  <h3 class="text-xl font-semibold mb-2">Express Entry</h3>
  <p class="text-[#6B5A4A] text-sm leading-relaxed mb-6">
    Canada's fastest pathway to permanent residence for skilled workers. 
    Most applicants receive an invitation within 6 months.
  </p>
  <div class="flex items-center justify-between">
    <span class="text-xs text-[#6B5A4A]/70 uppercase tracking-widest">Avg. 6 months</span>
    <a href="/express-entry" class="text-[#C1532A] text-sm font-medium 
       hover:text-[#D4734A] transition-colors duration-200">
      Learn more →
    </a>
  </div>
</article>
```

**Pathway card required fields:**
- Stream name (official, never abbreviated on first mention)
- Plain-English description (1–2 sentences, jargon-free)
- Average processing time (if known)
- Link to dedicated pathway page

### Trust Signals — What belongs on the homepage
- **RCIC number** — in header or hero eyebrow. Always visible above the fold.
- **CICC member badge** — logo if licensed to use it.
- **Case count** — "500+ applications approved" (only use numbers you can defend).
- **Years in practice** — specific, not vague ("since 2012", not "over a decade").
- **Countries served** — "Clients from 40+ countries" if applicable.
- **Languages spoken** — immigration clients come from everywhere; multilingual service is a major differentiator.
- **Success stories** — named (with permission) or anonymized but specific: "Aarav, Software Engineer, Express Entry PR · 2024."

### Consultation CTA
The primary CTA site-wide is always **Book a Free Consultation**. Never "Get a Quote" (transactional) or "Contact Us" (vague). Immigration clients need to talk to a human first.

Secondary CTA: **Check Your Eligibility** — links to a self-assessment tool or intake form.

### FAQ Section
Every immigration site needs a robust FAQ. Implement with `FAQPage` JSON-LD. Questions should address real anxieties:
- "Do I need a consultant or can I apply on my own?"
- "What's the difference between an immigration consultant and a lawyer?"
- "How long does the process take?"
- "What if my application is refused?"
- "Are there any guarantees?"

Answer the last one honestly. Ethical RCIC consultants do not guarantee outcomes. Say so clearly — it builds trust.

---

## Responsive Design

### Breakpoints
Base 375px · `sm:` 640px · `md:` 768px · `lg:` 1024px · `xl:` 1280px · `2xl:` 1536px

### Mobile rules
- Touch targets: 44×44px minimum.
- Form inputs: `font-size: 16px` minimum.
- No horizontal scroll. Ever.
- Hamburger nav at `md:`. Sticky header max 56–64px.
- **Mobile is primary** — many prospective immigrants access from phones in their home countries. 375px is not an edge case.

---

## SEO Structure

Every page: `<html lang="en">`, unique `<title>` (50–60 chars), unique `<meta name="description">` (150–160 chars), `<link rel="canonical">`, Open Graph tags, Twitter card, `<meta name="theme-color">`.

**Hreflang:** if the site has multilingual content (common for immigration firms), add `<link rel="alternate" hreflang="...">` tags for every language variant.

JSON-LD in `<head>` — add what fits the page:
- `LegalService` — for the firm and each service page (immigration consulting is a legal-adjacent service)
- `LocalBusiness` — for the office location
- `Person` — for the consultant(s) with RCIC credential
- `FAQPage` — for the FAQ section (significant SEO value for immigration queries)
- `Service` — for individual pathway pages (Express Entry, PNP, etc.)
- `BreadcrumbList` — for all inner pages
- `WebSite` — on the homepage with `SearchAction`
- `BlogPosting` — for blog/resource articles

**Example JSON-LD for the consultant:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Consultant Name]",
  "jobTitle": "Regulated Canadian Immigration Consultant (RCIC)",
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "RCIC",
    "recognizedBy": {
      "@type": "Organization",
      "name": "College of Immigration and Citizenship Consultants (CICC)"
    }
  },
  "worksFor": {
    "@type": "LegalService",
    "name": "[Firm Name]"
  }
}
```

One `<h1>` per page. Sequential heading hierarchy. Descriptive `alt` on every image. Descriptive anchor text. `rel="noopener"` on external links.

**High-value keyword targets** (inform page titles and meta descriptions):
- "[City] immigration consultant"
- "Express Entry consultant Canada"
- "Canada PR application help"
- "RCIC [City]"
- "how to immigrate to Canada"

---

## Quality Bar

**Lighthouse mobile:** 90+ Performance · 95+ Accessibility · 95+ Best Practices · 95+ SEO.
**Core Web Vitals:** LCP < 2.5s · CLS < 0.1 · INP < 200ms.

Hero image: `fetchpriority="high"`, explicit dimensions, no `loading="lazy"`.
Below-fold images: `loading="lazy"`, explicit dimensions.

WCAG 2.1 AA: semantic HTML, 4.5:1 contrast body, 3:1 large text, skip-to-content link, keyboard navigable, visible focus states, `<label>` on all form fields.

**Four states on every interactive element:** default · hover · focus-visible · active.

---

## Hard Rules

- Do **not** clone the client's current site (Mode A = redesign).
- Do **not** use a PNG with white background for the nav logo — use SVG.
- Do **not** build a hero with text-left + image/shape-right split layout.
- Do **not** build a hero shorter than `min-h-[85vh]`.
- Do **not** put the trust bar as a separate section below the hero — embed it inside.
- Do **not** use `py-24` or `py-32` as default section padding.
- Do **not** add `mt-` or `mb-` to `<section>` elements.
- Do **not** use a white or page-colored footer — it must be dark and distinct.
- Do **not** use `transition-all`.
- Do **not** use Tailwind blue/indigo as primary.
- Do **not** use pure `#FFFFFF` for page backgrounds.
- Do **not** ship with console errors or warnings.
- Do **not** invent brand colors when `assets/brand/` defines them.
- Do **not** rewrite client business facts, RCIC numbers, or credential information.
- Do **not** skip `focus-visible` on any interactive element.
- Do **not** ship without JSON-LD structured data.
- Do **not** stop after one screenshot pass.
- Do **not** remove or downplay the RCIC disclaimer in the footer — it is a regulatory requirement.
- Do **not** guarantee immigration outcomes in any copy — this is an RCIC ethical violation.
- Do **not** paraphrase official Government of Canada program names (Express Entry, LMIA, PGWP, etc.).
- Do **not** design forms that collect personal immigration information without a clear privacy notice.
- If reference and brief conflict, **ask** — don't guess.

---

## Project Kickoff Checklist

1. Read `assets/screenshots/`, `assets/brand/`, `assets/inspiration/`.
2. Confirm build mode (A / B / C).
3. Verify SVG logo in `assets/brand/` — confirm no white background rect.
4. List pages and sections to build.
5. Pull business facts: RCIC number, immigration streams offered, office location, contact info, consultation booking URL, languages spoken.
6. Confirm brand hero color; derive the ramp.
7. Confirm type pairing (display + sans).
8. Decide JSON-LD schemas — at minimum: `LegalService`, `Person`, `FAQPage`.
9. Start dev server.
10. **Build mobile-first at 375px.** Many users are overseas on mobile.
11. Hero first — full-viewport background image, gradient overlay, text on top, RCIC eyebrow above heading, trust bar embedded inside at bottom.
12. Layer up: 768px → 1280px.
13. Footer — deep navy background, 4-column grid, RCIC disclaimer in brand column, pre-footer consultation CTA strip, tight spacing.
14. Screenshot at 375 / 768 / 1280 → compare → fix → repeat. Minimum 2 rounds.
15. Lighthouse on mobile. Fix below-bar scores.
16. Final pass: hover, focus-visible, active on every interactive element.
17. Validate: one `<h1>`, sequential headings, alt text, JSON-LD, SVG logo in nav, RCIC number visible, no console errors.
