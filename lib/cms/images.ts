import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { put } from "@vercel/blob";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): { ok: boolean; error?: string } {
  if (!ALLOWED.includes(file.type)) return { ok: false, error: "Use a JPEG, PNG, or WebP image." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Image must be under 5MB." };
  return { ok: true };
}

/**
 * Validate -> optimize to WebP (resize, strip metadata) -> upload to Vercel
 * Blob under `folder/`. Returns the public URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const check = validateImageFile(file);
  if (!check.ok) throw new Error(check.error);

  const input = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(input)
    .rotate() // honor EXIF orientation
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const key = `${folder}/${Date.now()}-${randomUUID()}.webp`;
  const { url } = await put(key, optimized, { access: "public", contentType: "image/webp" });
  return url;
}

/**
 * Resolve an ImageField from submitted FormData: upload a newly-selected file,
 * or keep the existing URL when no new file was chosen. `name` is the field's
 * base name (the component emits `${name}File` and `${name}Url`).
 */
export async function resolveImageField(
  fd: FormData,
  name: string,
  folder: string,
): Promise<string> {
  const file = fd.get(`${name}File`);
  if (file instanceof File && file.size > 0) return uploadImage(file, folder);
  const existing = fd.get(`${name}Url`);
  return typeof existing === "string" ? existing : "";
}
