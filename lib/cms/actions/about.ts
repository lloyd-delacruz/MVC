"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { aboutSchema } from "@/lib/cms/validation/about";
import { sanitizeText, sanitizeMarkdown } from "@/lib/cms/sanitize";
import { resolveImageField } from "@/lib/cms/images";
import { ABOUT_FALLBACK } from "@/lib/cms/fallbacks/about";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

export async function saveAbout(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();

  const parsed = aboutSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;

  const imageUrl = (await resolveImageField(fd, "image", "about")) || ABOUT_FALLBACK.imageUrl;

  const data = {
    eyebrow: sanitizeText(d.eyebrow),
    heading: sanitizeText(d.heading),
    lede: sanitizeText(d.lede),
    bodyMarkdown: sanitizeMarkdown(d.bodyMarkdown),
    imageUrl,
    imageAlt: sanitizeText(d.imageAlt || d.heading),
  };

  await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });

  revalidateTag("cms:about");
  return { ok: true, message: "Saved." };
}
