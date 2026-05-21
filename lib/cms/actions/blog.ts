"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { prisma } from "@/lib/cms/db";
import { requireUser } from "@/lib/cms/auth/session";
import { blogSchema, type BlogInput } from "@/lib/cms/validation/blog";
import { sanitizeText, sanitizeMarkdown } from "@/lib/cms/sanitize";
import { resolveImageField } from "@/lib/cms/images";
import { formToObject, type ActionState } from "@/lib/cms/actions/helpers";

async function buildData(fd: FormData, d: BlogInput) {
  const coverImageUrl = await resolveImageField(fd, "cover", "blog");
  const ogImageUrl = await resolveImageField(fd, "og", "blog");
  return {
    slug: d.slug,
    title: sanitizeText(d.title),
    dek: sanitizeText(d.dek),
    pill: sanitizeText(d.pill),
    date: sanitizeText(d.date),
    author: sanitizeText(d.author),
    readTime: sanitizeText(d.readTime),
    bodyMarkdown: sanitizeMarkdown(d.bodyMarkdown),
    status: d.status,
    coverImageUrl: coverImageUrl || null,
    ogImageUrl: ogImageUrl || null,
    seoTitle: d.seoTitle ? sanitizeText(d.seoTitle) : null,
    seoDescription: d.seoDescription ? sanitizeText(d.seoDescription) : null,
  };
}

function revalidateBlog(slug: string, oldSlug?: string) {
  revalidateTag("cms:blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (oldSlug && oldSlug !== slug) revalidatePath(`/blog/${oldSlug}`);
}

export async function createPost(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = blogSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  const existing = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { ok: false, errors: { slug: ["That slug is already in use."] } };

  const data = await buildData(fd, parsed.data);
  await prisma.blogPost.create({ data });
  revalidateBlog(data.slug);
  return { ok: true, message: "Post created." };
}

export async function updatePost(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const parsed = blogSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  const clash = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (clash && clash.id !== id) return { ok: false, errors: { slug: ["That slug is already in use."] } };

  const current = await prisma.blogPost.findUnique({ where: { id } });
  const data = await buildData(fd, parsed.data);
  await prisma.blogPost.update({ where: { id }, data });
  revalidateBlog(data.slug, current?.slug);
  return { ok: true, message: "Saved." };
}

export async function deletePost(fd: FormData): Promise<void> {
  await requireUser();
  const id = String(fd.get("id") ?? "");
  const post = await prisma.blogPost.findUnique({ where: { id } });
  await prisma.blogPost.delete({ where: { id } });
  if (post) revalidateBlog(post.slug);
}
