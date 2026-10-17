import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";

// Rendered for unknown URLs with a genuine HTTP 404 status.
// Next.js also adds its own <meta name="robots" content="noindex">; this
// override stops the layout's "index, follow" from appearing alongside it.
export const metadata: Metadata = {
  title: { absolute: "Page not found | MVC Immigration" },
  robots: { index: false, follow: true },
};

const LINKS = [
  { label: "Immigration pathways", href: "/pathways", body: "Express Entry, work and study permits, family sponsorship, BC PNP and more." },
  { label: "Get started", href: "/get-started", body: "Six quick questions to find the pathway that fits you." },
  { label: "Immigration insights", href: "/blog", body: "Plain-English guides from our regulated consultants." },
  { label: "Contact us", href: "/contact", body: "Call, email or visit our Burnaby office by appointment." },
];

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="Error 404"
        title="We couldn’t find that page."
        lede="The link may be out of date, or the page may have moved when we launched our new website. These pages are a good place to continue."
      />
      <section className="bg-white py-16 lg:py-20">
        <ul className="container-x grid gap-5 sm:grid-cols-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex h-full flex-col rounded-xl border border-brand-blue/20 bg-white p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-cardHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
              >
                <span className="headline-serif text-[20px] font-semibold text-navy-800 group-hover:text-brand-red">
                  {l.label}
                </span>
                <span className="mt-2 flex-1 text-[13.5px] leading-relaxed text-slate-500">{l.body}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-red">
                  Go there <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <BottomCta />
    </>
  );
}
