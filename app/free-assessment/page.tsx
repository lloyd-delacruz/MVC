import { Clock, ShieldCheck, UserCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ZohoAssessmentForm } from "@/components/forms/ZohoAssessmentForm";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return buildPageMetadata("free-assessment");
}

const promises = [
  { icon: UserCheck, title: "Reviewed by an RCIC", body: "A licensed consultant reads every assessment — not a bot." },
  { icon: Clock, title: "Reply within 1 business day", body: "We'll email you with your likely options and next steps." },
  { icon: ShieldCheck, title: "Free & confidential", body: "No obligation, and your details are never shared." },
];

export default function FreeAssessmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Free Assessment"
        title="Find out where you stand — at no cost."
        lede="Answer a few questions about your background and goals. A Regulated Canadian Immigration Consultant will review your profile and get back to you with your options."
      />

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
            {promises.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex gap-3 rounded-xl border border-brand-blue/20 bg-white p-5 shadow-card"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-brand-red text-brand-red">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="text-[14px] font-semibold text-navy-800">{title}</h2>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-10 max-w-4xl">
            <ZohoAssessmentForm />
          </div>
        </div>
      </section>
    </>
  );
}
