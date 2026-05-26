import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { BottomCta } from "@/components/ui/BottomCta";
import { AccoladesGallery, type Accolade } from "@/components/sections/AccoladesGallery";
import { TeamGallery } from "@/components/sections/TeamGallery";
import { LanguageChips } from "@/components/ui/LanguageChips";
import { getAbout } from "@/lib/content/about";
import { getTeam } from "@/lib/content/team";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return buildPageMetadata("about");
}

const ACCOLADES: Accolade[] = [
  {
    id: "tbr-2021",
    src: "/accolades/tbr-2021.svg",
    alt: "Three Best Rated 2021 — Top 3 Immigration Consultants in Burnaby",
    title: "Three Best Rated® 2021",
    subtitle: "Top 3 Immigration Consultants in Burnaby",
    description:
      "Recognized by ThreeBestRated® in 2021 as one of the top three immigration consultants in Burnaby — selected via their 50-point inspection covering reputation, history, complaints, ratings, trust, satisfaction, and cost.",
    sourceUrl: "https://threebestrated.ca/immigration-consultants-in-burnaby-bc",
    sourceLabel: "ThreeBestRated.ca",
  },
  {
    id: "tbr-2022",
    src: "/accolades/tbr-2022.svg",
    alt: "Three Best Rated 2022 Award — Best Immigration Consultants in Burnaby",
    title: "Three Best Rated® 2022",
    subtitle: "Best Immigration Consultants in Burnaby",
    description:
      "Recognized again in 2022 — a second consecutive year on the ThreeBestRated® list of top immigration consultants in Burnaby. Selection is based on their 50-point inspection across reputation, history, ratings, and customer trust.",
    sourceUrl: "https://threebestrated.ca/immigration-consultants-in-burnaby-bc",
    sourceLabel: "ThreeBestRated.ca",
  },
  {
    id: "cicc",
    src: "/accolades/cicc.png",
    alt: "College of Immigration and Citizenship Consultants (CICC / CCIC)",
    title: "CICC / CCIC",
    subtitle: "College of Immigration and Citizenship Consultants",
    description:
      "The federal regulator that licenses and oversees Regulated Canadian Immigration Consultants (RCICs) in Canada. MVC's founder, Yaniv Babani (RCIC #R519412), is a member in good standing with the College.",
    sourceUrl: "https://college-ic.ca/",
    sourceLabel: "college-ic.ca",
  },
  {
    id: "tbr-2023",
    src: "/accolades/tbr-2023.png",
    alt: "Three Best Rated 2023 — Best Business of 2023, Excellence",
    title: "Best Business of 2023 — Excellence",
    subtitle: "ThreeBestRated® Excellence Award",
    description:
      "Awarded the 'Best Business of 2023 — Excellence' distinction by ThreeBestRated®, given to businesses recognized for consistent top-three performance and high customer satisfaction over multiple years.",
    sourceUrl: "https://threebestrated.ca/immigration-consultants-in-burnaby-bc",
    sourceLabel: "ThreeBestRated.ca",
  },
  {
    id: "tbr-2024",
    src: "/accolades/tbr-2024.jpg",
    alt: "Three Best Rated 2024 — Immigration Consultants in Burnaby",
    title: "Three Best Rated® 2024",
    subtitle: "Top 3 Immigration Consultants in Burnaby",
    description:
      "Recognized in 2024 as one of Burnaby's top three immigration consultants — the fourth consecutive year on the ThreeBestRated® list, reflecting sustained reputation, expertise, and client trust.",
    sourceUrl: "https://threebestrated.ca/immigration-consultants-in-burnaby-bc",
    sourceLabel: "ThreeBestRated.ca",
  },
];

export default async function AboutPage() {
  const [about, team] = await Promise.all([getAbout(), getTeam()]);
  const founder = team.find((m) => m.id === "yaniv");
  const teamRest = team.filter((m) => m.id !== "yaniv");

  return (
    <>
      <PageHero eyebrow={about.eyebrow} title={about.heading} lede={about.lede} />

      <section
        aria-label="Recognition and accreditation"
        className="border-b border-slate-100 bg-white py-12 lg:py-16"
      >
        <div className="container-x">
          <p className="text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Recognition &amp; accreditation
          </p>
          <AccoladesGallery accolades={ACCOLADES} />
          <p className="mt-7 text-center text-[12.5px] text-slate-400">
            Click any badge to learn more.
          </p>
        </div>
      </section>

      <section
        id="yaniv"
        aria-labelledby="founder-heading"
        className="scroll-mt-24 bg-white py-16 lg:py-24"
      >
        <div className="container-x grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-[24px] shadow-portrait">
              <Image
                src={about.imageUrl ?? "/team/yaniv.jpg"}
                alt={about.imageAlt ?? "Yaniv Babani, Founder & RCIC"}
                width={568}
                height={596}
                className="h-[460px] w-full object-cover object-[center_20%] sm:h-[520px]"
                priority
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
                    Founder &amp; RCIC #R519412
                  </div>
                  <p className="mt-1.5 text-[11.5px] italic leading-snug text-slate-200">
                    Your immigration goals, our priority.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
              Founder's story
            </p>
            <div id="founder-heading" className="prose-mvc mt-3">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{about.bodyMarkdown}</ReactMarkdown>
            </div>
            {founder?.languages && <LanguageChips languages={founder.languages} />}
          </div>
        </div>
      </section>

      <section
        id="team-bios"
        aria-labelledby="team-heading"
        className="scroll-mt-24 bg-cream-50 py-20 lg:py-28"
      >
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              The team
            </p>
            <h2
              id="team-heading"
              className="headline-serif mt-3 text-[34px] font-medium leading-[1.1] text-navy-800 sm:text-[44px]"
            >
              The people behind every case.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-slate-500 sm:text-[17px]">
              Yaniv works alongside a dedicated team that helps clients move through the
              immigration process with care, clarity, and attention to detail.
            </p>
          </div>

          <TeamGallery members={teamRest} />

          <p className="mt-10 text-center text-[12.5px] text-slate-400">
            Click any photo to read the full bio.
          </p>
        </div>
      </section>

      <BottomCta
        title="Your Canadian journey starts with a conversation."
        body="Book your free 15-minute assessment and let's explore your best pathway together."
        buttonText="Book Your Free Assessment"
        buttonHref="/contact"
      />
    </>
  );
}
