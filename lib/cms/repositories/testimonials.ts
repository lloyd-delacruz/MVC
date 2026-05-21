import type { Testimonial } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { TESTIMONIALS_FALLBACK } from "@/lib/cms/fallbacks/testimonials";
import type { TestimonialItem } from "@/lib/cms/types";

export type AdminTestimonial = TestimonialItem & { order: number; published: boolean };

function mapTestimonial(r: Testimonial): TestimonialItem {
  return { id: r.id, author: r.author, location: r.location, year: r.year, pathway: r.pathway, quote: r.quote };
}

export const getTestimonials = cached(
  async (): Promise<TestimonialItem[]> => {
    try {
      const rows = await prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      });
      return rows.length ? rows.map(mapTestimonial) : TESTIMONIALS_FALLBACK;
    } catch {
      return TESTIMONIALS_FALLBACK;
    }
  },
  ["cms:testimonials"],
  ["cms:testimonials"],
);

export async function getTestimonialsForAdmin(): Promise<AdminTestimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ ...mapTestimonial(r), order: r.order, published: r.published }));
  } catch {
    return [];
  }
}
