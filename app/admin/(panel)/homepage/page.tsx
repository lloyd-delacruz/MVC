import {
  getTrustBadgesForAdmin,
  getWhyChooseForAdmin,
  getCtaBannerForAdmin,
} from "@/lib/cms/repositories/homepage-extras";
import { HomepageExtrasAdmin } from "./ui";

export const metadata = { title: "Homepage Extras" };

export default async function AdminHomepageExtrasPage() {
  const [trustBadges, whyChoose, cta] = await Promise.all([
    getTrustBadgesForAdmin(),
    getWhyChooseForAdmin(),
    getCtaBannerForAdmin(),
  ]);

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">Homepage extras</h1>
      <p className="mt-1 text-sm text-slate-500">
        Trust badges, the &ldquo;Why clients choose MVC&rdquo; reasons, and the closing CTA banner.
      </p>
      <div className="mt-6">
        <HomepageExtrasAdmin trustBadges={trustBadges} whyChoose={whyChoose} cta={cta} />
      </div>
    </div>
  );
}
