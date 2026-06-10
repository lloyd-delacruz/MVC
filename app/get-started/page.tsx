import {
  CheckCircle2,
  FileText,
  Globe2,
  Languages,
  GraduationCap,
  Briefcase,
  Wallet,
  Stethoscope,
  ScrollText,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BottomCta } from "@/components/ui/BottomCta";
import { Button } from "@/components/ui/Button";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return buildPageMetadata("get-started");
}

const trustStats = [
  { number: "500+", label: "Cases approved" },
  { number: "13+", label: "Years guiding clients" },
  { number: "CICC", label: "Registered RCIC" },
];

const steps = [
  {
    num: "01",
    title: "Book your free consultation",
    body: "A 15-minute call with a Regulated Canadian Immigration Consultant. No obligation, no sales pressure. We listen to your goals, ask about your situation, and give you our honest read on whether — and how — we can help.",
    you_do: "Book a time. Tell us a little about your situation in the booking form so we can prepare.",
    we_do: "Review your situation in advance. Walk you through the relevant pathways. Answer every question.",
  },
  {
    num: "02",
    title: "Eligibility assessment & pathway selection",
    body: "A formal RCIC review of your case. You receive a written recommendation outlining your strongest pathway, alternative options, realistic timelines, and what each will cost. This is where uncertainty ends and your plan begins.",
    you_do: "Provide documents we ask for — passport scans, prior visa records, education credentials, work history.",
    we_do: "Score your case against IRCC eligibility rules. Deliver a written pathway recommendation.",
  },
  {
    num: "03",
    title: "Document preparation",
    body: "A checklist tailored to your pathway. We review every document before submission — language tests, Educational Credential Assessment (ECA), employment letters, civil documents, police certificates. Quality of evidence is the single biggest predictor of approval.",
    you_do: "Take your IELTS / CELPIP / TEF. Gather employment letters, references, and civil documents.",
    we_do: "Review every document. Fix wording in employment letters. Catch issues before IRCC sees them.",
  },
  {
    num: "04",
    title: "Application submission & monitoring",
    body: "We file with IRCC on your behalf and track every status change. If IRCC requests additional documents or sends a procedural fairness letter, we draft the response. You'll always know where your file stands — no guessing, no portal anxiety.",
    you_do: "Stay reachable. Respond promptly when we need a signature, biometrics, or a medical exam.",
    we_do: "Submit through the official IRCC portal. Track status. Respond to every IRCC request on your behalf.",
  },
  {
    num: "05",
    title: "Decision & landing support",
    body: "Approval letter in hand — now what? We walk you through PR landing or visa activation, and connect you with settlement resources: bank accounts, healthcare enrolment, SIN application, school registration. The work doesn't end at approval. The work ends when you're settled.",
    you_do: "Travel to Canada. Activate your status. Bring the documents we list for landing.",
    we_do: "Prepare your landing checklist. Stay reachable for questions during your first months in Canada.",
  },
];

const checklist = [
  {
    icon: ScrollText,
    title: "Valid passport",
    description: "Not expiring within 6 months of intended travel.",
  },
  {
    icon: Languages,
    title: "Language test results",
    description:
      "IELTS General, CELPIP, or TEF Canada — required for Express Entry and many other pathways.",
  },
  {
    icon: GraduationCap,
    title: "Educational Credential Assessment (ECA)",
    description:
      "Required if your degree is from outside Canada. We help you choose the right designated organization.",
  },
  {
    icon: Briefcase,
    title: "Employment reference letters",
    description:
      "Showing job duties, dates of employment, salary, and hours per week — not just titles.",
  },
  {
    icon: FileText,
    title: "Civil documents",
    description:
      "Birth, marriage, and police certificates from every country lived in for 6+ months since age 18.",
  },
  {
    icon: Wallet,
    title: "Proof of settlement funds",
    description:
      "Bank statements showing the funds required for your family size (CAD $13,757+ for a single applicant).",
  },
  {
    icon: Stethoscope,
    title: "Medical exam",
    description:
      "Done by a panel physician approved by IRCC. Only required when IRCC asks — usually after invitation.",
  },
];

