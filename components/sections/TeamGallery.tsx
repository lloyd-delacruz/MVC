"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { TeamMemberItem } from "@/lib/content/types";
import { LanguageChips } from "@/components/ui/LanguageChips";

export function TeamGallery({ members }: { members: TeamMemberItem[] }) {
  const [active, setActive] = useState<TeamMemberItem | null>(null);

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
      <ul className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12">
        {members.map((m) => (
          <li key={m.id} id={m.id} className="scroll-mt-24">
            <button
              type="button"
              onClick={() => setActive(m)}
              className="group flex w-full flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none"
              aria-label={`View ${m.name}'s bio`}
            >
              <div className="relative h-36 w-36 overflow-hidden rounded-full bg-white shadow-portrait ring-4 ring-cream-50 transition-shadow duration-300 group-hover:shadow-cardHover group-focus-visible:ring-brand-red sm:h-44 sm:w-44">
                <Image
                  src={m.imageUrl}
                  alt={m.imageAlt || m.name}
                  width={280}
                  height={280}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${m.imagePosition ?? ""}`}
                />
              </div>
              <h3 className="headline-serif mt-5 text-[18px] font-semibold leading-tight text-navy-800 transition-colors group-hover:text-brand-red">
                {m.name}
              </h3>
              <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-red">
                {m.role}
              </p>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-name"
          className="fixed inset-0 z-50 flex animate-fadeUp items-end justify-center bg-navy-900/70 p-4 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-cardHover">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[85vh] overflow-y-auto px-8 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
              <div className="flex justify-center">
                <div className="relative h-52 w-52 overflow-hidden rounded-full bg-white shadow-portrait ring-4 ring-cream-50">
                  <Image
                    src={active.imageUrl}
                    alt={active.imageAlt || active.name}
                    width={400}
                    height={400}
                    className={`h-full w-full object-cover ${active.imagePosition ?? ""}`}
                  />
                </div>
              </div>

              <p className="mt-6 text-center text-[10.5px] font-semibold uppercase tracking-[0.2em] text-brand-red">
                {active.role}
              </p>
              <h3
                id="team-modal-name"
                className="headline-serif mt-2 text-center text-[28px] font-medium leading-tight text-navy-800"
              >
                {active.name}
              </h3>

              <div className="mt-6 space-y-3.5 text-[15px] leading-[1.75] text-slate-600">
                {(active.bio ?? "")
                  .split(/\n\n+/)
                  .filter(Boolean)
                  .map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
              </div>

              {active.languages && active.languages.length > 0 && (
                <LanguageChips languages={active.languages} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
