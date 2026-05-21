import type { Faq } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { FAQS_FALLBACK } from "@/lib/cms/fallbacks/faqs";
import type { FaqItem } from "@/lib/cms/types";

export type AdminFaq = FaqItem & { order: number; published: boolean };

function mapFaq(r: Faq): FaqItem {
  return { id: r.id, category: r.category, question: r.question, answer: r.answer };
}

export const getFaqs = cached(
  async (): Promise<FaqItem[]> => {
    try {
      const rows = await prisma.faq.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      });
      return rows.length ? rows.map(mapFaq) : FAQS_FALLBACK;
    } catch {
      return FAQS_FALLBACK;
    }
  },
  ["cms:faqs"],
  ["cms:faqs"],
);

export async function getFaqsForAdmin(): Promise<AdminFaq[]> {
  try {
    const rows = await prisma.faq.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ ...mapFaq(r), order: r.order, published: r.published }));
  } catch {
    return [];
  }
}
