import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

type Variant = "primary" | "outline" | "outlineLight";
type Trail = "none" | "arrow" | "calendar";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  trail?: Trail;
  className?: string;
}

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[13.5px] font-semibold transition-all duration-200 whitespace-nowrap";

const styles: Record<Variant, string> = {
  primary:
    "bg-brand-red text-white shadow-[0_8px_18px_-8px_rgba(201,31,26,0.55)] hover:bg-brand-redDark hover:-translate-y-0.5",
  outline:
    "border border-navy-800/15 bg-white text-navy-800 hover:border-navy-800/40 hover:-translate-y-0.5",
  outlineLight:
    "border border-white/30 bg-transparent text-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  trail = "none",
  className = "",
}: ButtonProps) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      className={`${base} ${styles[variant]} ${className}`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      {trail === "arrow" && (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      )}
      {trail === "calendar" && <CalendarDays className="h-4 w-4" />}
    </Link>
  );
}
