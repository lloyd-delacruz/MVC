import { z } from "zod";

export const heroSchema = z.object({
  eyebrow: z.string().trim().min(1, "Required").max(120),
  headline: z.string().trim().min(1, "Required").max(200),
  dek: z.string().trim().min(1, "Required").max(400),
  // Newline-delimited in the textarea; the action splits into an array.
  guarantees: z.string().trim().min(1, "Add at least one").max(600),
  primaryCtaLabel: z.string().trim().min(1, "Required").max(60),
  primaryCtaHref: z.string().trim().min(1, "Required").max(300),
  secondaryCtaLabel: z.string().trim().min(1, "Required").max(60),
  secondaryCtaHref: z.string().trim().min(1, "Required").max(300),
  imageAlt: z.string().trim().min(1, "Required").max(200),
  founderName: z.string().trim().min(1, "Required").max(120),
  founderTitle: z.string().trim().min(1, "Required").max(160),
  founderQuote: z.string().trim().min(1, "Required").max(240),
});

export type HeroInput = z.infer<typeof heroSchema>;
