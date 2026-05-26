import Image from "next/image";
import {
  Heart,
  GraduationCap,
  Shield,
  Briefcase,
  Users,
  Globe2,
  Trees,
  Scale,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BottomCta } from "@/components/ui/BottomCta";
import { buildPageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return buildPageMetadata("why-canada");
}

const stats = [
  {
    num: "485,000",
    label: "Permanent residents welcomed in 2024",
    source: "Source: IRCC",
  },
  {
    num: "#3",
    label: "Best country in the world for quality of life",
    source: "U.S. News, 2024",
  },
  {
    num: "23%",
    label: "Of Canadians were born outside Canada",
    source: "Statistics Canada",
  },
  {
    num: "9%",
    label: "Of all the freshwater on Earth is right here",
    source: "Environment Canada",
  },
];

const matters = [
  {
    icon: Heart,
    image: "/why-canada/matter-healthcare.jpg",
    stat: "Free at the point of care",
    title: "Universal healthcare, since 1984.",
    body: "Canada's publicly funded healthcare system means you don't choose between a doctor's visit and your rent. Permanent residents are covered by their province's plan — no premiums, no copays for hospital visits, no surprise bills. Whether you're starting a family, raising kids, or aging gracefully, healthcare is one less thing to worry about.",
    list: [
      "Hospital and physician services covered for residents",
      "Prescription support for seniors and lower-income families",
      "Mental-health programs expanding province by province",
    ],
  },
  {
    icon: GraduationCap,
    image: "/why-canada/matter-education.jpg",
    stat: "K–12 public schooling, free.",
    title: "An education that opens doors.",
    body: "Canadian public schools are tuition-free for permanent residents and regularly rank among the world's best. Three of the top fifty universities globally are Canadian — and graduates of Canadian programs unlock a Post-Graduation Work Permit that's the envy of international students everywhere.",
    list: [
      "Tuition-free public K–12 for residents",
      "Three universities in the global top 50 (U of T, McGill, UBC)",
      "Post-graduation work permits up to 3 years",
    ],
  },
  {
    icon: Shield,
    image: "/why-canada/matter-safety.jpg",
    stat: "Among the world's safest countries.",
    title: "A place where everyday life is calm.",
    body: "The Global Peace Index consistently places Canada in the world's top fifteen safest countries. Strong institutions, low violent-crime rates, and a culture of mutual respect mean kids walk to school, neighbours wave hello, and emergency rooms aren't filled with the consequences of gun violence.",
    list: [
      "Top 15 globally on the Global Peace Index",
      "Strict firearm laws and low gun-related crime",
      "Trust in police and judiciary among the highest in the OECD",
    ],
  },
  {
    icon: Briefcase,
    image: "/why-canada/matter-jobs.jpg",
    stat: "A G7 economy hungry for talent.",
    title: "Where your skills travel with you.",
    body: "Canada is one of the few countries actively recruiting newcomers to fill a real labour gap. Tech corridors in Toronto, Vancouver, and Montreal are thriving. Healthcare, trades, transport, and engineering are short-staffed nationally — and credential-recognition programs are expanding province by province.",
    list: [
      "Express Entry processing in as little as 6 months",
      "Open work permits for spouses of skilled workers",
      "Federal minimum wage of $17.30/hour as of April 2024",
    ],
  },
  {
    icon: Users,
    image: "/why-canada/matter-family.jpg",
    stat: "Family is a federal priority.",
    title: "Reunite. Stay close. Build something together.",
    body: "Family-class sponsorship lets Canadian citizens and permanent residents bring spouses, children, parents, and grandparents to live with them permanently. Generous parental leave, the Canada Child Benefit, and affordable childcare in most provinces mean families don't just survive here — they grow.",
    list: [
      "Spousal sponsorship as fast as 12 months",
      "Up to 18 months of paid parental leave",
      "$10/day childcare rolling out nationally",
    ],
  },
  {
    icon: Globe2,
    image: "/why-canada/matter-multicultural.jpg",
    stat: "200+ origin countries represented.",
    title: "Multiculturalism — written into the constitution.",
    body: "Canada is the only country in the world with multiculturalism enshrined in law. Your culture, your language, your faith — they aren't things to set aside at the border. They're things your neighbours come to celebrate. From Diwali on Parliament Hill to Lunar New Year in Vancouver, this country shows up.",
    list: [
      "Officially bilingual (English & French)",
      "Most-spoken non-official languages: Mandarin, Punjabi, Spanish",
      "Charter of Rights protects against religious & ethnic discrimination",
    ],
  },
  {
    icon: Trees,
    image: "/why-canada/matter-nature.jpg",
    stat: "48 national parks. 4 oceans.",
    title: "A backyard the size of a continent.",
    body: "The world's longest coastline. Forty-eight national parks. Glaciers, fjords, prairies, boreal forest, and the second-largest country on Earth holding only 0.5% of the world's population. There is room here — to breathe, to wander, to find your edge of nowhere.",
    list: [
      "243,042 km of coastline — longest in the world",
      "9% of Earth's freshwater",
      "UNESCO World Heritage sites from coast to coast",
    ],
  },
  {
    icon: Scale,
    image: "/why-canada/matter-rights.jpg",
    stat: "Charter-protected rights for all.",
    title: "A democracy that takes rights seriously.",
    body: "The Canadian Charter of Rights and Freedoms protects expression, religion, mobility, and equality — for citizens and permanent residents alike. The Economist consistently ranks Canada a \"full democracy,\" ahead of every G7 peer. Press freedom, judicial independence, civil liberties: all top-tier.",
    list: [
      "Constitutional protection for religious & LGBTQ+ rights",
      "Press Freedom Index: top 20 globally",
      "Independent judiciary, accessible to all residents",
    ],
  },
];

