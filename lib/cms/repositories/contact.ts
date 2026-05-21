import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { CONTACT_FALLBACK } from "@/lib/cms/fallbacks/contact";
import type { ContactContent } from "@/lib/cms/types";

async function loadContact(): Promise<ContactContent> {
  const row = await prisma.contactInfo.findUnique({
    where: { id: "singleton" },
    include: {
      offices: { orderBy: { order: "asc" } },
      bookingOptions: { orderBy: { order: "asc" } },
      socialLinks: { orderBy: { order: "asc" } },
    },
  });
  if (!row) return CONTACT_FALLBACK;

  return {
    phone: row.phone,
    email: row.email,
    addressLine: row.addressLine,
    offices: row.offices.map((o) => ({ id: o.id, iconName: o.iconName, label: o.label, lines: o.lines })),
    bookingOptions: row.bookingOptions.map((b) => ({
      id: b.id,
      title: b.title,
      price: b.price,
      description: b.description,
      href: b.href,
    })),
    socialLinks: row.socialLinks.map((s) => ({ id: s.id, platform: s.platform, url: s.url })),
  };
}

export const getContact = cached(
  async (): Promise<ContactContent> => {
    try {
      return await loadContact();
    } catch {
      return CONTACT_FALLBACK;
    }
  },
  ["cms:contact"],
  ["cms:contact"],
);

export async function getContactForAdmin(): Promise<ContactContent> {
  try {
    return await loadContact();
  } catch {
    return CONTACT_FALLBACK;
  }
}
