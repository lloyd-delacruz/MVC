import type { MetadataRoute } from "next";
import { SITE_URL, isIndexableBuild } from "@/lib/site";

/**
 * Production: allow everything and point to the sitemap.
 *
 * Preview / staging builds: crawling is deliberately NOT blocked here.
 * Those deployments are excluded with `noindex, nofollow` (meta tag +
 * X-Robots-Tag header) — and Google can only see a noindex on pages it is
 * allowed to crawl. Blocking them in robots.txt could leave URL-only entries
 * in the index. See docs/launch/README.md.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexableBuild()) {
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