const cities = [
  {
    name: "Toronto",
    eyebrow: "Ontario",
    image: "/why-canada/toronto.jpg",
    tag: "Canada's biggest stage.",
    facts: [
      "3.0M people, 200+ languages",
      "Country's largest finance & tech hub",
      "Most newcomer-supportive infrastructure",
    ],
  },
  {
    name: "Vancouver",
    eyebrow: "British Columbia",
    image: "/why-canada/vancouver.jpg",
    tag: "Where ocean meets mountain.",
    facts: [
      "Mildest winters of any major city",
      "Hollywood North — and a film economy",
      "Top 10 globally for liveability",
    ],
  },
  {
    name: "Montréal",
    eyebrow: "Québec",
    image: "/why-canada/montreal.jpg",
    tag: "Europe meets the New World.",
    facts: [
      "Bilingual, bohemian, beloved",
      "Rents 40% lower than Toronto",
      "Most festivals per capita in North America",
    ],
  },
  {
    name: "Calgary",
    eyebrow: "Alberta",
    image: "/why-canada/calgary.jpg",
    tag: "Big skies, bigger paycheques.",
    facts: [
      "Highest median household income in Canada",
      "No provincial sales tax",
      "Banff & the Rockies, 90 minutes away",
    ],
  },
  {
    name: "Ottawa",
    eyebrow: "Ontario",
    image: "/why-canada/ottawa.jpg",
    tag: "Canada's capital, quietly thriving.",
    facts: [
      "Lowest unemployment among major cities",
      "Highest concentration of public-sector jobs",
      "Bilingual, bike-friendly, family-first",
    ],
  },
  {
    name: "Halifax",
    eyebrow: "Nova Scotia",
    image: "/why-canada/halifax.jpg",
    tag: "Salt air and a tech boom.",
    facts: [
      "Atlantic Immigration Program hub",
      "Affordable rents, ocean views",
      "Friendliest city in Canada (Travel + Leisure)",
    ],
  },
];

