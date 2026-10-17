"use client";

import { useEffect } from "react";

type Gtag = (...args: unknown[]) => void;

/**
 * One delegated listener that reports key CTA clicks to GA4 (if gtag has been
 * configured — see Analytics.tsx; otherwise it does nothing).
 *
 * Sends only: event name, page path, link domain and the link's visible label
 * (button text such as "Book a Free Assessment"). Never the phone number,
 * email address, form fields or query strings.
 */
export function ClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      if (!gtag) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const event = classify(href);
      if (!event) return;
      let domain = "";
      try {
        domain = new URL(a.href).hostname;
      } catch {
        /* tel:/mailto: have no host */
      }
      gtag("event", event, {
        link_domain: domain || undefined,
        // No label for phone/email links: their text is the number/address itself.
        link_text:
          event === "phone_click" || event === "email_click"
            ? undefined
            : (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60) || undefined,
        page_path: window.location.pathname,
        transport_type: "beacon",
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

function classify(href: string): string | null {
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("mailto:") || href.startsWith("https://mail.google.com/")) return "email_click";
  if (/^https:\/\/(zcform\.com|forms\.zohopublic\.com)\//.test(href)) return "assessment_click";
  if (/^https:\/\/calendly\.com\//.test(href)) return "booking_click";
  return null;
}
