"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { badgeSchema, whyChooseSchema, ctaSchema, type BadgeInput } from "@/lib/cms/validation/homepage-extras";
import { sanitizeText, sanitizeUrl } from "@/lib/cms/sanitize";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

const TAG = "cms:homepage-extras";

function cleanBadge(d: BadgeInput) {
  return {
    iconName: d.iconName,
    title: sanitizeText(d.title),
    description: sanitizeText(d.description),
    order: d.order,
  };
}

// --- Trust badges ---
export async function createTrustBadge(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = badgeSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.trustBadge.create({ data: cleanBadge(parsed.data) });
  revalidateTag(TAG);
  return { ok: true, message: "Added." };
}
export async function updateTrustBadge(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = badgeSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.trustBadge.update({ where: { id }, data: cleanBadge(parsed.data) });
  revalidateTag(TAG);
  return { ok: true, message: "Saved." };
}
export async function deleteTrustBadge(fd: FormData): Promise<void> {
  await requireUser();
  await prisma.trustBadge.delete({ where: { id: String(fd.get("id") ?? "") } });
  revalidateTag(TAG);
}

// --- Why-choose items ---
export async function createWhyChoose(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = whyChooseSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.whyChooseItem.create({ data: cleanBadge(parsed.data) });
  revalidateTag(TAG);
  return { ok: true, message: "Added." };
}
export async function updateWhyChoose(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = whyChooseSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.whyChooseItem.update({ where: { id }, data: cleanBadge(parsed.data) });
  revalidateTag(TAG);
  return { ok: true, message: "Saved." };
}
export async function deleteWhyChoose(fd: FormData): Promise<void> {
  await requireUser();
  await prisma.whyChooseItem.delete({ where: { id: String(fd.get("id") ?? "") } });
  revalidateTag(TAG);
}

// --- CTA banner (singleton) ---
export async function saveCtaBanner(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = ctaSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  const data = {
    headline: sanitizeText(d.headline),
    body: sanitizeText(d.body),
    buttonLabel: sanitizeText(d.buttonLabel),
    buttonHref: sanitizeUrl(d.buttonHref),
  };
  await prisma.ctaBanner.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
  revalidateTag(TAG);
  return { ok: true, message: "Saved." };
}
