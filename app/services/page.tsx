import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  Heart,
  MapPin,
  ShieldCheck,
  Stamp,
  ChevronRight,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { PATHWAY_CATEGORIES } from "@/lib/pathway-taxonomy";
import { getServices } from "@/lib/content/services";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return buildPageMetadata("services");
}

const CATEGORY_ICONS: Record<string, typeof Stamp> = {
  "permanent-residence": Stamp,
  work: Briefcase,
  study: GraduationCap,
  visit: MapPin,
  family: Heart,
  citizenship: ShieldCheck,
  business: Building2,
};

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Assessment",
    body: "We learn about your background, goals, and timeline.",
  },
  {
    n: "02",
    title: "Eligibility & Strategy",
    body: "We review your options and recommend a realistic pathway.",
  },
  {
    n: "03",
    title: "Application & Filing",
    body: "We prepare, review, and submit a complete application.",
  },
  {
    n: "04",
    title: "Support After Submission",
    body: "We support you through updates, document requests, and next steps.",
  },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Find the right Canadian immigration pathway for your situation."
        lede="Whether you want to work, study, reunite with family, visit, or settle permanently in Canada, MVC helps you understand your options and choose the next step with confidence."
      />

      {/* Most requested */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              Start here
            </p>
            <h2 className="headline-serif mt-2 text-balance text-[28px] font-medium leading-tight text-navy-800 sm:text-[38px]">
              Most Requested Services
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600">
              Each service page includes key details, eligibility considerations,
              timelines, and how MVC can help.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-redBorder hover:shadow-cardHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
                    {s.imageUrl && (
                      <Image
                        src={s.imageUrl}
                        alt={s.imageAlt || s.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 290px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/55 via-navy-900/5 to-transparent" />
                    <h3 className="headline-serif absolute inset-x-0 bottom-0 p-4 text-[18px] font-semibold leading-tight text-white">
                      {s.title}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[13.5px] leading-relaxed text-slate-500">
                      {s.description}
                    </p>
                    <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-red">
                      Explore this pathway
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Browse by goal — all categories */}
      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              Browse by goal
            </p>
            <h2 className="headline-serif mt-2 text-[30px] font-medium leading-tight text-navy-800 sm:text-[38px]">
              What brings you to Canada?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              Choose the situation that best matches your goal. Each category leads
              to the pathways and services that may apply to you.
            </p>
          </div>

          {(() => {
            const [featured, ...rest] = PATHWAY_CATEGORIES;
            const FeaturedIcon = CATEGORY_ICONS[featured.id] ?? Stamp;
            return (
              <div className="mt-12 space-y-5">
                {/* Featured flagship category */}
                <Link
                  href={`/pathways/${featured.id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-brand-red/15 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-redBorder hover:shadow-cardHover"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px] bg-brand-red"
                  />
                  <div className="p-7 lg:p-9">
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                        Most clients start here
                      </span>
                      <span className="h-px flex-1 bg-brand-red/15" />
                    </div>
                    <div className="mt-5 flex items-start gap-4">
                      <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-brand-red/20 bg-brand-redSoft text-brand-red">
                        <FeaturedIcon className="h-7 w-7" strokeWidth={1.6} />
                      </span>
                      <div>
                        <h3 className="headline-serif text-[26px] font-semibold leading-tight text-navy-800 group-hover:text-brand-red sm:text-[30px]">
                          {featured.label}
                        </h3>
                        <p className="mt-3 text-[14.5px] leading-relaxed text-slate-600">
                          {featured.description}
                        </p>
                      </div>
                    </div>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-red">
                      Explore {featured.label.toLowerCase()}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>

                {/* Remaining six categories — perfect 3×2 grid */}
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.id] ?? Stamp;
                    return (
                      <li key={cat.id}>
                        <Link
                          href={`/pathways/${cat.id}`}
                          className="group flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-redBorder hover:shadow-cardHover"
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-brand-red/20 bg-brand-redSoft text-brand-red">
                              <Icon className="h-5 w-5" strokeWidth={1.7} />
                            </span>
                            <h3 className="headline-serif text-[19px] font-semibold leading-tight text-navy-800 group-hover:text-brand-red">
                              {cat.label}
                            </h3>
                          </div>
                          <p className="mt-4 text-[13.5px] leading-relaxed text-slate-500">
                            {cat.description}
                          </p>
                          <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-red">
                            View {cat.label}
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })()}

          <div className="mt-10 text-center">
            <Link
              href="/pathways"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-navy-800 hover:text-brand-red"
            >
              See every pathway in one list
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              How we work
            </p>
            <h2 className="headline-serif mt-2 text-[30px] font-medium leading-tight text-navy-800 sm:text-[38px]">
              How We Work
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              A clear process, from first question to next step. No matter which
              pathway applies to you, our process is designed to be practical,
              transparent, and easy to follow.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <li
                key={step.n}
                className="relative rounded-xl border border-slate-100 bg-cream-50/60 p-6"
              >
                <span className="headline-serif block text-[34px] font-medium leading-none text-brand-red">
                  {step.n}
                </span>
                <h3 className="mt-3 text-[16px] font-semibold text-navy-800">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Not sure callout */}
      <section className="bg-navy-800 py-14 text-white lg:py-16">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-[12.5px] font-semibold tracking-[0.04em] text-white/60">
                Not sure which pathway fits your situation?
              </p>
              <h2 className="headline-serif mt-2 text-[26px] font-medium leading-tight sm:text-[32px]">
                Answer a few quick questions and our team will point you toward the
                most relevant option.
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/75">
                If you&rsquo;re not sure which pathway fits, our short
                questionnaire matches you with the strongest option. No
                obligation, always free.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button href="/get-started" variant="primary" trail="arrow">
                Find my pathway
              </Button>
              <Button href="/contact" variant="outlineLight" trail="calendar">
                Book a free assessment
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
