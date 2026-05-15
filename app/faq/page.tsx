import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Clear answers to the questions we hear most often.",
};

const categories = [
  { key: "general", label: "General" },
  { key: "express-entry", label: "Express Entry" },
  { key: "pnp", label: "PNP" },
  { key: "family", label: "Family" },
  { key: "work-study", label: "Work & Study" },
  { key: "process-fees", label: "Process & Fees" },
];

type FAQ = { category: string; q: string; a: string };

const items: FAQ[] = [
  {
    category: "general",
    q: "Do I need a consultant, or can I apply on my own?",
    a: "You can apply directly to IRCC without a consultant — the forms are public. But immigration law is complex, eligibility changes frequently, and a single mistake can mean refusals or delays. A regulated consultant helps you avoid costly errors and maximizes your chances of approval.",
  },
  {
    category: "general",
    q: "What's the difference between an RCIC and an immigration lawyer?",
    a: "Both are authorized to provide immigration advice in Canada. RCICs specialize exclusively in immigration and are regulated by the CICC. Immigration lawyers are regulated by provincial law societies. For most immigration applications, an RCIC is fully qualified and often more cost-effective.",
  },
  {
    category: "general",
    q: "Are you authorized to represent me before IRCC?",
    a: "Yes. As RCICs regulated by the CICC, we are authorized to prepare and submit immigration applications on your behalf and to communicate with IRCC for you.",
  },
  {
    category: "general",
    q: "What happens if my application is refused?",
    a: "We review the refusal letter carefully and assess the grounds. Depending on the pathway, options may include reapplying with a stronger file, filing a reconsideration request, or appealing to the Immigration Appeal Division. We'll explain every option honestly.",
  },
  {
    category: "express-entry",
    q: "What is a CRS score and how is it calculated?",
    a: "The Comprehensive Ranking System (CRS) assigns points based on age, education, language scores, work experience, and adaptability factors. The higher your score, the better your chances of receiving an Invitation to Apply (ITA) in a draw.",
  },
  {
    category: "express-entry",
    q: "How often does IRCC run Express Entry draws?",
    a: "IRCC runs draws roughly every two weeks, though frequency and cut-off scores vary. Some draws target all candidates; others are category-specific (e.g. healthcare workers, STEM). We monitor draw patterns and advise clients accordingly.",
  },
  {
    category: "express-entry",
    q: "Can I improve my CRS score?",
    a: "Often yes. Common strategies include retaking language tests, completing additional education, securing a provincial nomination, or obtaining a qualifying job offer. We assess your specific profile and identify the highest-impact improvements.",
  },
  {
    category: "pnp",
    q: "Which province is best for me?",
    a: "It depends on your occupation, language skills, work or study history in Canada, and where you're willing to settle. Some provinces have streams specifically for tech workers, healthcare, agriculture, or entrepreneurs. We match your profile to streams with the best chance of success.",
  },
  {
    category: "pnp",
    q: "Do I need a job offer for PNP?",
    a: "Not always. Many streams accept candidates without a job offer, particularly if you have relevant work experience or Canadian study credentials. Some streams do require a job offer — we'll clarify which apply to you.",
  },
  {
    category: "pnp",
    q: "Can PNP and Express Entry be combined?",
    a: "Yes — this is called the Enhanced Nomination. A provincial nomination through an aligned stream adds 600 CRS points, putting candidates well above any recent Express Entry cutoff.",
  },
  {
    category: "family",
    q: "Who can I sponsor to come to Canada?",
    a: "As a Canadian citizen or permanent resident, you can sponsor your spouse or common-law partner, dependent children, parents, and grandparents (subject to income requirements and intake caps).",
  },
  {
    category: "family",
    q: "What is an undertaking and how long does it last?",
    a: "An undertaking is a legal promise to financially support your sponsored family member and repay any social assistance they receive. For spouses and partners it lasts 3 years from PR; for parents and grandparents it lasts 20 years.",
  },
  {
    category: "family",
    q: "What if the relationship is questioned?",
    a: "IRCC may request additional documentation or an interview to verify the genuineness of the relationship. We help you build a strong evidentiary file from the start to minimize this risk.",
  },
  {
    category: "work-study",
    q: "What is an LMIA and do I need one?",
    a: "A Labour Market Impact Assessment (LMIA) is a document from Employment and Social Development Canada confirming that hiring a foreign worker won't negatively affect the Canadian labour market. Many work permits require one, but significant exemptions exist under CUSMA, IEC, and other agreements.",
  },
  {
    category: "work-study",
    q: "Can I work while studying in Canada?",
    a: "Most full-time students at designated learning institutions (DLIs) can work up to 20 hours per week during the academic session and full-time during scheduled breaks, without a separate work permit.",
  },
  {
    category: "work-study",
    q: "What is a PGWP and how do I qualify?",
    a: "A Post-Graduation Work Permit (PGWP) lets international graduates work in Canada for up to 3 years after completing a program of at least 8 months at an eligible DLI. It's one of the most direct pathways to Canadian PR for international students.",
  },
  {
    category: "process-fees",
    q: "Can you guarantee my application will be approved?",
    a: "No — and you should be cautious of anyone who claims otherwise. IRCC makes all final decisions. What we can guarantee is that your application will be thorough, accurate, and presented in the strongest possible way. Our track record reflects that commitment.",
  },
  {
    category: "process-fees",
    q: "How much do your services cost?",
    a: "Fees vary by pathway complexity and scope of service. We provide a clear, written quote after your free consultation — no hidden charges, no surprises. Government filing fees are separate and set by IRCC.",
  },
];

export default function FaqPage() {
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
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category === cat.key);
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
                        key={item.q}
                        className="group p-5 [&_summary::-webkit-details-marker]:hidden sm:p-6"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                          <h3 className="text-[15px] font-semibold leading-snug text-navy-800">
                            {item.q}
                          </h3>
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all group-open:rotate-180 group-open:border-brand-red group-open:bg-brand-redSoft group-open:text-brand-red">
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </summary>
                        <p className="mt-4 pr-12 text-[14px] leading-relaxed text-slate-600">
                          {item.a}
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
