import { z } from "zod";
import { ICON_NAMES } from "@/lib/cms/icons";

export const contactInfoSchema = z.object({
  phone: z.string().trim().min(1, "Required").max(60),
  email: z.string().trim().min(1, "Required").max(160),
  addressLine: z.string().trim().min(1, "Required").max(200),
});

export const officeSchema = z.object({
  iconName: z.string().refine((v) => ICON_NAMES.includes(v), "Choose an icon"),
  label: z.string().trim().min(1, "Required").max(80),
  lines: z.string().trim().min(1, "Add at least one line").max(800),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export const bookingSchema = z.object({
  title: z.string().trim().min(1, "Required").max(120),
  price: z.string().trim().min(1, "Required").max(40),
  description: z.string().trim().min(1, "Required").max(800),
  href: z.string().trim().min(1, "Required").max(400),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export const socialSchema = z.object({
  platform: z.string().trim().min(1, "Required").max(40),
  url: z.string().trim().min(1, "Required").max(400),
  order: z.coerce.number().int().min(0).max(999).default(0),
});
