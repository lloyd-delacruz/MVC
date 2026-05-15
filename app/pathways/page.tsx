import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";
import {
  PATHWAY_CATEGORIES,
  getAllPathways,
} from "@/lib/pathways";

export const metadata = {
  title: "Immigration Pathways",
  description:
    "Every Canadian immigration pathway we handle — Express Entry, PNP, work permits, study permits, family sponsorship, citizenship, and BC PNP entrepreneur streams.",
};

export default function PathwaysIndexPage() {
  const all = getAllPathways();
  const bySlug = new Map(all.map((p) => [p.slug, p]));

  // Determine ungrouped pathways and append them under "Other".
  const grouped = new Set(
    PATHWAY_CATEGORIES.flatMap((c) => c.pathways.map((p) => p.slug)),
  );
  const ungrouped = all.filter((p) => !grouped.has(p.slug));

  const categories: {
    id: string;
    label: string;
    description: string;
    pathways: { slug: string; title: string }[];
  }[] = ungrouped.length
    ? [
        ...PATHWAY_CATEGORIES,
        {
          id: "other",
          label: "Other",
          description: "Additional pathways.",
          pathways: ungrouped.map((p) => ({ slug: p.slug, title: p.title })),
        },
      ]
    : PATHWAY_CATEGORIES;

  return (
    <>
      <PageHero
        eyebrow="Immigration Pathways"
        title="Find the right path to Canada."
        lede="Whether you’re moving for work, study, family, or to start a business — every Canadian immigration pathway we handle, in one place."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x space-y-16">
          {categories.map((cat) => {
            const items = cat.pathways
              .map((pw) => bySlug.get(pw.slug))
              .filter((p): p is NonNullable<typeof p> => Boolean(p));
            if (!items.length) return null;
            return (
              <div key={cat.id}>
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                      {cat.label}
                    </p>
                    <h2 className="headline-serif mt-2 text-[28px] font-medium leading-tight text-navy-800 sm:text-[34px]">
                      {cat.description}
                    </h2>
                  </div>
                  {cat.id !== "other" && (
                    <Link
                      href={`/pathways/${cat.id}`}
                      className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-brand-red hover:text-brand-redDark"
                    >
                      View {cat.label}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/pathways/${cat.id}/${p.slug}`}
                        className="group flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-redBorder hover:shadow-cardHover"
                      >
                        <h3 className="headline-serif text-[20px] font-semibold leading-tight text-navy-800 group-hover:text-brand-red">
                          {p.title}
                        </h3>
                        <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-slate-500">
                          {p.description}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-red">
                          Learn more
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <BottomCta
        title="Not sure which pathway is right for you?"
        body="Book a free 15-minute consultation. We’ll review your situation and tell you the strongest path forward — honestly."
        buttonText="Book a Free Assessment"
        buttonHref="/contact"
      />
    </>
  );
}
