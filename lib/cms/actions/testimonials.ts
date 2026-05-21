"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { testimonialSchema, type TestimonialInput } from "@/lib/cms/validation/testimonials";
import { sanitizeText } from "@/lib/cms/sanitize";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

function clean(d: TestimonialInput, fd: FormData) {
  return {
    author: sanitizeText(d.author),
    location: sanitizeText(d.location),
    year: sanitizeText(d.year),
    pathway: sanitizeText(d.pathway),
    quote: sanitizeText(d.quote),
    order: d.order,
    published: fd.get("published") === "on",
  };
}

export async function createTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = testimonialSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.testimonial.create({ data: clean(parsed.data, fd) });
  revalidateTag("cms:testimonials");
  return { ok: true, message: "Story added." };
}

export async function updateTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = testimonialSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.testimonial.update({ where: { id }, data: clean(parsed.data, fd) });
  revalidateTag("cms:testimonials");
  return { ok: true, message: "Saved." };
}

export async function deleteTestimonial(fd: FormData): Promise<void> {
  await requireUser();
  await prisma.testimonial.delete({ where: { id: String(fd.get("id") ?? "") } });
  revalidateTag("cms:testimonials");
}
