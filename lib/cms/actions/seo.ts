"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { seoSchema } from "@/lib/cms/validation/seo";
import { sanitizeText } from "@/lib/cms/sanitize";
import { resolveImageField } from "@/lib/cms/images";
import { SEO_PAGES } from "@/lib/cms/fallbacks/seo";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

const PAGE_PATHS: Record<string, string> = {
  __default__: "/",
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  "why-canada": "/why-canada",
  "success-stories": "/success-stories",
  "get-started": "/get-started",
  blog: "/blog",
};

export async function saveSeo(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();

  const pageKey = String(fd.get("pageKey") ?? "");
  if (!SEO_PAGES.some((p) => p.key === pageKey)) return { ok: false, message: "Unknown page." };

  const parsed = seoSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  const ogImageUrl = await resolveImageField(fd, "og", "seo");
  const data = {
    title: sanitizeText(parsed.data.title),
    description: sanitizeText(parsed.data.description),
    ogImageUrl: ogImageUrl || null,
  };

  await prisma.seoMeta.upsert({
    where: { pageKey },
    create: { pageKey, ...data },
    update: data,
  });

  revalidateTag("cms:seo");
  const path = PAGE_PATHS[pageKey];
  if (path) revalidatePath(path);
  return { ok: true, message: "Saved." };
}
