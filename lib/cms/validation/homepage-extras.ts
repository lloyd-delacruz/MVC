import { z } from "zod";
import { ICON_NAMES } from "@/lib/cms/icons";

export const badgeSchema = z.object({
  iconName: z.string().refine((v) => ICON_NAMES.includes(v), "Choose an icon"),
  title: z.string().trim().min(1, "Required").max(80),
  description: z.string().trim().min(1, "Required").max(200),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

// Why-choose items have the same shape as trust badges.
export const whyChooseSchema = badgeSchema;

export const ctaSchema = z.object({
  headline: z.string().trim().min(1, "Required").max(200),
  body: z.string().trim().min(1, "Required").max(400),
  buttonLabel: z.string().trim().min(1, "Required").max(60),
  buttonHref: z.string().trim().min(1, "Required").max(300),
});

export type BadgeInput = z.infer<typeof badgeSchema>;
export type CtaInput = z.infer<typeof ctaSchema>;
