interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
}: SectionHeadingProps) {
  const a = align === "center" ? "text-center mx-auto max-w-2xl" : "text-left";
  return (
    <div className={a}>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
          {eyebrow}
        </p>
      )}
      <h2 className="headline-serif mt-2 text-[30px] font-medium leading-tight text-navy-800 sm:text-[36px]">
        {title}
      </h2>
      {lede && (
        <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500">
          {lede}
        </p>
      )}
    </div>
  );
}
