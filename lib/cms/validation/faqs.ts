import { z } from "zod";
import { FAQ_CATEGORY_KEYS } from "@/lib/cms/faq-categories";

export const faqSchema = z.object({
  category: z.string().refine((v) => (FAQ_CATEGORY_KEYS as readonly string[]).includes(v), "Choose a category"),
  question: z.string().trim().min(1, "Required").max(200),
  answer: z.string().trim().min(1, "Required").max(2000),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export type FaqInput = z.infer<typeof faqSchema>;
