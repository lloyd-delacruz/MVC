import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { Services } from "@/components/sections/Services";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Team } from "@/components/sections/Team";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getHero } from "@/lib/cms/repositories/hero";
import { getServices } from "@/lib/cms/repositories/services";

export default async function HomePage() {
  const [hero, services] = await Promise.all([getHero(), getServices()]);

  return (
    <>
      <Hero content={hero} />
      <TrustBadges />
      <Services items={services} />
      <WhyChoose />
      <Team />
      <CtaBanner />
    </>
  );
}
