import { z } from "zod";
import { ICON_NAMES } from "@/lib/cms/icons";

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Required").max(80),
  description: z.string().trim().min(1, "Required").max(200),
  iconName: z.string().refine((v) => ICON_NAMES.includes(v), "Choose an icon"),
  href: z.string().trim().min(1, "Required").max(300),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
