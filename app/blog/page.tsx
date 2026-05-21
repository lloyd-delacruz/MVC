import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";
import { getAllPosts } from "@/lib/cms/repositories/blog";
import { buildPageMetadata } from "@/lib/cms/repositories/seo";

export function generateMetadata() {
  return buildPageMetadata("blog");
}

function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function BlogPage() {
  const posts = await getAllPosts();

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
                    dateTime={p.date}
                    className="flex items-center gap-1.5 text-[11.5px] text-slate-500"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(p.date)}
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
