"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import type { TeamMemberItem } from "@/lib/content/types";
import { LanguageChips } from "@/components/ui/LanguageChips";

export function Team({ members }: { members: TeamMemberItem[] }) {
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
    <section className="bg-white pb-14 pt-2 lg:pb-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="headline-serif text-[30px] font-medium text-navy-800 sm:text-[36px]">
            Meet the Team
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-slate-500 sm:text-[15px]">
            Behind MVC is a dedicated team helping clients move through the immigration process with care, clarity, and attention to detail.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => {
            const sharedClasses =
              "group flex items-center gap-3 rounded-lg p-1 -m-1 text-left transition-colors hover:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red";
            const inner = (
              <>
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-card transition-transform group-hover:-translate-y-0.5">
                  <Image
                    src={m.imageUrl}
                    alt={m.imageAlt || m.name}
                    width={140}
                    height={140}
                    className={`h-full w-full object-cover ${m.imagePosition ?? ""}`}
                  />
                </div>
                <div>
                  <div className="headline-serif text-[15px] font-semibold leading-tight text-navy-800 transition-colors group-hover:text-brand-red">
                    {m.name}
                  </div>
                  <div className="mt-0.5 text-[12px] font-medium text-brand-red">
                    {m.role}
                  </div>
                </div>
              </>
            );

            if (!m.bio) {
              return (
                <Link key={m.id} href={`/about#${m.id}`} className={sharedClasses}>
                  {inner}
                </Link>
              );
            }

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(m)}
                aria-label={`View ${m.name}'s bio`}
                className={sharedClasses}
              >
                {inner}
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/about#team-bios"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy-800 underline underline-offset-4 hover:text-brand-red"
          >
            Meet the full team
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-team-modal-name"
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
                id="home-team-modal-name"
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
    </section>
  );
}
