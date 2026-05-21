import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().trim().min(1, "Required").max(80),
  role: z.string().trim().min(1, "Required").max(60),
  imageAlt: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(500).optional(),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export type TeamInput = z.infer<typeof teamSchema>;
