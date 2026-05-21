import type { Service } from "@prisma/client";
import { prisma } from "@/lib/cms/db";
import { cached } from "@/lib/cms/cache";
import { SERVICES_FALLBACK } from "@/lib/cms/fallbacks/services";
import type { ServiceItem } from "@/lib/cms/types";

export type AdminService = ServiceItem & { order: number; published: boolean };

function mapService(r: Service): ServiceItem {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    iconName: r.iconName,
    href: r.href,
  };
}

export const getServices = cached(
  async (): Promise<ServiceItem[]> => {
    try {
      const rows = await prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      });
      return rows.length ? rows.map(mapService) : SERVICES_FALLBACK;
    } catch {
      return SERVICES_FALLBACK;
    }
  },
  ["cms:services"],
  ["cms:services"],
);

export async function getServicesForAdmin(): Promise<AdminService[]> {
  try {
    const rows = await prisma.service.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({ ...mapService(r), order: r.order, published: r.published }));
  } catch {
    return [];
  }
}
