import Image from "next/image";
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

export const metadata = {
  title: "About MVC Immigration",
  description:
    "Regulated Canadian Immigration Consultants in Vancouver. Personal review and real guidance for families, workers, students, and businesses.",
};

export default async function AboutPage() {
  const [services, team, trustBadges, whyChoose] = await Promise.all([
    getServices(),
    getTeam(),
    getTrustBadges(),
    getWhyChoose(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="About MVC"
        title="A small firm, doing this work the right way."
        lede="Licensed RCIC. Personal review. Real guidance for families, workers, students, and businesses — tailored to your goals."
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="relative">
            <div className="overflow-hidden rounded-[24px] bg-[#8a6f5d] shadow-portrait">
              <Image
                src="/team/yaniv.png"
                alt="Yaniv Babani, Founder & RCIC"
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

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              Our Story
            </p>
            <h2 className="headline-serif mt-3 text-[34px] font-medium leading-tight text-navy-800 sm:text-[40px]">
              We&rsquo;re a Vancouver firm built around honest immigration advice.
            </h2>
            <div className="prose-mvc mt-5">
              <p>
                MVC Immigration Firm is led by Yaniv Babani, a Regulated Canadian Immigration Consultant (RCIC #R519412) with over 12 years of experience guiding individuals, families, and businesses through Canada&rsquo;s immigration system.
              </p>
              <p>
                Our work is personal. Every case is reviewed by Yaniv directly. We don&rsquo;t hand files to junior staff or take shortcuts — we read your situation carefully, tell you what we see, and give you a real answer.
              </p>
              <p>
                We speak English, Spanish, Hebrew, Tagalog, Cebuano, and Bangla, and we serve clients in Vancouver and worldwide.
              </p>
            </div>
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
