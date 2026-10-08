/**
 * Feature photos shown directly under the page hero, keyed by route.
 * Requested by the client in "Comments 2026-10-07" (items 4–14).
 *
 * `license`:
 *  - "unsplash"      → free Unsplash License, OK to use as-is.
 *  - "unsplash-plus" → Unsplash+ (premium) photo — needs a paid licence. The
 *                      client's six premium picks were swapped for free
 *                      look-alikes on 2026-10-08; avoid adding new ones.
 *  - "client"        → photo supplied by MVC, stored in /public.
 */
export interface PageImage {
  src: string;
  alt: string;
  credit?: string;
  license: "unsplash" | "unsplash-plus" | "client";
  /** CSS object-position, for tuning the crop. */
  position?: string;
}

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2400&q=80`;

export const PAGE_IMAGES: Record<string, PageImage> = {
  // 4) Services (all pathways)
  "/pathways": {
    src: u("photo-1766066014237-00645c74e9c6"),
    alt: "Smiling client-support consultant on a headset at her computer",
    credit: "BaljkanN4 / Unsplash",
    license: "unsplash",
    position: "center 40%",
  },
  // 4b) /services — the page the header "Services" menu opens; same photo
  "/services": {
    src: u("photo-1766066014237-00645c74e9c6"),
    alt: "Smiling client-support consultant on a headset at her computer",
    credit: "BaljkanN4 / Unsplash",
    license: "unsplash",
    position: "center 40%",
  },
  // 5) Blog index
  "/blog": {
    src: u("photo-1486312338219-ce68d2c6f44d"),
    alt: "Person writing on a laptop at a wooden desk",
    credit: "Glenn Carstens-Peters / Unsplash",
    license: "unsplash",
  },
  // 6) Blog article 1
  "/blog/top-3-immigration-mistakes": {
    src: u("photo-1576078361289-d7c4da40e7cd"),
    alt: "Printed application forms on a desk",
    credit: "Metin Ozer / Unsplash",
    license: "unsplash",
  },
  // 7) Blog article 2
  "/blog/when-hiring-a-consultant-pays-off": {
    src: u("photo-1642522029691-029b5a432954"),
    alt: "A man and a woman reviewing business documents together at a table",
    credit: "Carrie Allen / Unsplash",
    license: "unsplash",
  },
  // 8) Blog article 3
  "/blog/ielts-scores-matter": {
    src: u("photo-1660927059794-152d06e11016"),
    alt: "Person studying at a computer",
    credit: "Mana Akbarzadegan / Unsplash",
    license: "unsplash",
  },
  // 9) Study — category landing gets the flags, study permits gets graduation
  "/pathways/study": {
    src: u("photo-1562364692-16836a8b9b08"),
    alt: "Crowd waving Canadian flags at a Canada Day parade in Banff",
    credit: "Andy Holmes / Unsplash",
    license: "unsplash",
    position: "center 60%",
  },
  "/pathways/study/study-permits": {
    src: u("photo-1541339907198-e08756dedf3f"),
    alt: "University graduates throwing their caps in the air outdoors",
    credit: "Pang Yuhao / Unsplash",
    license: "unsplash",
    position: "center 55%",
  },
  // 10) Family
  "/pathways/family": {
    src: u("photo-1614144477821-9daf217ae100"),
    alt: "A couple standing together, smiling",
    credit: "Gabriel Tovar / Unsplash",
    license: "unsplash",
    position: "center 30%",
  },
  "/pathways/family/family-sponsorship": {
    src: u("photo-1614144477821-9daf217ae100"),
    alt: "A couple standing together, smiling",
    credit: "Gabriel Tovar / Unsplash",
    license: "unsplash",
    position: "center 30%",
  },
  // 11) Contact
  "/contact": {
    src: u("photo-1570215171323-4ec328f3f5fa"),
    alt: "Person typing on a keyboard at a desk",
    credit: "Zan Lazarevic / Unsplash",
    license: "unsplash",
  },
  // 12) Visit
  "/pathways/visit": {
    src: u("photo-1599313731897-257f8334eaf1"),
    alt: "Canadian flag hanging on a tree trunk",
    credit: "Maxime Doré / Unsplash",
    license: "unsplash",
  },
  // 13) Business
  "/pathways/business": {
    src: u("photo-1702685873594-6977fc2552c6"),
    alt: "'Come in, we're open' sign hanging on a small-business door",
    credit: "Tim Mossholder / Unsplash",
    license: "unsplash",
  },
  // 14) Citizenship — client-supplied photo (Google Drive: shutterstock_1525344614).
  // Drop the file at public/pathways/citizenship.jpg; it's hidden until it exists.
  "/pathways/citizenship": {
    src: "/pathways/citizenship.jpg",
    alt: "New Canadian citizens celebrating with Canadian flags",
    license: "client",
  },
};

export function getPageImage(route: string): PageImage | null {
  return PAGE_IMAGES[route] ?? null;
}
