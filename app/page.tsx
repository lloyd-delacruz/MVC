import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { Services } from "@/components/sections/Services";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Team } from "@/components/sections/Team";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getHero } from "@/lib/cms/repositories/hero";
import { getServices } from "@/lib/cms/repositories/services";
import { getTeam } from "@/lib/cms/repositories/team";
import {
  getTrustBadges,
  getWhyChoose,
  getCtaBanner,
} from "@/lib/cms/repositories/homepage-extras";

export default async function HomePage() {
  const [hero, services, team, trustBadges, whyChoose, cta] = await Promise.all([
    getHero(),
    getServices(),
    getTeam(),
    getTrustBadges(),
    getWhyChoose(),
    getCtaBanner(),
  ]);

  return (
    <>
      <Hero content={hero} />
      <TrustBadges badges={trustBadges} />
      <Services items={services} />
      <WhyChoose items={whyChoose} />
      <Team members={team} />
      <CtaBanner content={cta} />
    </>
  );
}
