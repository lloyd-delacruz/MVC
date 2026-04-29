# How To Get Started — Page Design

**Date:** 2026-04-29
**Author:** Claude (with lloyd.vince1985)
**Status:** Approved
**Page route:** `/pages/get-started.html`

---

## Goal

Build the "How To Get Started" page for MVC Immigration. Currently linked from every page nav as `href="#"` — the page does not exist. It will become the de-facto front door for prospective immigrants who don't yet know which pathway applies to them.

The page must do two jobs in sequence:

1. **Convert the undecided** — an interactive Pathway Finder quiz that recommends one of seven Canadian immigration pathways based on six short questions. Removes the paralysis of "which of 12 pathways is mine?"
2. **Reassure the cautious** — a transparent, accordion-based explanation of what working with MVC actually looks like, end-to-end.

Single primary CTA throughout: **Book a Free Consultation**.

---

## Page architecture

`pages/get-started.html` — six sections, top to bottom:

1. **Hero** — full-bleed background image per CLAUDE.md non-negotiable pattern. `min-h-[92vh]`, gradient overlay, eyebrow with RCIC credential, headline + subhead, dual CTAs, embedded trust bar at bottom.
2. **Pathway Finder Quiz** — six-question interactive tool, vanilla JS, client-side only. Results panel reveals at the end.
3. **Editorial divider** — short paragraph bridging the quiz to the process explainer.
4. **5-Step Process accordions** — expandable sections describing the client journey end-to-end.
5. **What you'll need to bring** — concise document checklist so users start preparing immediately.
6. **Pre-footer CTA strip + footer** — same pattern as the rest of the site.

No section uses `mt-`/`mb-`. Spacing is internal padding only. Standard sections use `py-16 md:py-20`. Hero is `min-h-[92vh]` with embedded trust bar.

---

## Section 1 — Hero

- Eyebrow: `RCIC · Regulated Canadian Immigration Consultant`
- Headline: *"Find your path to Canada — in 60 seconds."* (italic accent on "60 seconds")
- Subhead: *"Answer six quick questions. We'll match you to the immigration pathway that fits your situation. Free, private, no email required."*
- Primary CTA: *Take the Pathway Quiz* → smooth-scrolls to Section 2
- Secondary CTA: *Book a Free Consultation* → `#consultation` (existing site anchor)
- Trust bar (embedded inside hero): three items reusing only defensible facts already on the existing site — *"500+ Cases Approved"* · *"12+ Years of Experience"* · *"CICC Registered Member"*. RCIC number `#RXXXXXXX` placeholder remains in eyebrow until client provides real number.

  > **Implementation note:** if the client confirms different numbers in `assets/`, swap them. Never invent statistics.
- Background image: warm human moment — family arriving, consultant meeting client, or Vancouver skyline at golden hour. Placeholder uses brand palette per CLAUDE.md.

---

## Section 2 — Pathway Finder Quiz

### Questions

| # | Question | Control type | Answer options |
|---|----------|--------------|----------------|
| 1 | What's your main goal in Canada? | radio (single) | Work permanently · Study · Reunite with family · Work temporarily · Start or invest in a business · Not sure yet |
| 2 | What's your country of citizenship? | dropdown (`<select>`) | Full ISO list (~195 countries), alphabetical |
| 3 | How old are you? | radio | Under 18 · 18–29 · 30–39 · 40–44 · 45+ |
| 4 | What's the highest education you've completed? | radio | High school · Diploma or 1-yr post-secondary · Bachelor's · Master's · PhD · Trade certification |
| 5 | How many years of skilled work experience do you have? | radio | None · Less than 1 · 1–3 · 4–5 · 6+ |
| 6 | Do any of these apply? (select all) | checkboxes | Job offer in Canada · Family in Canada (PR or citizen) · Previously studied or worked in Canada · Speak English or French fluently · Have CAD $13,757+ in settlement funds |

### Interaction

- One question visible at a time. Progress indicator: `Step N of 6`.
- Each answer auto-advances after a 200ms delay (radios/dropdown). Multi-select question 6 has explicit *Continue* button.
- *Back* button on every step except step 1.
- All state held in a single JS object. No persistence across page loads (intentional — privacy).
- Reset button on the results panel.

### Result mapping

Deterministic, scored. Each answer contributes points to candidate pathways:

| Pathway | Strongest signals |
|---------|-------------------|
| **Express Entry — Canadian Experience Class (CEC)** | Goal=work permanently + Q6 includes "previously worked in Canada" |
| **Express Entry — Federal Skilled Worker (FSWP)** | Goal=work permanently + Bachelor's+ + 1+ years experience + language fluent + no Canadian experience |
| **Express Entry — Federal Skilled Trades (FSTP)** | Goal=work permanently + Trade certification + 2+ years experience |
| **Provincial Nominee Program (PNP)** | Goal=work permanently + 30–44 + family or prior Canadian connection + age/education score lower than EE thresholds |
| **Family Sponsorship** | Goal=reunite with family OR Q6 has "family in Canada" + sponsor relationship |
| **Study Permit** | Goal=study (regardless of other answers) |
| **Start-Up Visa** | Goal=start or invest in a business |
| **General consultation** | Goal=not sure OR no clear winner |

Tie-break order: CEC > FSWP > FSTP > PNP > FS > SP > SUV > General.

### Results panel content

Reveals at the end of question 6:

- Matched pathway name (large, italic accent)
- 2-sentence plain-English explanation of the pathway
- "Why this fits you" — bulleted echo of the user's answers that drove the match
- Primary CTA: *Book a Free Consultation* → `#consultation`
- Secondary link: *See full pathway details* → corresponding page in `/pages/pathways/...`
- *Take the quiz again* (resets state)
- **Mandatory disclaimer block:** *"This is an informational guide, not a binding eligibility decision. Immigration cases are unique — book a free consultation for an RCIC's formal opinion on your situation. We never guarantee immigration outcomes."*