export default function GetStartedPage() {
  return (
    <>
      <PageHero
        eyebrow="RCIC · Regulated Canadian Immigration Consultant"
        title="Your path to a new life in Canada — guided with care."
        lede="Answer six quick questions and share where to send your match — our RCIC team replies within 1 business day. Always free."
      />

      {/* TRUST STATS */}
      <section className="border-b border-slate-100 bg-white py-10">
        <div className="container-x">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 text-center">
            {trustStats.map((s) => (
              <div key={s.label}>
                <div className="headline-serif text-[26px] font-medium text-navy-800 sm:text-[30px]">
                  {s.number}
                </div>
                <div className="mt-1 text-[11.5px] uppercase tracking-[0.14em] text-slate-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE RESULT CARD */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Pathway Finder · sample output"
            title="Six questions, then a real reply from an RCIC."
            lede="Built by a Regulated Canadian Immigration Consultant. When you submit, your answers go straight from your inbox to ours — no third-party trackers, no data brokers."
          />

          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-100 bg-cream-50 p-6 shadow-card sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              Your strongest pathway
            </p>
            <h3 className="headline-serif mt-2 text-[26px] font-medium leading-tight text-navy-800 sm:text-[30px]">
              Express Entry — Canadian Experience Class
            </h3>

            <h4 className="mt-6 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-navy-800">
              Why this fits you
            </h4>
            <ul className="mt-3 space-y-2.5 text-[14px] text-slate-600">
              {[
                "1+ year of skilled Canadian work experience (TEER 0–3)",
                "Strong English or French language scores",
                "Bachelor's degree or higher with an ECA on file",
                "Age range that scores favourably on the CRS grid",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#consultation" variant="primary" trail="calendar">
                Book a Free Consultation
              </Button>
              <Button href="#" variant="outline" trail="arrow">
                See full pathway details
              </Button>
            </div>

            <p className="mt-6 border-t border-slate-200 pt-4 text-[12px] leading-relaxed text-slate-500">
              <strong className="font-semibold text-navy-800">
                This is informational guidance — not a binding eligibility decision.
              </strong>{" "}
              Immigration cases are unique. Your free 15-minute consultation gives you an RCIC&rsquo;s formal opinion on your situation. We never guarantee immigration outcomes.
            </p>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-center text-[15px] italic leading-relaxed text-slate-500">
            Whatever pathway fits — <span className="text-navy-800">here&rsquo;s what working with us actually looks like,</span> from your first call to your landing in Canada.
          </p>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section id="process-title" className="bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="The Five-Step Process"
            title="No surprises. Just steps."
            lede="From your first call to your landing in Canada — what you do, what we do, every step of the way."
          />

          <ol className="mx-auto mt-12 max-w-4xl space-y-6">
            {steps.map((s) => (
              <li
                key={s.num}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-[14px] font-semibold text-white">
                      {s.num}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="headline-serif text-[20px] font-semibold leading-tight text-navy-800 sm:text-[22px]">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
                      {s.body}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-100 bg-cream-50 p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                          What you do
                        </div>
                        <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                          {s.you_do}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-navy-800 p-4 text-white">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                          What we do
                        </div>
                        <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
                          {s.we_do}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Start gathering these now"
            title="What you'll need (eventually)."
            lede="You don't need everything to book a consultation — but the more of these you have ready, the faster we can move."
          />

          <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
            {checklist.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-redBorder hover:shadow-cardHover"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-brand-red text-brand-red">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="headline-serif text-[15.5px] font-semibold leading-snug text-navy-800">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-xl text-center text-[13px] italic leading-relaxed text-slate-500">
            Don&rsquo;t worry about gathering everything at once — we walk through this list with you in step 3.
          </p>
        </div>
      </section>

      <BottomCta
        title="Ready to start your journey?"
        body="Book a free 15-minute consultation — no obligation."
        buttonText="Book a Free Consultation"
        buttonHref="/contact"
      />
    </>
  );
}
