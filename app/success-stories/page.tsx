import {
  FREE_ASSESSMENT_URL,
  GOOGLE_REVIEWS_URL,
  ELFSIGHT_REVIEWS_WIDGET_ID,
} from "@/lib/links";
import Script from "next/script";
import {
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  MessageSquareQuote,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";
import { StoriesGallery } from "@/components/sections/StoriesGallery";
import { GoogleReviewsButton } from "@/components/ui/GoogleReviewsButton";
import { getTestimonials } from "@/lib/content/testimonials";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return pageMetadata("/success-stories");
}

const REASSURANCE = [
  {
    icon: MessageSquareQuote,
    title: "Free first consultation",
    body: "Talk to a real consultant before you commit a dollar. No pressure, no jargon.",
  },
  {
    icon: ShieldCheck,
    title: "Licensed & accountable",
    body: "Your file is handled by a Regulated Canadian Immigration Consultant (RCIC), not a referral mill.",
  },
  {
    icon: HeartHandshake,
    title: "Honest assessment",
    body: "If a pathway isn't right for you, we'll tell you. We only take cases we believe in.",
  },
];

export default async function SuccessStoriesPage() {
  const stories = await getTestimonials();

  // No review/rating JSON-LD here on purpose: testimonials published by the
  // business itself are "self-serving" reviews, which Google does not allow in
  // LocalBusiness/Organization markup, and the star values were not shown on
  // the page. Site-wide business markup lives in lib/schema.ts.
  return (
    <>
      {/* ───────────────────── Hero — standard PageHero, matches other pages ───────────────────── */}
      <PageHero
        eyebrow="Reviews · Success Stories"
        title="Real families. Real approvals. Real Canadian dreams."
      />

      {/* ───────────────────── Client stories ───────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          {/* Client feedback item 16 — Google Reviews button right under the hero */}
          <div className="mx-auto mb-12 max-w-sm">
            <GoogleReviewsButton />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              Approved · In their own words
            </p>
            <h2 className="headline-serif mt-2 text-[30px] font-medium leading-tight text-navy-800 sm:text-[36px]">
              Stories from people just like you
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500">
              Tap any story to read the full journey — from first consultation to
              landing in Canada.
            </p>
          </div>

          <div className="mt-12">
            <StoriesGallery stories={stories} />
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-[12px] leading-relaxed text-slate-500">
            Photos and stories shared with each client&apos;s permission. Every case is
            unique — past results don&apos;t guarantee future outcomes, which always
            depend on your individual circumstances.
          </p>
        </div>
      </section>

      {/* ───────────────────── Verified Google reviews (live, via Elfsight) ───────────────────── */}
      <section id="reviews" className="scroll-mt-20 bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <div
            className={`elfsight-app-${ELFSIGHT_REVIEWS_WIDGET_ID} min-h-[480px]`}
            data-elfsight-app-lazy
          />
          <Script
            src="https://static.elfsight.com/platform/platform.js"
            strategy="lazyOnload"
          />

          <div className="mt-9 text-center">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-800 underline underline-offset-4 transition-colors hover:text-brand-red"
            >
              See all reviews on Google
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────────── Risk-reversal band ───────────────────── */}
      <section className="bg-white py-14 lg:py-16">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-3">
            {REASSURANCE.map((r) => (
              <div
                key={r.title}
                className="flex flex-col items-start gap-3 rounded-2xl border border-brand-blue/20 bg-cream-50 p-6 shadow-card"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-redSoft text-brand-red">
                  <r.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <h3 className="headline-serif text-[18px] font-medium text-navy-800">
                  {r.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-slate-500">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomCta
        title="Your success story starts with a conversation."
        body="Book a free, no-obligation consultation with a licensed RCIC and find out exactly what your pathway to Canada looks like."
        buttonText="Book a Free Consultation"
        buttonHref={FREE_ASSESSMENT_URL}
      />
    </>
  );
}
