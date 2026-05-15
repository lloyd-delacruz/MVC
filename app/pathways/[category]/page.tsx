import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";
import {
  PATHWAY_CATEGORIES,
  getPathway,
  type PathwayCategory,
} from "@/lib/pathways";

type Params = { category: string };

export function generateStaticParams() {
  return PATHWAY_CATEGORIES.map((c) => ({ category: c.id }));
}

export function generateMetadata({ params }: { params: Params }) {
  const cat = PATHWAY_CATEGORIES.find((c) => c.id === params.category);
  if (!cat) return {};
  return {
    title: cat.label,
    description: cat.description,
  };
}

export default function CategoryLandingPage({ params }: { params: Params }) {
  const cat = PATHWAY_CATEGORIES.find(
    (c) => c.id === (params.category as PathwayCategory),
  );
  if (!cat) notFound();

  const items = cat.pathways
    .map((p) => getPathway(p.slug))
    .filter((p): p is NonNullable<ReturnType<typeof getPathway>> => Boolean(p));

  return (
    <>
      <PageHero
        eyebrow="Immigration Pathways"
        title={cat.label}
        lede={cat.description}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <Link
            href="/pathways"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-brand-red"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All pathways
          </Link>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
