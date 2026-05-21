import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";
import { getFaqs } from "@/lib/cms/repositories/faqs";
import { FAQ_CATEGORIES } from "@/lib/cms/faq-categories";
import { buildPageMetadata } from "@/lib/cms/repositories/seo";

export function generateMetadata() {
  return buildPageMetadata("faq");
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        lede="Clear answers to the questions we hear most often."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl space-y-12">
            {FAQ_CATEGORIES.map((cat) => {
              const catItems = faqs.filter((i) => i.category === cat.key);
              if (catItems.length === 0) return null;
              return (
                <div key={cat.key} id={cat.key}>
                  <div className="flex items-baseline gap-3 border-b border-slate-100 pb-3">
                    <h2 className="headline-serif text-[22px] font-medium leading-tight text-navy-800 sm:text-[26px]">
                      {cat.label}
                    </h2>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {catItems.length} question{catItems.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-card">
                    {catItems.map((item) => (
                      <details
                        key={item.id}
                        className="group p-5 [&_summary::-webkit-details-marker]:hidden sm:p-6"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                          <h3 className="text-[15px] font-semibold leading-snug text-navy-800">
                            {item.question}
                          </h3>
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all group-open:rotate-180 group-open:border-brand-red group-open:bg-brand-redSoft group-open:text-brand-red">
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </summary>
                        <p className="mt-4 pr-12 text-[14px] leading-relaxed text-slate-600">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BottomCta
        title="Still have questions?"
        body="Book a free 30-minute consultation."
        buttonText="Book a Free Consultation"
        buttonHref="/contact"
      />
    </>
  );
}
