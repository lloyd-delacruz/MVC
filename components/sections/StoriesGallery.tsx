"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, CalendarDays, MapPin, Quote, X } from "lucide-react";
import type { TestimonialItem } from "@/lib/content/types";

function OutcomeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
      <BadgeCheck className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function PathwayMeta({ s }: { s: TestimonialItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-slate-500">
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-brand-red" />
        {s.location}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5 text-brand-red" />
        {s.year}
      </span>
      <span className="font-medium text-navy-800">{s.pathway}</span>
    </div>
  );
}

export function StoriesGallery({ stories }: { stories: TestimonialItem[] }) {
  const [active, setActive] = useState<TestimonialItem | null>(null);

  const featured = stories.filter((s) => s.featured);
  const rest = stories.filter((s) => !s.featured);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  return (
    <>
      {/* Featured stories — large, photo beside quote */}
      {featured.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {featured.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s)}
              aria-label={`Read ${s.author}'s full story`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-redBorder hover:shadow-cardHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-cream-100">
                <Image
                  src={s.imageUrl as string}
                  alt={s.imageAlt || s.author}
                  fill
                  sizes="(max-width: 1024px) 100vw, 580px"
                  className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${s.imagePosition ?? "object-center"}`}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-900/35 to-transparent" />
                {s.outcome && (
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-emerald-700 shadow-sm backdrop-blur">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {s.outcome}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <Quote className="h-6 w-6 text-brand-red/20" />
                <blockquote className="mt-2 text-[15px] leading-relaxed text-slate-700">
                  {s.quote}
                </blockquote>
                <div className="mt-auto pt-5">
                  <p className="headline-serif text-[21px] font-medium leading-tight text-navy-800">
                    {s.author}
                  </p>
                  <div className="mt-2">
                    <PathwayMeta s={s} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* The rest — photo-led cards */}
      {rest.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s)}
              aria-label={`Read ${s.author}'s full story`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-redBorder hover:shadow-cardHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-100">
                <Image
                  src={s.imageUrl as string}
                  alt={s.imageAlt || s.author}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${s.imagePosition ?? "object-center"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/65 via-navy-900/0 to-transparent" />
                {s.outcome && (
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-emerald-700 shadow-sm backdrop-blur">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {s.outcome}
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="headline-serif text-[19px] font-medium leading-tight text-white">
                    {s.author}
                  </p>
                  <p className="mt-0.5 text-[12px] text-white/80">
                    {s.location} · {s.pathway}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <Quote className="h-5 w-5 text-brand-red/20" />
                <blockquote className="mt-2 line-clamp-4 text-[13.5px] leading-relaxed text-slate-600">
                  {s.quote}
                </blockquote>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-red">
                  Read full story
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-modal-name"
          className="fixed inset-0 z-50 flex animate-fadeUp items-end justify-center bg-navy-900/75 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <div className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-cardHover sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[4/3] w-full bg-cream-100 sm:aspect-auto sm:min-h-[26rem]">
              <Image
                src={active.imageUrl as string}
                alt={active.imageAlt || active.author}
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className={`object-cover ${active.imagePosition ?? "object-center"}`}
              />
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-7 sm:max-h-[85vh] sm:p-8">
              {active.outcome && <OutcomeBadge label={active.outcome} />}
              <h3
                id="story-modal-name"
                className="headline-serif mt-4 text-[26px] font-medium leading-tight text-navy-800"
              >
                {active.author}
              </h3>
              <div className="mt-2.5">
                <PathwayMeta s={active} />
              </div>
              <Quote className="mt-6 h-7 w-7 text-brand-red/25" />
              <blockquote className="mt-2 text-[15px] leading-[1.75] text-slate-700">
                {active.quote}
              </blockquote>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3 text-[13.5px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(201,31,26,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-redDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
              >
                Start your story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
