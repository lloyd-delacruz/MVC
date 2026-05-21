import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { Services } from "@/components/sections/Services";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Team } from "@/components/sections/Team";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getHero } from "@/lib/cms/repositories/hero";
import { getServices } from "@/lib/cms/repositories/services";
import { getTeam } from "@/lib/cms/repositories/team";

export default async function HomePage() {
  const [hero, services, team] = await Promise.all([getHero(), getServices(), getTeam()]);

  return (
    <>
      <Hero content={hero} />
      <TrustBadges />
      <Services items={services} />
      <WhyChoose />
      <Team members={team} />
      <CtaBanner />
    </>
  );
}
