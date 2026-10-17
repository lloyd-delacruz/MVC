import Script from "next/script";
import { SITE_HOST, isIndexableBuild } from "@/lib/site";

/**
 * Google Analytics 4, loaded once from the root layout.
 *
 * Production only, twice over:
 *   - server: rendered only for a production build with a measurement ID set
 *     (NEXT_PUBLIC_GA_MEASUREMENT_ID, e.g. "G-XXXXXXXXXX");
 *   - browser: gtag is configured only when the page is served from the
 *     canonical host, so the same production build viewed on *.vercel.app
 *     (or localhost) never sends hits.
 *
 * Privacy: no form contents, names, emails or phone numbers are ever sent.
 * Events carry only the event name, the page path and a short link label.
 * page_location is sent without its query string. Google Signals and ad
 * personalisation are disabled.
 *
 * Events (see ClickTracker.tsx for the click tracker):
 *   phone_click, email_click, assessment_click, booking_click — CTA clicks
 *   generate_lead — fired on /thank-you after a confirmed enquiry submission
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id || !isIndexableBuild()) return null;

  const init = `
(function(){
  if (location.hostname !== ${JSON.stringify(SITE_HOST)}) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ${JSON.stringify(id)}, {
    page_location: location.origin + location.pathname,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${JSON.stringify(id)};
  document.head.appendChild(s);
})();`;

  return (
    <Script id="ga4-init" strategy="afterInteractive">
      {init}
    </Script>
  );
}
