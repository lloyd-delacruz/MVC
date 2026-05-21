import { prisma } from "../lib/cms/db";
import { HERO_FALLBACK } from "../lib/cms/fallbacks/hero";
import { SERVICES_FALLBACK } from "../lib/cms/fallbacks/services";
import { TEAM_FALLBACK } from "../lib/cms/fallbacks/team";
import {
  TRUST_BADGES_FALLBACK,
  WHY_CHOOSE_FALLBACK,
  CTA_BANNER_FALLBACK,
} from "../lib/cms/fallbacks/homepage-extras";
import { ABOUT_FALLBACK } from "../lib/cms/fallbacks/about";
import { CONTACT_FALLBACK } from "../lib/cms/fallbacks/contact";
import { TESTIMONIALS_FALLBACK } from "../lib/cms/fallbacks/testimonials";
import { FAQS_FALLBACK } from "../lib/cms/fallbacks/faqs";
import { SEO_FALLBACKS } from "../lib/cms/fallbacks/seo";
import { migrateBlog } from "./migrate-blog";

// Idempotent: singletons upsert without overwriting existing edits; collections
// are only seeded when empty; blog upserts by slug.
async function main() {
  // --- Singletons ---
  await prisma.heroSection.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...HERO_FALLBACK },
    update: {},
  });
  await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...ABOUT_FALLBACK },
    update: {},
  });
  await prisma.ctaBanner.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...CTA_BANNER_FALLBACK },
    update: {},
  });

  // --- Homepage collections ---
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: SERVICES_FALLBACK.map((s, i) => ({
        title: s.title,
        description: s.description,
        iconName: s.iconName,
        href: s.href,
        order: i,
      })),
    });
  }
  if ((await prisma.teamMember.count()) === 0) {
    await prisma.teamMember.createMany({
      data: TEAM_FALLBACK.map((m, i) => ({
        name: m.name,
        role: m.role,
        imageUrl: m.imageUrl,
        imageAlt: m.imageAlt,
        bio: m.bio,
        order: i,
      })),
    });
  }
  if ((await prisma.trustBadge.count()) === 0) {
    await prisma.trustBadge.createMany({
      data: TRUST_BADGES_FALLBACK.map((b, i) => ({
        iconName: b.iconName,
        title: b.title,
        description: b.description,
        order: i,
      })),
    });
  }
  if ((await prisma.whyChooseItem.count()) === 0) {
    await prisma.whyChooseItem.createMany({
      data: WHY_CHOOSE_FALLBACK.map((w, i) => ({
        iconName: w.iconName,
        title: w.title,
        description: w.description,
        order: i,
      })),
    });
  }

  // --- Testimonials & FAQs ---
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: TESTIMONIALS_FALLBACK.map((t, i) => ({
        author: t.author,
        location: t.location,
        year: t.year,
        pathway: t.pathway,
        quote: t.quote,
        order: i,
      })),
    });
  }
  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: FAQS_FALLBACK.map((f, i) => ({
        category: f.category,
        question: f.question,
        answer: f.answer,
        order: i,
      })),
    });
  }

  // --- Contact (singleton + children) ---
  await prisma.contactInfo.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      phone: CONTACT_FALLBACK.phone,
      email: CONTACT_FALLBACK.email,
      addressLine: CONTACT_FALLBACK.addressLine,
    },
    update: {},
  });
  if ((await prisma.office.count()) === 0) {
    await prisma.office.createMany({
      data: CONTACT_FALLBACK.offices.map((o, i) => ({
        contactId: "singleton",
        iconName: o.iconName,
        label: o.label,
        lines: o.lines,
        order: i,
      })),
    });
  }
  if ((await prisma.bookingOption.count()) === 0) {
    await prisma.bookingOption.createMany({
      data: CONTACT_FALLBACK.bookingOptions.map((b, i) => ({
        contactId: "singleton",
        title: b.title,
        price: b.price,
        description: b.description,
        href: b.href,
        order: i,
      })),
    });
  }
  if ((await prisma.socialLink.count()) === 0) {
    await prisma.socialLink.createMany({
      data: CONTACT_FALLBACK.socialLinks.map((s, i) => ({
        contactId: "singleton",
        platform: s.platform,
        url: s.url,
        order: i,
      })),
    });
  }

  // --- SEO ---
  for (const seo of Object.values(SEO_FALLBACKS)) {
    await prisma.seoMeta.upsert({
      where: { pageKey: seo.pageKey },
      create: { pageKey: seo.pageKey, title: seo.title, description: seo.description, ogImageUrl: seo.ogImageUrl },
      update: {},
    });
  }

  // --- Blog (from markdown) ---
  await migrateBlog();

  console.log("CMS seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
