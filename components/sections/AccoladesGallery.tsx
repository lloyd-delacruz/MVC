"use client";

import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";

export type Accolade = {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

export function AccoladesGallery({ accolades }: { accolades: Accolade[] }) {
  const [active, setActive] = useState<Accolade | null>(null);

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
      <ul className="-mx-4 mt-9 flex snap-x snap-mandatory items-center gap-x-6 overflow-x-auto px-4 pb-3 sm:gap-x-10 lg:mx-0 lg:justify-center lg:gap-x-14 lg:overflow-visible lg:px-0 lg:pb-0">
        {accolades.map((a) => (
          <li key={a.id} className="shrink-0 snap-center">
            <button
              type="button"
              onClick={() => setActive(a)}
              className="group rounded-lg p-1 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-4 focus-visible:ring-offset-white"
              aria-label={`Learn more: ${a.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.src}
                alt={a.alt}
                className="h-20 w-auto transition-transform duration-300 group-hover:scale-[1.06] sm:h-24 lg:h-28"
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accolade-title"
          aria-describedby="accolade-description"
          className="fixed inset-0 z-50 flex animate-fadeUp items-end justify-center bg-navy-900/70 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-cardHover">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-44 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.src}
                alt={active.alt}
                className="max-h-full max-w-full"
              />
            </div>

            <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red">
              Recognition
            </p>
            <h3
              id="accolade-title"
              className="headline-serif mt-2 text-center text-[24px] font-semibold leading-tight text-navy-800"
            >
              {active.title}
            </h3>
            <p className="mt-1 text-center text-[14px] font-medium text-slate-500">
              {active.subtitle}
            </p>

            <p
              id="accolade-description"
              className="mt-5 text-center text-[14.5px] leading-relaxed text-slate-600"
            >
              {active.description}
            </p>

            {active.sourceUrl && (
              <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                <a
                  href={active.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-brand-red hover:text-brand-redDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                >
                  View on {active.sourceLabel}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
