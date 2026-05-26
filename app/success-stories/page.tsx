import { Quote, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";
import { getTestimonials } from "@/lib/content/testimonials";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return buildPageMetadata("success-stories");
}

export default async function SuccessStoriesPage() {
  const stories = await getTestimonials();

  return (
    <>
      <PageHero
        eyebrow="Client Stories"
        title="Stories from our clients"
        lede="Real people, real outcomes. Every story here represents a family reunited, a career launched, a new life begun."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2">
            {stories.map((s) => (
              <article
                key={s.id}
                className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-redBorder hover:shadow-cardHover"
              >
                <Quote className="absolute right-6 top-6 h-7 w-7 text-brand-red/15" />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="headline-serif text-[24px] font-medium leading-tight text-navy-800">
                      {s.author}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {s.location} · {s.year}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="mt-4 inline-flex w-fit items-center rounded-full bg-brand-redSoft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-red">
                  {s.pathway}
                </span>

                <blockquote className="mt-5 border-l-2 border-brand-red pl-4 text-[14px] italic leading-relaxed text-slate-600">
                  &ldquo;{s.quote}&rdquo;
                </blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BottomCta
        title="Your story could be next."
        body="Book a free consultation and find out what's possible."
        buttonText="Book a Free Consultation"
        buttonHref="/contact"
      />
    </>
  );
}
