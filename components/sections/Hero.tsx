import Image from "next/image";
import { Check, BadgeCheck, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { HeroContent } from "@/lib/content/types";

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative bg-white">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-20">
        <div className="min-w-0 animate-fadeUp">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-navy-800 sm:text-[10.5px] sm:tracking-[0.22em]">
            {content.eyebrow}
          </p>

          <h1 className="headline-serif mt-4 break-words text-[26px] font-medium leading-[1.15] text-navy-800 sm:text-[44px] lg:text-[58px] lg:leading-[1.05]">
            {content.headline}
          </h1>

          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-slate-500 sm:text-[14.5px]">
            {content.dek}
          </p>

          <div className="mt-7 grid max-w-md grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {content.guarantees.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 text-[13.5px] font-medium text-navy-800"
              >
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={content.primaryCtaHref} variant="primary" trail="calendar" className="w-full sm:w-auto">
              {content.primaryCtaLabel}
            </Button>
            <Button href={content.secondaryCtaHref} variant="outline" trail="arrow" className="w-full sm:w-auto">
              {content.secondaryCtaLabel}
            </Button>
          </div>
        </div>

        <div className="relative min-w-0 animate-fadeUp [animation-delay:120ms]">
          <div className="relative overflow-hidden rounded-[24px] shadow-portrait">
            <Image
              src={content.imageUrl}
              alt={content.imageAlt}
              width={568}
              height={596}
              className="h-[420px] w-full object-cover object-[center_20%] sm:h-[460px]"
              priority
            />
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-[260px]">
              <div className="rounded-xl bg-navy-800 px-4 py-3 text-white shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold leading-tight">
                    {content.founderName}
                  </span>
                  <BadgeCheck className="h-4 w-4 text-brand-red" />
                </div>
                <div className="mt-0.5 text-[10px] tracking-wide text-slate-300">
                  {content.founderTitle}
                </div>
                <p className="mt-1.5 text-[11.5px] italic leading-snug text-slate-200">
                  {content.founderQuote}
                </p>
              </div>
            </div>
          </div>

          {content.reviewsCtaHref && (
            <a
              href={content.reviewsCtaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex items-center justify-between gap-3 rounded-xl border border-brand-blue/20 bg-white px-4 py-3 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-redBorder hover:shadow-cardHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40"
            >
              <span className="flex items-center gap-3">
                <GoogleG className="h-6 w-6 shrink-0" />
                <span className="flex flex-col">
                  <span className="text-[13.5px] font-semibold text-navy-800 group-hover:text-brand-red">
                    {content.reviewsCtaLabel ?? "See our Google Reviews"}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-slate-500">
                    <span className="inline-flex gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                    5.0 rating on Google
                  </span>
                </span>
              </span>
              <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-brand-red" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}
