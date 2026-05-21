"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { heroSchema } from "@/lib/cms/validation/hero";
import { sanitizeText, sanitizeUrl } from "@/lib/cms/sanitize";
import { resolveImageField } from "@/lib/cms/images";
import { HERO_FALLBACK } from "@/lib/cms/fallbacks/hero";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

export async function saveHero(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();

  const parsed = heroSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;

  const guarantees = d.guarantees
    .split("\n")
    .map((line) => sanitizeText(line))
    .filter(Boolean)
    .slice(0, 6);

  const imageUrl = (await resolveImageField(fd, "image", "hero")) || HERO_FALLBACK.imageUrl;

  const data = {
    eyebrow: sanitizeText(d.eyebrow),
    headline: sanitizeText(d.headline),
    dek: sanitizeText(d.dek),
    guarantees,
    primaryCtaLabel: sanitizeText(d.primaryCtaLabel),
    primaryCtaHref: sanitizeUrl(d.primaryCtaHref),
    secondaryCtaLabel: sanitizeText(d.secondaryCtaLabel),
    secondaryCtaHref: sanitizeUrl(d.secondaryCtaHref),
    imageUrl,
    imageAlt: sanitizeText(d.imageAlt),
    founderName: sanitizeText(d.founderName),
    founderTitle: sanitizeText(d.founderTitle),
    founderQuote: sanitizeText(d.founderQuote),
  };

  await prisma.heroSection.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });

  revalidateTag("cms:hero");
  return { ok: true, message: "Saved." };
}
