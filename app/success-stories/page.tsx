import { Quote, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";

export const metadata = {
  title: "Success Stories",
  description:
    "Real people, real outcomes. Every story here represents a family reunited, a career launched, a new life begun.",
};

const stories = [
  {
    name: "Aarav S.",
    country: "India",
    year: "2024",
    pathway: "Express Entry · PR",
    quote:
      "After two failed attempts applying on my own, this team helped me get my Express Entry PR in under 7 months. The guidance was clear, the communication was excellent.",
  },
  {
    name: "Maria & José R.",
    country: "Philippines",
    year: "2023",
    pathway: "Family Sponsorship",
    quote:
      "We were separated from our daughter for almost two years. The family sponsorship process felt impossible until we found this firm. They walked us through every step.",
  },
  {
    name: "Fatima A.",
    country: "Morocco",
    year: "2024",
    pathway: "Study Permit",
    quote:
      "I was nervous about my study permit being refused again. They reviewed my file, identified the issue immediately, and we had an approval within 10 weeks.",
  },
  {
    name: "Daniel K.",
    country: "South Korea",
    year: "2023",
    pathway: "BC PNP",
    quote:
      "The PNP process in BC felt overwhelming until we had a clear action plan. Nominated in 4 months, PR in hand less than a year later.",
  },
  {
    name: "Priya M.",
    country: "India",
    year: "2024",
    pathway: "Post-Graduate Work Permit",
    quote:
      "My PGWP application was refused once before I found this firm. They caught a document error I'd missed and we reapplied successfully.",
  },
  {
    name: "Amara T.",
    country: "Nigeria",
    year: "2023",
    pathway: "Family Sponsorship",
    quote:
      "I was sponsored by my husband but had no idea where to start. The team handled everything and kept us updated every week. Couldn't have done it without them.",
  },
  {
    name: "Carlos V.",
    country: "Mexico",
    year: "2024",
    pathway: "Closed Work Permit",
    quote:
      "My work permit application was refused twice. This team reviewed my case, found the issue, and got me approved on the third try. Now I'm on my way to PR.",
  },
  {
    name: "Yuki N.",
    country: "Japan",
    year: "2024",
    pathway: "Express Entry",
    quote:
      "Straightforward and honest. Told me exactly what my CRS score needed to reach, how to improve it, and we got the ITA 3 months later.",
  },
];

export default function SuccessStoriesPage() {
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
                key={s.name + s.year}
                className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-redBorder hover:shadow-cardHover"
              >
                <Quote className="absolute right-6 top-6 h-7 w-7 text-brand-red/15" />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="headline-serif text-[24px] font-medium leading-tight text-navy-800">
                      {s.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {s.country} · {s.year}
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
