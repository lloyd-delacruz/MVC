import { z } from "zod";

export const blogSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  title: z.string().trim().min(1, "Required").max(200),
  dek: z.string().trim().min(1, "Required").max(400),
  pill: z.string().trim().min(1, "Required").max(40),
  date: z.string().trim().min(1, "Required").max(40),
  author: z.string().trim().min(1, "Required").max(120),
  readTime: z.string().trim().min(1, "Required").max(40),
  bodyMarkdown: z.string().trim().min(1, "Required").max(50000),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(200).optional(),
});

export type BlogInput = z.infer<typeof blogSchema>;
