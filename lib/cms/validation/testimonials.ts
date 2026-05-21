import { z } from "zod";

export const testimonialSchema = z.object({
  author: z.string().trim().min(1, "Required").max(80),
  location: z.string().trim().min(1, "Required").max(80),
  year: z.string().trim().min(1, "Required").max(10),
  pathway: z.string().trim().min(1, "Required").max(80),
  quote: z.string().trim().min(1, "Required").max(800),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
