"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import {
  contactInfoSchema,
  officeSchema,
  bookingSchema,
  socialSchema,
} from "@/lib/cms/validation/contact";
import { sanitizeText, sanitizeUrl } from "@/lib/cms/sanitize";
import { CONTACT_FALLBACK } from "@/lib/cms/fallbacks/contact";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

const TAG = "cms:contact";

// The child rows reference the singleton ContactInfo; make sure it exists.
async function ensureContact() {
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
}

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((l) => sanitizeText(l))
    .filter(Boolean);
}

// --- Top-level contact info ---
export async function saveContactInfo(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = contactInfoSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  await prisma.contactInfo.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", phone: sanitizeText(d.phone), email: sanitizeText(d.email), addressLine: sanitizeText(d.addressLine) },
    update: { phone: sanitizeText(d.phone), email: sanitizeText(d.email), addressLine: sanitizeText(d.addressLine) },
  });
  revalidateTag(TAG);
  return { ok: true, message: "Saved." };
}

// --- Offices ---
export async function createOffice(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = officeSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await ensureContact();
  const d = parsed.data;
  await prisma.office.create({
    data: { contactId: "singleton", iconName: d.iconName, label: sanitizeText(d.label), lines: parseLines(d.lines), order: d.order },
  });
  revalidateTag(TAG);
  return { ok: true, message: "Added." };
}
export async function updateOffice(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = officeSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  await prisma.office.update({
    where: { id },
    data: { iconName: d.iconName, label: sanitizeText(d.label), lines: parseLines(d.lines), order: d.order },
  });
  revalidateTag(TAG);
  return { ok: true, message: "Saved." };
}
export async function deleteOffice(fd: FormData): Promise<void> {
  await requireUser();
  await prisma.office.delete({ where: { id: String(fd.get("id") ?? "") } });
  revalidateTag(TAG);
}

// --- Booking options ---
export async function createBooking(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = bookingSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await ensureContact();
  const d = parsed.data;
  await prisma.bookingOption.create({
    data: { contactId: "singleton", title: sanitizeText(d.title), price: sanitizeText(d.price), description: sanitizeText(d.description), href: sanitizeUrl(d.href), order: d.order },
  });
  revalidateTag(TAG);
  return { ok: true, message: "Added." };
}
export async function updateBooking(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = bookingSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  await prisma.bookingOption.update({
    where: { id },
    data: { title: sanitizeText(d.title), price: sanitizeText(d.price), description: sanitizeText(d.description), href: sanitizeUrl(d.href), order: d.order },
  });
  revalidateTag(TAG);
  return { ok: true, message: "Saved." };
}
export async function deleteBooking(fd: FormData): Promise<void> {
  await requireUser();
  await prisma.bookingOption.delete({ where: { id: String(fd.get("id") ?? "") } });
  revalidateTag(TAG);
}

// --- Social links ---
export async function createSocial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = socialSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await ensureContact();
  const d = parsed.data;
  await prisma.socialLink.create({
    data: { contactId: "singleton", platform: sanitizeText(d.platform), url: sanitizeUrl(d.url), order: d.order },
  });
  revalidateTag(TAG);
  return { ok: true, message: "Added." };
}
export async function updateSocial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = socialSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  await prisma.socialLink.update({
    where: { id },
    data: { platform: sanitizeText(d.platform), url: sanitizeUrl(d.url), order: d.order },
  });
  revalidateTag(TAG);
  return { ok: true, message: "Saved." };
}
export async function deleteSocial(fd: FormData): Promise<void> {
  await requireUser();
  await prisma.socialLink.delete({ where: { id: String(fd.get("id") ?? "") } });
  revalidateTag(TAG);
}
