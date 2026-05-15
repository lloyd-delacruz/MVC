import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/blog";
import { BottomCta } from "@/components/ui/BottomCta";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.dek,
  };
}

function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Strip the leading "# Body" placeholder heading that the source files use.
function cleanBody(body: string): string {
  return body.replace(/^\s*#\s+Body\s*\n+/i, "");
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const body = cleanBody(post.body);

  return (
    <>
      {/* Article hero */}
      <section className="bg-white pt-12 pb-8 lg:pt-16 lg:pb-10">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 transition-colors hover:text-brand-red"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All articles
            </Link>

            <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              Insights
            </p>

            <h1 className="headline-serif mt-3 text-[34px] font-medium leading-[1.1] text-navy-800 sm:text-[44px] lg:text-[52px]">
              {post.title}
            </h1>

            {post.dek && (
              <p className="mt-5 text-[17px] leading-relaxed text-slate-500 sm:text-[18px]">
                {post.dek}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-200 pt-5 text-[12.5px] text-slate-500">
              <span className="font-medium text-navy-800">{post.author}</span>
              {post.date && (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </>
              )}
              {post.readTime && (
                <>
                  <span aria-hidden>·</span>
                  <span>{post.readTime}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white pb-16 lg:pb-24">
        <div className="container-x">
          <article className="prose-mvc mx-auto max-w-2xl text-[16px] leading-[1.78] text-slate-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </article>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-slate-100 bg-white py-16 lg:py-20">
          <div className="container-x">
            <div className="mx-auto mb-10 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                Keep reading
              </p>
              <h2 className="headline-serif mt-3 text-[28px] font-medium leading-tight text-navy-800 sm:text-[32px]">
                Related articles
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-800/30 hover:shadow-cardHover"
                >
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                    Insights
                  </p>
                  <h3 className="headline-serif mt-3 text-[20px] font-medium leading-snug text-navy-800">
                    {p.title}
                  </h3>
                  {p.dek && (
                    <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-slate-500">
                      {p.dek}
                    </p>
                  )}
                  <div className="mt-5 flex items-center justify-between text-[12px] text-slate-500">
                    <span>{p.readTime}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-red">
                      Read
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <BottomCta />
    </>
  );
}
