import Image from "next/image";
import { Check, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MapleLeaf } from "@/components/ui/MapleLeaf";
import type { HeroContent } from "@/lib/cms/types";

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
            <MapleLeaf className="ml-1 inline-block h-4 w-4 align-baseline text-brand-red sm:h-5 sm:w-5" />
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
          <div className="relative overflow-hidden rounded-[24px] bg-[#8a6f5d] shadow-portrait">
            <Image
              src={content.imageUrl}
              alt={content.imageAlt}
              width={568}
              height={596}
              className="h-[420px] w-full object-cover object-top sm:h-[460px]"
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
        </div>
      </div>
    </section>
  );
}
