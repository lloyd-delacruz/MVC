import { MapleLeaf } from "@/components/ui/MapleLeaf";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
}

export function PageHero({
  eyebrow,
  title,
  lede,
  align = "center",
}: PageHeroProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <section className="relative overflow-hidden bg-navy-800 text-white">
      <MapleLeaf className="absolute -left-8 -top-10 h-40 w-40 rotate-12 text-white/[0.04]" />
      <MapleLeaf className="absolute -right-10 -bottom-12 h-48 w-48 -rotate-12 text-white/[0.04]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className={`container-x relative py-16 lg:py-20 ${alignment} max-w-3xl`}>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
            {eyebrow}
          </p>
        )}
        <h1 className="headline-serif mt-3 text-[40px] font-medium leading-[1.1] sm:text-[52px]">
          {title}
        </h1>
        {lede && (
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-300">
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
