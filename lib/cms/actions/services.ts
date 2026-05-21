"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { serviceSchema, type ServiceInput } from "@/lib/cms/validation/services";
import { sanitizeText, sanitizeUrl } from "@/lib/cms/sanitize";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

function clean(d: ServiceInput, fd: FormData) {
  return {
    title: sanitizeText(d.title),
    description: sanitizeText(d.description),
    iconName: d.iconName,
    href: sanitizeUrl(d.href),
    order: d.order,
    published: fd.get("published") === "on",
  };
}

export async function createService(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = serviceSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.service.create({ data: clean(parsed.data, fd) });
  revalidateTag("cms:services");
  return { ok: true, message: "Service added." };
}

export async function updateService(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = serviceSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.service.update({ where: { id }, data: clean(parsed.data, fd) });
  revalidateTag("cms:services");
  return { ok: true, message: "Saved." };
}

export async function deleteService(fd: FormData): Promise<void> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  await prisma.service.delete({ where: { id } });
  revalidateTag("cms:services");
}