const sites = [
  {
    name: "Banff & Lake Louise",
    region: "Alberta",
    image: "/why-canada/banff.jpg",
    blurb:
      "Turquoise glacier lakes, jagged Rocky Mountain peaks, and the most photographed national park in the country.",
  },
  {
    name: "Niagara Falls",
    region: "Ontario",
    image: "/why-canada/niagara.jpg",
    blurb:
      "Six million cubic feet of water tumbling over the edge every minute — louder, closer, and wetter than the photos suggest.",
  },
  {
    name: "CN Tower",
    region: "Toronto",
    image: "/why-canada/cn-tower.jpg",
    blurb:
      "553 metres of Toronto skyline, a glass floor for the brave, and the city's lighthouse for forty years.",
  },
  {
    name: "Old Québec",
    region: "Québec City",
    image: "/why-canada/old-quebec.jpg",
    blurb:
      "A UNESCO heritage town where French Canada feels four centuries old. Cobblestones, ramparts, and Château Frontenac.",
  },
  {
    name: "The Northern Lights",
    region: "Yellowknife & beyond",
    image: "/why-canada/northern-lights.jpg",
    blurb:
      "Green ribbons across a black sky — visible 240 nights a year above the 60th parallel. The kind of thing you remember.",
  },
  {
    name: "Stanley Park",
    region: "Vancouver",
    image: "/why-canada/stanley-park.jpg",
    blurb:
      "1,000 acres of seawall, totem poles, and old-growth cedar — right at the edge of downtown Vancouver.",
  },
];

const seasons = [
  {
    key: "spring",
    image: "/why-canada/spring.jpg",
    months: "March · April · May",
    title: "The thaw, and the optimism that comes with it.",
    body: "Snow melts into rivers, cherry blossoms blanket Vancouver and Toronto's High Park, and the country exhales. Sugar shacks open in Quebec. Hiking trails reopen in the Rockies. Birds you forgot about come back.",
    highlights: [
      "Cherry blossoms in Vancouver & Toronto",
      "Maple-syrup season in rural Québec",
      "Avg 8–18°C, longer days returning",
    ],
  },
  {
    key: "summer",
    image: "/why-canada/summer.jpg",
    months: "June · July · August",
    title: "The country lives outside.",
    body: "Long northern daylight stretches past 10pm. Patios in Montréal stay open until last call. Cottagers head to the lakes. Calgary Stampede, Toronto's Caribbean Carnival, and a million backyard BBQs happen at once. Canada in summer is a different country entirely.",
    highlights: [
      "Festival season nationwide",
      "Avg 18–28°C, sun until 10pm",
      "National parks at peak access",
    ],
  },
  {
    key: "fall",
    image: "/why-canada/fall.jpg",
    months: "September · October · November",
    title: "The reason maple is on the flag.",
    body: "For three weeks in October, the country turns red and gold. The Laurentians, the Niagara region, and Algonquin become the most photographed forests on earth. Thanksgiving's a weekend, not a day. Crisp mornings, warm cardigans — the most Canadian time to arrive.",
    highlights: [
      "Peak fall colours in October",
      "Canadian Thanksgiving, second Monday of October",
      "Avg 8–18°C, golden light",
    ],
  },
  {
    key: "winter",
    image: "/why-canada/winter.jpg",
    months: "December · January · February",
    title: "It's cold, yes. It's also the best part.",
    body: "Skiing in Whistler. Skating on the Rideau Canal. Northern lights from Yellowknife. Hot tubs after toboggan runs. Yes, you'll buy a real winter coat — and then you'll find out that minus twenty in dry Canadian air feels nothing like the cold you imagine.",
    highlights: [
      "World-class skiing & skating",
      "Northern lights season",
      "Avg −15 to 0°C — but bright, dry, blue-sky days",
    ],
  },
];

