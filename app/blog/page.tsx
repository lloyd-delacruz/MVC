import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";

export const metadata = {
  title: "Immigration Insights",
  description:
    "Plain-English guides, honest answers, and timely commentary on Canadian immigration — written by regulated consultants who actually work the files.",
};

const posts = [
  {
    slug: "top-3-immigration-mistakes",
    title: "The top three mistakes we see in Canadian immigration",
    dek: 'Delaying for the "right time," hiring unregulated agencies, and assuming Express Entry is the only way in. The three errors that cost applicants the most.',
    pill: "Process",
    date: "Apr 22, 2026",
    date_iso: "2026-04-22",
  },
  {
    slug: "when-hiring-a-consultant-pays-off",
    title: "When does hiring an immigration consultant actually pay off?",
    dek: "A regulated consultant's value isn't filling forms — it's reading your situation, anticipating refusals, and steering you to the program that actually fits.",
    pill: "Reflection",
    date: "Apr 1, 2026",
    date_iso: "2026-04-01",
  },
  {
    slug: "ielts-scores-matter",
    title: "Why your IELTS score matters more than you think",
    dek: "For applicants over 30, your IELTS score is often the single biggest lever you have. Here's how to read the bands and what to aim for.",
    pill: "Process",
    date: "Mar 11, 2026",
    date_iso: "2026-03-11",
  },
  {
    slug: "settlement-funds-explained",
    title: 'Settlement funds, explained: what "show money" actually means',
    dek: "Whether you're applying for a visitor visa, a study permit, or PR — Canada wants proof you can support yourself. Here's how to show it without panic.",
    pill: "Process",
    date: "Feb 18, 2026",
    date_iso: "2026-02-18",
  },
  {
    slug: "which-canadian-province-is-right",
    title: "Which Canadian province is right for you?",
    dek: "Ten provinces, three territories, and very different lives. A practical guide to choosing where to land — by city size, climate, and program eligibility.",
    pill: "Pathway Guide",
    date: "Jan 28, 2026",
    date_iso: "2026-01-28",
  },
  {
    slug: "am-i-too-old-to-immigrate",
    title: "Am I too old to immigrate to Canada?",
    dek: "It's the question we hear most often. The honest answer involves age points, eligibility math, and one rule that surprises almost everyone: don't delay.",
    pill: "Reflection",
    date: "Dec 17, 2025",
    date_iso: "2025-12-17",
  },
  {
    slug: "immigration-myths-busted",
    title: "Common Canadian immigration myths, busted",
    dek: '"Immigrants only get minimum-wage jobs." "Immigration is too expensive." "Newcomers are a drain on the economy." Three myths we hear weekly — and the truth.',
    pill: "Reflection",
    date: "Nov 24, 2025",
    date_iso: "2025-11-24",
  },
  {
    slug: "77-jobs-that-fast-track-pr",
    title: "77 in-demand jobs that fast-track your PR application",
    dek: 'British Columbia\'s PNP "priority occupations" list shaves months off processing times. Tech, healthcare, childcare, and the unexpected entries.',
    pill: "Pathway Guide",
    date: "Oct 30, 2025",
    date_iso: "2025-10-30",
  },
  {
    slug: "canadas-underrated-pathway",
    title: "Canada's most underrated immigration pathway, explained",
    dek: "Most people don't realize a Canadian study permit is one of the surest routes to PR. The numbers, the process, and why we recommend it for the right candidates.",
    pill: "Pathway Guide",
    date: "Sep 19, 2025",
    date_iso: "2025-09-19",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Immigration insights"
        lede="Plain-English guides, honest answers, and timely commentary on Canadian immigration — written by regulated consultants who actually work the files."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-redBorder hover:shadow-cardHover"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-brand-redSoft px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-red">
                    {p.pill}
                  </span>
                  <time
                    dateTime={p.date_iso}
                    className="flex items-center gap-1.5 text-[11.5px] text-slate-500"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {p.date}
                  </time>
                </div>

                <h2 className="headline-serif mt-5 text-[20px] font-medium leading-snug text-navy-800 transition-colors group-hover:text-brand-red sm:text-[22px]">
                  {p.title}
                </h2>

                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-slate-500">
                  {p.dek}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-red">
                  Read article
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BottomCta
        title="Got a specific question?"
        body="Book a free 30-minute consultation. We'll give you an honest read on your situation — no obligation."
        buttonText="Book a Free Consultation"
        buttonHref="/contact"
      />
    </>
  );
}
