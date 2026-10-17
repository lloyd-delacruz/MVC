import { NextResponse, type NextRequest } from "next/server";
import { GONE, resolveLegacy } from "@/lib/legacy-redirects";
import { REDIRECT_HOSTS, SITE_HOST } from "@/lib/site";

/**
 * Edge rules, applied in one pass so every old URL resolves in a single hop:
 *
 *   1. www.mvcimmigration.com → mvcimmigration.com (301, path + query kept)
 *   2. Legacy WordPress / Webs.com URLs → closest new page (301) or 410 Gone
 *   3. Trailing slash → no trailing slash (301), matching Next's default URLs
 *   4. Any host other than the canonical one (Vercel preview / deployment
 *      URLs, staging aliases) gets `X-Robots-Tag: noindex, nofollow`.
 *
 * HTTP → HTTPS is enforced by Vercel before the request reaches this code.
 * next.config.mjs sets skipTrailingSlashRedirect so (3) happens here,
 * combined with (1) and (2), instead of as a separate extra hop.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  const isCanonicalHost = host === SITE_HOST;
  const isRedirectHost = REDIRECT_HOSTS.includes(host);

  let pathname = url.pathname;
  let changed = false;

  // (2) legacy URLs
  const legacy = resolveLegacy(pathname);
  if (legacy === GONE) {
    return gone(isCanonicalHost);
  }
  if (legacy) {
    pathname = legacy;
    changed = true;
  }

  // (3) trailing slash (never on "/")
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "");
    changed = true;
  }

  // (1) host canonicalisation
  if (isRedirectHost || changed) {
    const target = new URL(url.toString());
    if (isRedirectHost) {
      target.protocol = "https:";
      target.host = SITE_HOST;
      target.port = "";
    }
    target.pathname = pathname;
    return NextResponse.redirect(target, 301);
  }

  const res = NextResponse.next();
  // (4) keep every non-production host out of search indexes
  if (!isCanonicalHost) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

function gone(isCanonicalHost: boolean) {
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page removed · MVC Immigration</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;color:#002242"><h1 style="font-size:28px">This page has been removed</h1><p>The article or page you were looking for is no longer available. Immigration rules change often, so we retired outdated content.</p><p><a href="/" style="color:#c91f1a">Go to the homepage</a> · <a href="/pathways" style="color:#c91f1a">Immigration pathways</a> · <a href="/blog" style="color:#c91f1a">Latest articles</a> · <a href="/contact" style="color:#c91f1a">Contact us</a></p></body></html>`;
  const headers: Record<string, string> = { "content-type": "text/html; charset=utf-8" };
  if (!isCanonicalHost) headers["X-Robots-Tag"] = "noindex, nofollow";
  return new NextResponse(body, { status: 410, headers });
}

export const config = {
  // Skip Next internals and static files with an extension that Next serves
  // directly (images, fonts, robots.txt, sitemap.xml, icons). Legacy .xml/.php
  // paths are still matched because they are listed explicitly below.
  matcher: [
    "/((?!_next/|_vercel/|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|css|js|map|txt)$).*)",
  ],
};
