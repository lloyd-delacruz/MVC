import { notFound } from "next/navigation";
import { Check, MapPin, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BottomCta } from "@/components/ui/BottomCta";
import { Prose } from "@/components/ui/Prose";
import {
  getAllCategorySlugPairs,
  getPathway,
  categoryForSlug,
  type PathwayData,
  type QualifyGroup,
} from "@/lib/pathways";
import { renderBlock, renderInline } from "@/lib/markdown";

type Params = { category: string; slug: string };

export function generateStaticParams() {
  return getAllCategorySlugPairs();
}

export function generateMetadata({ params }: { params: Params }) {
  const p = getPathway(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
  };
}

export default function PathwayPage({ params }: { params: Params }) {
  if (categoryForSlug(params.slug) !== params.category) notFound();
  const data = getPathway(params.slug);
  if (!data) notFound();

  return (
    <>
      <PageHero
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        lede={data.hero.lede}
      />

      {data.latestUpdates && <LatestUpdatesBlock data={data} />}

      {data.pathwaysAfterGrad && (
        <PathwaysAfterGradBlock items={data.pathwaysAfterGrad.items} />
      )}

      {(data.overview || data.keyFacts) && (
        <section className="bg-white py-16 lg:py-20">
          <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            {data.overview && (
              <div>
                {data.overview.heading && (
                  <h2 className="headline-serif text-[28px] font-medium leading-tight text-navy-800 sm:text-[34px]">
                    {data.overview.heading}
                  </h2>
                )}
                {data.overview.content && (
                  <Prose className="mt-5">
                    {renderBlock(data.overview.content)}
                  </Prose>
                )}
              </div>
            )}
            {data.keyFacts && data.keyFacts.items.length > 0 && (
              <aside className="self-start rounded-xl border border-slate-100 bg-cream-50 p-6 shadow-card lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                  Key Facts
                </p>
                <h3 className="headline-serif mt-2 text-[20px] font-semibold leading-tight text-navy-800">
                  At a glance
                </h3>
                <dl className="mt-5 space-y-3 text-[13.5px] leading-relaxed">
                  {data.keyFacts.items.map((it, i) => {
                    const colon = it.indexOf(":");
                    const label = colon > -1 ? it.slice(0, colon).trim() : "";
                    const value = colon > -1 ? it.slice(colon + 1).trim() : it;
                    return (
                      <div
                        key={i}
                        className="flex flex-col gap-0.5 border-b border-slate-200/70 pb-3 last:border-0 last:pb-0"
                      >
                        {label && (
                          <dt className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {label}
                          </dt>
                        )}
                        <dd className="text-navy-800">
                          {renderInline(value)}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </aside>
            )}
          </div>
        </section>
      )}

      {data.inDemandIndustries && (
        <InDemandIndustriesBlock data={data.inDemandIndustries} />
      )}

      {data.threeStreams && <ThreeStreamsBlock data={data.threeStreams} />}

      {data.qualify && <QualifyBlock qualify={data.qualify} />}

      {data.how && <HowItWorksBlock how={data.how} />}

      {data.schoolsGrid && <SchoolsGridBlock data={data.schoolsGrid} />}

      {data.faq && <FaqBlock faq={data.faq} />}

      <BottomCta
        title={data.bottomCta?.heading ?? "Ready to start your journey?"}
        body={
          data.bottomCta?.content ??
          "Book a free 15-minute consultation and let’s explore your best pathway together."
        }
        buttonText="Book a Free Consultation"
        buttonHref="/contact"
      />
    </>
  );
}

// ---------- Sub-blocks ----------

function LatestUpdatesBlock({ data }: { data: PathwayData }) {
  const u = data.latestUpdates!;
  return (
    <section className="border-b border-slate-100 bg-cream-50 py-12 lg:py-16">
      <div className="container-x">
        <div className="max-w-2xl">
          {u.eyebrow && (
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              <Sparkles className="h-3.5 w-3.5" />
              {u.eyebrow}
            </p>
          )}
          {u.heading && (
            <h2 className="headline-serif mt-2 text-[26px] font-medium leading-tight text-navy-800 sm:text-[30px]">
              {u.heading}
            </h2>
          )}
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {u.items.map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-100 bg-white p-5 text-[13.5px] leading-relaxed text-slate-600 shadow-card"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PathwaysAfterGradBlock({ items }: { items: string[] }) {
  return (
    <section className="border-b border-slate-100 bg-white py-8">
      <div className="container-x flex flex-wrap items-center justify-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Pathways After Graduation:
        </span>
        {items.map((it) => (
          <span
            key={it}
            className="rounded-full border border-brand-redBorder bg-brand-redSoft px-3.5 py-1 text-[12px] font-medium text-brand-red"
          >
            {it}
          </span>
        ))}
      </div>
    </section>
  );
}

function InDemandIndustriesBlock({
  data,
}: {
  data: NonNullable<PathwayData["inDemandIndustries"]>;
}) {
  return (
    <section className="bg-cream-50 py-16 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={data.eyebrow}
          title={data.heading ?? "In-demand industries"}
          lede={data.lede}
        />
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5">
          {data.items.map((it) => (
            <li
              key={it}
              className="rounded-md border border-slate-100 bg-white px-4 py-2 text-[13px] font-medium text-navy-800 shadow-card"
            >
              {it}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ThreeStreamsBlock({
  data,
}: {
  data: NonNullable<PathwayData["threeStreams"]>;
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={data.eyebrow}
          title={data.heading ?? "Choose your route"}
          lede={data.lede}
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {data.streams.map((s) => (
            <div
              key={s.title}
              className="flex flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-card"
            >
              {s.tag && (
                <span className="inline-flex w-fit rounded-full border border-brand-redBorder bg-brand-redSoft px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-red">
                  {s.tag}
                </span>
              )}
              <h3 className="headline-serif mt-4 text-[22px] font-semibold leading-tight text-navy-800">
                {s.title}
              </h3>
              {s.description && (
                <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">
                  {renderInline(s.description)}
                </p>
              )}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                  {s.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-600"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-red"
                        strokeWidth={2.5}
                      />
                      <span>{renderInline(b)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QualifyBlock({
  qualify,
}: {
  qualify: NonNullable<PathwayData["qualify"]>;
}) {
  return (
    <section className="bg-cream-50 py-16 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={qualify.eyebrow ?? "Eligibility"}
          title={qualify.heading ?? "Do you qualify?"}
          lede={qualify.lede}
        />
        <div className="mx-auto mt-10 max-w-3xl">
          {qualify.content && (
            <Prose className="text-center">
              {renderBlock(qualify.content)}
            </Prose>
          )}

          {qualify.items && qualify.items.length > 0 && (
            <ul className="mt-8 space-y-3 rounded-xl border border-slate-100 bg-white p-6 shadow-card">
              {qualify.items.map((it, i) => (
                <QualifyItem key={i} text={it} />
              ))}
            </ul>
          )}

          {qualify.groups && qualify.groups.length > 0 && (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {qualify.groups.map((g, gi) => (
                <QualifyGroupCard key={gi} group={g} />
              ))}
            </div>
          )}

          {qualify.note && (
            <div className="mt-8 rounded-xl border-l-4 border-brand-red bg-white px-5 py-4 text-[13.5px] leading-relaxed text-slate-600 shadow-card">
              {renderInline(qualify.note)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function QualifyItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-[14px] leading-relaxed text-slate-700">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-redSoft text-brand-red">
        <Check className="h-3.5 w-3.5" strokeWidth={2.8} />
      </span>
      <span>{renderInline(text)}</span>
    </li>
  );
}

function QualifyGroupCard({ group }: { group: QualifyGroup }) {
  const heading = group.title ?? group.heading;
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
      {heading && (
        <h3 className="headline-serif text-[18px] font-semibold leading-tight text-navy-800">
          {heading}
        </h3>
      )}
      <ul className="mt-4 space-y-3">
        {group.items.map((it, i) => (
          <QualifyItem key={i} text={it} />
        ))}
      </ul>
    </div>
  );
}

function HowItWorksBlock({
  how,
}: {
  how: NonNullable<PathwayData["how"]>;
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={how.eyebrow ?? "The Process"}
          title={how.heading ?? "How it works"}
          lede={how.lede}
        />
        <ol className="mx-auto mt-12 max-w-3xl space-y-6">
          {how.steps.map((step, i) => (
            <li
              key={i}
              className="relative flex gap-5 rounded-xl border border-slate-100 bg-white p-6 shadow-card transition-shadow hover:shadow-cardHover"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red text-[15px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(201,31,26,0.55)]">
                {i + 1}
              </span>
              <div>
                <h3 className="headline-serif text-[18px] font-semibold leading-tight text-navy-800">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
                  {renderInline(step.description)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SchoolsGridBlock({
  data,
}: {
  data: NonNullable<PathwayData["schoolsGrid"]>;
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={data.eyebrow}
          title={data.heading ?? "Partner schools"}
          lede={data.lede}
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.schools.map((s) => (
            <li
              key={s.name}
              className="flex flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-card"
            >
              <h3 className="headline-serif text-[18px] font-semibold leading-tight text-navy-800">
                {s.name}
              </h3>
              {s.location && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-brand-red" />
                  {s.location}
                </p>
              )}
              {s.province && (
                <span className="mt-4 w-fit rounded-full border border-slate-200 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {s.province}
                </span>
              )}
            </li>
          ))}
        </ul>
        {data.note && (
          <p className="mx-auto mt-8 max-w-2xl text-center text-[13.5px] leading-relaxed text-slate-600">
            {renderInline(data.note)}
          </p>
        )}
      </div>
    </section>
  );
}

function FaqBlock({ faq }: { faq: NonNullable<PathwayData["faq"]> }) {
  return (
    <section className="bg-cream-50 py-16 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={faq.eyebrow ?? "Frequently Asked"}
          title={faq.heading ?? "FAQs"}
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faq.items.map((q, i) => (
            <details
              key={i}
              className="group rounded-xl border border-slate-100 bg-white p-5 shadow-card open:shadow-cardHover"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold text-navy-800">
                <span>{q.question}</span>
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform group-open:rotate-45 group-open:border-brand-red group-open:text-brand-red"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 text-[14px] leading-relaxed text-slate-600">
                {renderBlock(q.answer)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