### Hard constraints (from CLAUDE.md)

- No outcome guarantees in any quiz copy.
- Official program names used verbatim (Express Entry, Provincial Nominee Program, etc.) — never paraphrased.
- No personal information collected. No form submission. No analytics on quiz answers.
- All four interactive states on every input: default, hover, focus-visible, active.
- Quiz is fully keyboard navigable. Radio groups have proper `<fieldset>`/`<legend>`. Dropdown is native `<select>`.

---

## Section 3 — Editorial divider

A single short paragraph, centered, serif, larger type:

*"Whatever pathway fits — here's what working with us actually looks like, from your first call to your landing in Canada."*

---

## Section 4 — 5-Step Process accordions

Native `<details>`/`<summary>` for accessibility. Default state: step 1 open, others closed.

| Step | Title | What expands to show |
|------|-------|---------------------|
| 1 | **Book your free consultation** | 30-minute call, no obligation. We listen to your goals, ask about your situation, and tell you whether we can help. *Timing: usually within 3 business days.* *What you do: book a time. What we do: review your situation before the call.* |
| 2 | **Eligibility assessment & pathway selection** | A formal RCIC review of your case. You receive a written recommendation outlining your strongest pathway, alternative options, and the realistic timeline and cost. *Timing: 5–10 business days.* |
| 3 | **Document preparation** | A checklist tailored to your pathway. We review every document before submission — language tests, ECA, employment letters, civil documents. *Timing: 4–12 weeks (mostly your pace).* |
| 4 | **Application submission & monitoring** | We file with IRCC on your behalf, track every status change, and respond to procedural fairness letters or additional document requests. *Timing: 4–18 months depending on pathway.* |
| 5 | **Decision & landing support** | Approval prep, PR landing or visa activation, and settlement guidance — banks, healthcare, SIN, schools. *Timing: 2–4 weeks after approval.* |

Each accordion has the same internal structure for visual consistency: a *What happens* paragraph, a *How long* line, a *What you do / What we do* split.

---

## Section 5 — What you'll need to bring

A two-column checklist (single column on mobile). Concise — this is a teaser, not the full IRCC document list. Header: *"Start gathering these now"*. Items use a checkmark icon.

- Valid passport (not expiring within 6 months)
- Language test results (IELTS General, CELPIP, or TEF Canada) — if applying through Express Entry
- Educational Credential Assessment (ECA) for foreign degrees
- Employment reference letters showing duties + dates
- Civil documents (birth, marriage, police certificates from every country lived 6+ months)
- Proof of settlement funds (bank statements)
- Medical exam (when requested by IRCC)

Below the list: a single-line note: *"Don't worry about gathering everything at once — we walk through this list with you in step 3."*

---

## Section 6 — Pre-footer CTA strip + footer

Same component as every other page on the site. No customization.

---

## Implementation notes

**File structure:**

- `pages/get-started.html` — new page
- `src/styles/get-started.css` — page-specific styles (quiz, accordions, checklist)
- `src/scripts/get-started.js` — quiz state machine and result computation (vanilla JS, no framework)

Reuse the existing nav and footer markup verbatim from `pages/about.html` (the cleanest existing page to copy from). Reuse `global.css`, `inner-shared.css` for shared component styles.

**Nav link updates required across the site** — the current `href="#"` for "How To Get Started" must be updated to `href="/pages/get-started.html"` in:

- `index.html` (2 occurrences: desktop nav + mobile overlay)
- `pages/about.html` (2 occurrences)
- `pages/blog.html` (2)
- `pages/contact.html` (2)
- `pages/faq.html` (2)
- `pages/success-stories.html` (2)
- `pages/why-canada.html` (2)
- `pages/blog/*.html` — every blog post (check and update)
- `pages/pathways/*.html` — every pathway page (check and update)

**JSON-LD on the page:**

- `WebPage` with `mainEntity` describing the page purpose
- `BreadcrumbList` (Home → How To Get Started)
- `HowTo` for the 5-step process — significant SEO value for queries like *"how to immigrate to Canada"*

**SEO:**

- `<title>`: *"How To Immigrate to Canada — Find Your Pathway · MVC Immigration"* (60 chars)
- `<meta description>`: *"Take our free 60-second quiz to discover the Canadian immigration pathway that fits your situation. RCIC-built, no email required."* (155 chars)
- Canonical URL set
- One `<h1>` (the hero headline)

**Quality bar (from CLAUDE.md):**

- Lighthouse mobile: 90+ Performance / 95+ Accessibility / 95+ Best Practices / 95+ SEO
- LCP element is hero image — `fetchpriority="high"`, explicit dimensions, no `loading="lazy"`
- Below-fold images: `loading="lazy"` with explicit dimensions
- WCAG 2.1 AA: skip link, focus-visible everywhere, semantic landmarks, label-to-input pairing, 4.5:1 contrast
- No `transition-all`. Motion uses `transform` and `opacity` only.
- Test viewports: 375px / 768px / 1280px

---

## Out of scope

- Backend persistence of quiz answers (intentional privacy decision)
- Email capture before showing results (would hurt conversion and trust)
- Account creation or saved sessions
- Analytics on quiz completion (can be added later if MVC requests it)
- French-language version (placeholder hreflang in CLAUDE.md but no fr content yet)
- Replacing the existing booking flow — the quiz hands off to the existing `#consultation` anchor / contact page
