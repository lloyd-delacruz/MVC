import { z } from "zod";

export const seoSchema = z.object({
  title: z.string().trim().min(1, "Required").max(70),
  description: z.string().trim().min(1, "Required").max(200),
});

export type SeoInput = z.infer<typeof seoSchema>;
