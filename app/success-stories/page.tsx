import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Stamp,
  Route,
  HeartHandshake,
  MessageSquareQuote,
} from "lucide-react";
import { MapleLeaf } from "@/components/ui/MapleLeaf";
import { BottomCta } from "@/components/ui/BottomCta";
import { StoriesGallery } from "@/components/sections/StoriesGallery";
import { getTestimonials, getGoogleReviews } from "@/lib/content/testimonials";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return buildPageMetadata("success-stories");
}

// Trust stats — confirmed safe to display per client direction.
// NOTE: "500+" is a PLACEHOLDER — replace with the real approval count before launch.
const STATS = [
  {
    icon: ShieldCheck,
    value: "RCIC",
    label: "Licensed & CICC-regulated consultant",
  },
  {
    icon: Stamp,
    value: "500+",
    label: "Successful visas & approvals",
  },
  {
    icon: Route,
    value: "5 pathways",
    label: "PR · Study · Work · Family · Citizenship",
  },
];

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

function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} fill-amber-400 text-amber-400`} />
      ))}
    </span>
  );
}

export default async function SuccessStoriesPage() {
  const [stories, reviews] = await Promise.all([
    getTestimonials(),
    getGoogleReviews(),
  ]);

  // JSON-LD: aggregate rating + individual reviews for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "My Visa For Canada (MVC) Immigration Firm",
    description:
      "Regulated Canadian Immigration Consultant (RCIC) in Vancouver, BC helping families, students, and workers immigrate to Canada.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: String(stories.length + reviews.length),
      bestRating: "5",
    },
    review: [
      ...stories.map((s) => ({
        "@type": "Review",
        author: { "@type": "Person", name: s.author },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: s.quote,
      })),
      ...reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(r.rating),
          bestRating: "5",
        },
        reviewBody: r.text,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ───────────────────── Hero with embedded trust stats ───────────────────── */}
      <section className="relative overflow-hidden bg-navy-800 text-white">
        <MapleLeaf className="absolute -left-8 -top-10 h-40 w-40 rotate-12 text-white/[0.04]" />
        <MapleLeaf className="absolute -right-10 -bottom-12 h-52 w-52 -rotate-12 text-white/[0.04]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="container-x relative py-14 text-center sm:py-16 lg:py-20">
          <div className="mx-auto flex w-fit items-center gap-2.5 rounded-full bg-white/10 px-4 py-1.5 text-[12.5px] font-medium text-white ring-1 ring-inset ring-white/15">
            <Stars className="h-3.5 w-3.5" />
            <span>Rated 5.0 by clients across Canada &amp; abroad</span>
          </div>

          <h1 className="headline-serif mx-auto mt-6 max-w-3xl text-[28px] font-medium leading-[1.15] sm:text-[38px] lg:text-[46px] lg:leading-[1.08]">
            Real families. Real approvals.
            <br className="hidden sm:block" /> Real Canadian dreams.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[14.5px] leading-relaxed text-slate-300 sm:text-[16px]">
            These aren&apos;t stock photos. Every face below is an MVC client holding
            their approved Canadian visa, permit, or passport — proof of what&apos;s
            possible when you have the right people in your corner.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-red px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(201,31,26,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-redDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 sm:w-auto"
            >
              Book a Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#reviews"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            >
              Read verified reviews
            </Link>
          </div>

          {/* Trust stat strip — embedded inside the hero, no gap below */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-inset ring-white/10 sm:grid-cols-3">
            {STATS.map((s) => (
              <div
                key={s.value}
                className="flex flex-col items-center gap-1.5 bg-navy-800 px-5 py-6 text-center"
              >
                <s.icon className="h-5 w-5 text-brand-red" strokeWidth={1.8} />
                <span className="headline-serif text-[24px] font-semibold leading-none text-white">
                  {s.value}
                </span>
                <span className="text-[12px] leading-snug text-slate-300">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── Client stories ───────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
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

          <p className="mx-auto mt-10 max-w-2xl text-center text-[12px] leading-relaxed text-slate-400">
            Photos and stories shared with each client&apos;s permission. Every case is
            unique — past results don&apos;t guarantee future outcomes, which always
            depend on your individual circumstances.
          </p>
        </div>
      </section>

      {/* ───────────────────── Verified Google reviews ───────────────────── */}
      <section id="reviews" className="scroll-mt-20 bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 shadow-card">
              <span className="headline-serif text-[18px] font-semibold text-navy-800">
                5.0
              </span>
              <Stars />
              <span className="text-[12.5px] font-medium text-slate-500">
                Verified Google reviews
              </span>
            </div>
            <h2 className="headline-serif text-[28px] font-medium leading-tight text-navy-800 sm:text-[34px]">
              What clients say about working with us
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure
                key={r.id}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-[15px] font-semibold text-white">
                    {r.initial}
                  </div>
                  <div>
                    <figcaption className="text-[14px] font-semibold text-navy-800">
                      {r.author}
                    </figcaption>
                    <p className="text-[11.5px] text-slate-400">{r.date}</p>
                  </div>
                  <svg
                    className="ml-auto h-5 w-5"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
                    />
                  </svg>
                </div>
                <Stars className="mt-4 h-4 w-4" />
                <blockquote className="mt-3 text-[13.5px] leading-relaxed text-slate-600">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
              </figure>
            ))}
          </div>

          <div className="mt-9 text-center">
            {/* TODO: point href at the client's real Google Business reviews URL */}
            <a
              href="#"
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
                className="flex flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-cream-50 p-6"
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
        buttonHref="/contact"
      />
    </>
  );
}
