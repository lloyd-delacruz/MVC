import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { Services } from "@/components/sections/Services";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Team } from "@/components/sections/Team";
import { BottomCta } from "@/components/ui/BottomCta";
import { getServices } from "@/lib/cms/repositories/services";
import { getTeam } from "@/lib/cms/repositories/team";
import { getTrustBadges, getWhyChoose } from "@/lib/cms/repositories/homepage-extras";
import { getAbout } from "@/lib/cms/repositories/about";
import { buildPageMetadata } from "@/lib/cms/repositories/seo";

export function generateMetadata() {
  return buildPageMetadata("about");
}

export default async function AboutPage() {
  const [about, services, team, trustBadges, whyChoose] = await Promise.all([
    getAbout(),
    getServices(),
    getTeam(),
    getTrustBadges(),
    getWhyChoose(),
  ]);

  return (
    <>
      <PageHero eyebrow={about.eyebrow} title={about.heading} lede={about.lede} />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="relative">
            <div className="overflow-hidden rounded-[24px] bg-[#8a6f5d] shadow-portrait">
              <Image
                src={about.imageUrl ?? "/team/yaniv.png"}
                alt={about.imageAlt ?? "Yaniv Babani, Founder & RCIC"}
                width={568}
                height={596}
                className="h-[420px] w-full object-cover object-top"
              />
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-[260px]">
                <div className="rounded-xl bg-navy-800 px-4 py-3 text-white shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-semibold leading-tight">
                      Yaniv Babani
                    </span>
                    <BadgeCheck className="h-4 w-4 text-brand-red" />
                  </div>
                  <div className="mt-0.5 text-[10px] tracking-wide text-slate-300">
                    Founder &amp; RCIC (RCIC: #R519412)
                  </div>
                  <p className="mt-1.5 text-[11.5px] italic leading-snug text-slate-200">
                    Your immigration goals, our priority.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="prose-mvc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.bodyMarkdown}</ReactMarkdown>
          </div>
        </div>
      </section>

      <TrustBadges badges={trustBadges} />
      <Services items={services} />
      <WhyChoose items={whyChoose} />
      <Team members={team} />
      <BottomCta
        title="Your Canadian journey starts with a conversation."
        body="Book your free 15-minute assessment and let's explore your best pathway together."
        buttonText="Book Your Free Assessment"
        buttonHref="/contact"
      />
    </>
  );
}
