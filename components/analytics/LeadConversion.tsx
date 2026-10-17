"use client";

import { useEffect } from "react";

/** Fires one GA4 `generate_lead` event (no personal data) when mounted. */
export function LeadConversion() {
  useEffect(() => {
    const send = () => {
      const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
      if (!gtag) return false;
      gtag("event", "generate_lead", { lead_source: "enquiry_form", page_path: "/thank-you" });
      return true;
    };
    if (send()) return;
    // gtag loads afterInteractive — retry briefly.
    const t = setInterval(() => send() && clearInterval(t), 500);
    const stop = setTimeout(() => clearInterval(t), 8000);
    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  }, []);
  return null;
}
