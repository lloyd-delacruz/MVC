import Image from "next/image";
import { Check, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MapleLeaf } from "@/components/ui/MapleLeaf";

const guarantees = [
  "RCIC Licensed & Regulated",
  "Proven Results",
  "Personalized, Honest Advice",
  "Multilingual Support",
];

export function Hero() {
  return (
    <section className="relative bg-white">
      <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <div className="animate-fadeUp">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-navy-800">
            Regulated Canadian Immigration Consultant
          </p>

          <h1 className="headline-serif mt-4 text-[44px] font-medium leading-[1.05] text-navy-800 sm:text-[52px] lg:text-[58px]">
            Canadian immigration
            <br />
            guidance you can{" "}
            <span className="relative inline-block">
              trust
              <MapleLeaf className="ml-1 inline-block h-5 w-5 align-baseline text-brand-red" />
            </span>
            .
          </h1>

          <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-slate-500">
            Licensed RCIC. Personal review. Real guidance for families, workers,
            students, and businesses—tailored to your goals.
          </p>

          <div className="mt-7 grid max-w-md grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {guarantees.map((item) => (
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

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#contact" variant="primary" trail="calendar">
              Book a Free Assessment
            </Button>
            <Button href="#services" variant="outline" trail="arrow">
              Explore Pathways
            </Button>
          </div>
        </div>

        <div className="relative animate-fadeUp [animation-delay:120ms]">
          <div className="relative overflow-hidden rounded-[24px] bg-[#8a6f5d] shadow-portrait">
            <Image
              src="/team/yaniv.png"
              alt="Yaniv Babani, Founder & RCIC at My Visa For Canada"
              width={568}
              height={596}
              className="h-[420px] w-full object-cover object-top sm:h-[460px]"
              priority
            />
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-[260px]">
              <div className="rounded-xl bg-navy-800 px-4 py-3 text-white shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold leading-tight">
                    Yaniv Babani
                  </span>
                  <BadgeCheck className="h-4 w-4 text-brand-red" />
                </div>
                <div className="mt-0.5 text-[10px] tracking-wide text-slate-300">
                  Founder &amp; RCIC (RCIC: #R519412)
                </div>
                <p className="mt-1.5 text-[11.5px] italic leading-snug text-slate-200">
                  Your immigration goals, our priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
