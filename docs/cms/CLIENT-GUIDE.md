# MVC Website — Content Editing Guide

This guide explains how to update the website yourself — no coding needed.
Changes appear on the live site within a few seconds of saving.

## Logging in

1. Go to **yourdomain.com/admin** (you'll be sent to the login page).
2. Enter your email and password and click **Sign in**.
3. You'll land on the **Content dashboard**, with a section for each part of the
   site in the left sidebar.

> Forgot your password or need another login? Contact your developer — accounts
> are created with a quick command. (After 5 wrong password attempts an account
> is locked for 15 minutes.)

## How editing works

- Each section has a form. Make your changes and click **Save changes**.
- A green "Saved." message confirms it worked. The live site updates within a
  few seconds — just refresh the public page.
- Required fields are marked with a red asterisk (*). If something's missing or
  too long, the field is highlighted with a short message.

## Try it: a 5-minute walkthrough

New to the admin? Run through these to see how editing works. After each
**Save changes**, open the matching public page in another tab and refresh —
your change appears within a few seconds.

1. **Hero** → change the headline → Save → refresh the homepage.
2. **Services** → add a card (title, description, icon, link) → Save → it appears
   in the "How We Can Help" row on the homepage.
3. **FAQs** → add a question under a category → Save → it appears on the FAQ page.
4. **Blog** → **New post**, fill it in, set **Status: Draft** → Save. It is *not*
   on the public blog yet. Re-open it, switch to **Published** → Save → now it
   appears at `/blog`.
5. **Contact** → change the footer phone → Save → the footer updates site-wide.
6. **SEO** → change the About page title → Save. (That's the browser-tab title and
   what shows in Google and social-media shares.)

If those all worked, you're ready to manage the whole site yourself. Each section
is described in detail below.

## The sections

### Homepage Hero
The big top section of the homepage: the small eyebrow line, the headline, the
intro paragraph, the four guarantee bullet points (one per line), the two
buttons (label + link), the founder photo, and the name/title/quote on the photo
card. A small maple-leaf accent is added after the headline automatically.

### Homepage Extras
Three things: the **trust badges** row, the **"Why clients choose MVC"** reasons,
and the **closing CTA banner**. For badges and reasons, pick an icon from the
dropdown, set a title and description, and use the "Order" number to arrange
them. Click **Delete** to remove one, or use the "Add" form at the bottom.

### About
The About page: the eyebrow, heading, and intro at the top, an optional photo,
and the main **Body** written in Markdown (a live preview shows on the right as
you type). Use `##` for a section heading.

### Services
The "How We Can Help" cards on the homepage. Each card has a title, a
description, an icon (from the dropdown), a link, and an order number. Add, edit,
reorder, or delete cards.

### Team
The "Meet the Team" people. Each member has a name, role, photo (required), an
optional short bio, and an order number.

### Testimonials
The client success stories on the Success Stories page. Each has a name,
country, year, the pathway badge (e.g. "Express Entry · PR"), and the quote.

### FAQs
Questions and answers, grouped by category. Choose a category, write the
question and answer, and set the order. Untick "Published" to hide one without
deleting it.

### Blog
- The list shows every post with its status (**Draft** or **Published**).
- Click **New post** to write one, or a title to edit it.
- Each post has a title, a URL slug (lowercase-with-hyphens), a summary, a
  category badge, date, read time, author, an optional cover image, and the body
  in Markdown (with live preview).
- Set **Status** to **Draft** while writing — drafts are not visible on the
  public site. Switch to **Published** when ready.
- Each post also has optional SEO fields (see below).

### Contact information
- **Footer details:** the phone, email, and address shown in the site footer.
- **Contact-page detail blocks:** the office/email/hours/languages cards on the
  Contact page. Each has an icon, a label, and one line of text per line.
- **Booking options:** the consultation cards (title, price, description, and the
  Calendly link).
- **Social links:** platform name (Facebook, Instagram, LinkedIn, YouTube) and
  its URL.

### SEO
For each page you can set the **title**, **description**, and a **social share
image** (shown when the page is shared on Facebook/LinkedIn/etc.). The "Site
default" entry also covers the homepage. Blog-post SEO is edited on each post.

## Images

- Upload JPEG, PNG, or WebP images, up to 5MB.
- Images are optimized and stored automatically — no need to resize first.
- If you don't choose a new image when editing, the existing one is kept.

## Tips

- Saving publishes immediately — there's no separate "publish" button except the
  Draft/Published switch on blog posts.
- If you ever clear out a section entirely, the site falls back to its original
  built-in content rather than showing nothing.

---

## For developers

The two sections below are for whoever sets up and deploys the site — not for
day-to-day editing. Full technical detail is in `SETUP.md`.

### Testing the admin locally (with Docker)

Run the whole CMS on your own machine before deploying:

1. Start a local Postgres database:
   ```bash
   docker run -d --name mvc-cms-db \
     -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=mvc \
     -p 5435:5432 postgres:16-alpine
   ```
2. Create a `.env` file in the project root:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5435/mvc?sslmode=disable"
   AUTH_SECRET="paste output of: openssl rand -base64 32"
   BLOB_READ_WRITE_TOKEN=""
   ```
   (Leave the Blob token empty for now — text editing works without it; only
   image uploads need it.)
3. Set up the schema, load content, and create a test login:
   ```bash
   npm install
   npm run db:push
   npm run db:seed
   npm run admin:create -- "admin@mvc.test" "MVC Admin" "ChangeMe123!"
   ```
4. Start the site and sign in at <http://localhost:3100/admin>:
   ```bash
   npm run dev -- -p 3100
   ```
5. Useful commands: `npm run db:studio` (browse the data),
   `docker stop mvc-cms-db` / `docker start mvc-cms-db` (stop/resume the database).

> Image uploads won't work locally until you add a real `BLOB_READ_WRITE_TOKEN`
> and the Vercel Blob hostname to `next.config.mjs`. Everything else is testable.

### Going live & creating the client's login

1. Deploy to Vercel and set `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, and
   `AUTH_SECRET` in the project's Environment Variables (see `SETUP.md`).
2. Run the schema + seed against the production database, then create the
   client's account:
   ```bash
   npm run admin:create -- "client@email.com" "Client Name" "a-strong-password"
   ```
3. Send the client: the **yourdomain.com/admin** link, their password, and this
   guide. They sign in and edit using the sections above. Changes go live within
   a few seconds.