export default function WhyCanadaPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Canada · A country to call home"
        title="Canada is a place for belonging"
        lede="Universal healthcare. Tuition-free public schools. Safe streets, breathtaking nature, and a culture that genuinely makes room for everyone. Welcome to the country we get to call home."
      />

      {/* STATS REEL */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="By the numbers"
            title="A country built on arrival"
            lede="More than one in five people living in Canada today were born somewhere else. The numbers behind one of the world's most welcoming countries."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card"
              >
                <div className="headline-serif text-[36px] font-semibold leading-none text-brand-red sm:text-[40px]">
                  {s.num}
                </div>
                <div className="mt-3 text-[13px] leading-snug text-navy-800">
                  {s.label}
                </div>
                <div className="mt-2 text-[10.5px] uppercase tracking-[0.12em] text-slate-400">
                  {s.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MATTERS */}
      <section id="wc-explore" className="bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="An interactive guide"
            title="What matters most to you?"
            lede="Tap a card. We'll show you what Canada offers people who care about it most. There's no wrong answer — most newcomers care about all of these."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {matters.map(({ icon: Icon, image, stat, title, body, list }) => (
              <article
                key={title}
                className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-redBorder hover:shadow-cardHover sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 border-brand-red text-brand-red">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                      {stat}
                    </div>
                    <h3 className="headline-serif mt-1.5 text-[19px] font-semibold leading-tight text-navy-800 sm:text-[20px]">
                      {title}
                    </h3>
                  </div>
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-100 sm:h-20 sm:w-20">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-slate-600">
                  {body}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {list.map((l) => (
                    <li
                      key={l}
                      className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-500"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                      {l}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FACES OF CANADA — multicultural band */}
      <section className="relative overflow-hidden bg-navy-800">
        <div className="absolute inset-0">
          <Image
            src="/why-canada/multicultural-family.jpg"
            alt="A diverse community of newcomers and Canadians together"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/85 via-navy-800/70 to-navy-900/95" />
        </div>
        <div className="container-x relative py-20 text-center lg:py-28">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
            A country of arrivals
          </div>
          <h2 className="headline-serif mx-auto mt-3 max-w-3xl text-[32px] font-medium leading-tight text-white sm:text-[40px] lg:text-[46px]">
            Faces from everywhere. A home in common.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-200">
            Nearly one in four Canadians was born somewhere else. Diwali on Parliament Hill,
            Lunar New Year in Vancouver, Eid in Edmonton, Caribana in Toronto — this country
            doesn&rsquo;t ask you to leave your culture at the border. It asks you to bring it.
          </p>
        </div>
      </section>

      {/* CITIES */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Where will you land?"
            title="Six cities, six different lives."
            lede="There's no &lsquo;right&rsquo; Canadian city — there's the one that fits the life you want next."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <article
                key={c.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-cream-50 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-redBorder hover:shadow-cardHover"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                    {c.eyebrow}
                  </div>
                  <h3 className="headline-serif mt-2 text-[24px] font-medium leading-tight text-navy-800">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-[13.5px] italic leading-snug text-slate-500">
                    {c.tag}
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-slate-200 pt-4">
                    {c.facts.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SEASONS */}
      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="A year in Canada"
            title="Four seasons. Four entirely different countries."
            lede="Yes, the winters are real. So are the wildflower hikes in May, the dock-jump summers, and the maple-leaf Octobers that look photoshopped."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {seasons.map((s) => (
              <article
                key={s.key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cardHover"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                    {s.months}
                  </div>
                  <h3 className="headline-serif mt-2 text-[18px] font-semibold leading-tight text-navy-800">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-slate-500">
                    {s.body}
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                    {s.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 text-[12px] leading-snug text-slate-600"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ICONIC CANADA — tourist sites */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Iconic Canada"
            title="The places that earn the postcards."
            lede="From the turquoise lakes of the Rockies to the cobblestones of Old Québec — six places that have been pulling travellers here for generations."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((p) => (
              <article
                key={p.name}
                className="group relative overflow-hidden rounded-2xl shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cardHover"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/45 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                    {p.region}
                  </div>
                  <h3 className="headline-serif mt-1.5 text-[22px] font-semibold leading-tight text-white">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-snug text-slate-200/90">
                    {p.blurb}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BottomCta
        title="Your story belongs in Canada."
        body="We've helped families from over forty countries plant new roots here. Book a free consultation and we'll help you map yours, step by step."
        buttonText="Book a Free Consultation"
        buttonHref="/contact"
      />
    </>
  );
}
