import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { LeadConversion } from "@/components/analytics/LeadConversion";

/**
 * Landing page after a successful enquiry. Point the Zoho assessment form's
 * "redirect after submission" setting to https://mvcimmigration.com/thank-you
 * so GA4 records a `generate_lead` conversion. Not indexed, not in the sitemap.
 */
export function generateMetadata() {
  return buildMetadata("/thank-you", {
    title: "Thank you | MVC Immigration",
    description: "Thanks for contacting MVC Immigration Consulting.",
    noindex: true,
  });
}

export default function ThankYouPage() {
  return (
    <>
      <LeadConversion />
      <PageHero
        eyebrow="Thank you"
        title="We’ve received your details."
        lede="A Regulated Canadian Immigration Consultant will review your information and reply by email, usually within one business day."
      />
      <section className="bg-white py-16 text-center lg:py-20">
        <div className="container-x">
          <p className="mx-auto max-w-xl text-[14.5px] leading-relaxed text-slate-500">
            While you wait, you can read about the{" "}
            <Link href="/pathways" className="text-brand-red underline underline-offset-4 hover:text-brand-redDark">
              immigration pathways
            </Link>{" "}
            we handle or browse our{" "}
            <Link href="/blog" className="text-brand-red underline underline-offset-4 hover:text-brand-redDark">
              latest guides
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
