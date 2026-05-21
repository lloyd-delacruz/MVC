import type { AboutContent } from "@/lib/cms/types";

// Mirrors the original app/about/page.tsx hero + "Our Story" body.
export const ABOUT_FALLBACK: AboutContent = {
  eyebrow: "About MVC",
  heading: "A small firm, doing this work the right way.",
  lede: "Licensed RCIC. Personal review. Real guidance for families, workers, students, and businesses — tailored to your goals.",
  bodyMarkdown: [
    "## We're a Vancouver firm built around honest immigration advice.",
    "",
    "MVC Immigration Firm is led by Yaniv Babani, a Regulated Canadian Immigration Consultant (RCIC #R519412) with over 12 years of experience guiding individuals, families, and businesses through Canada's immigration system.",
    "",
    "Our work is personal. Every case is reviewed by Yaniv directly. We don't hand files to junior staff or take shortcuts — we read your situation carefully, tell you what we see, and give you a real answer.",
    "",
    "We speak English, Spanish, Hebrew, Tagalog, Cebuano, and Bangla, and we serve clients in Vancouver and worldwide.",
  ].join("\n"),
  imageUrl: "/team/yaniv.png",
  imageAlt: "Yaniv Babani, Founder & RCIC",
};
