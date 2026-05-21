"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { faqSchema, type FaqInput } from "@/lib/cms/validation/faqs";
import { sanitizeText } from "@/lib/cms/sanitize";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

function clean(d: FaqInput, fd: FormData) {
  return {
    category: d.category,
    question: sanitizeText(d.question),
    answer: sanitizeText(d.answer),
    order: d.order,
    published: fd.get("published") === "on",
  };
}

export async function createFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = faqSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.faq.create({ data: clean(parsed.data, fd) });
  revalidateTag("cms:faqs");
  return { ok: true, message: "FAQ added." };
}

export async function updateFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = faqSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.faq.update({ where: { id }, data: clean(parsed.data, fd) });
  revalidateTag("cms:faqs");
  return { ok: true, message: "Saved." };
}

export async function deleteFaq(fd: FormData): Promise<void> {
  await requireUser();
  await prisma.faq.delete({ where: { id: String(fd.get("id") ?? "") } });
  revalidateTag("cms:faqs");
}
