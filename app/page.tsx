import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { Services } from "@/components/sections/Services";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Team } from "@/components/sections/Team";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getHero } from "@/lib/cms/repositories/hero";

export default async function HomePage() {
  const hero = await getHero();

  return (
    <>
      <Hero content={hero} />
      <TrustBadges />
      <Services />
      <WhyChoose />
      <Team />
      <CtaBanner />
    </>
  );
}
