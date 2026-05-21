import { z } from "zod";

export const aboutSchema = z.object({
  eyebrow: z.string().trim().min(1, "Required").max(120),
  heading: z.string().trim().min(1, "Required").max(200),
  lede: z.string().trim().min(1, "Required").max(400),
  bodyMarkdown: z.string().trim().min(1, "Required").max(8000),
  imageAlt: z.string().trim().max(200).optional(),
});

export type AboutInput = z.infer<typeof aboutSchema>;
