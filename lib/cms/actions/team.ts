"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { teamSchema } from "@/lib/cms/validation/team";
import { sanitizeText } from "@/lib/cms/sanitize";
import { resolveImageField } from "@/lib/cms/images";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

export async function createTeamMember(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = teamSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;

  const imageUrl = await resolveImageField(fd, "image", "team");
  if (!imageUrl) return { ok: false, errors: { image: ["A photo is required."] } };

  await prisma.teamMember.create({
    data: {
      name: sanitizeText(d.name),
      role: sanitizeText(d.role),
      imageUrl,
      imageAlt: sanitizeText(d.imageAlt || d.name),
      bio: d.bio ? sanitizeText(d.bio) : null,
      order: d.order,
      published: fd.get("published") === "on",
    },
  });

  revalidateTag("cms:team");
  return { ok: true, message: "Team member added." };
}

export async function updateTeamMember(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = teamSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;

  const imageUrl = await resolveImageField(fd, "image", "team");
  if (!imageUrl) return { ok: false, errors: { image: ["A photo is required."] } };

  await prisma.teamMember.update({
    where: { id },
    data: {
      name: sanitizeText(d.name),
      role: sanitizeText(d.role),
      imageUrl,
      imageAlt: sanitizeText(d.imageAlt || d.name),
      bio: d.bio ? sanitizeText(d.bio) : null,
      order: d.order,
      published: fd.get("published") === "on",
    },
  });

  revalidateTag("cms:team");
  return { ok: true, message: "Saved." };
}

export async function deleteTeamMember(fd: FormData): Promise<void> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  await prisma.teamMember.delete({ where: { id } });
  revalidateTag("cms:team");
}
