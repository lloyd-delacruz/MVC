import { getHeroForAdmin } from "@/lib/cms/repositories/hero";
import { HeroForm } from "./form";

export const metadata = { title: "Hero" };

export default async function AdminHeroPage() {
  const initial = await getHeroForAdmin();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">Homepage hero</h1>
      <p className="mt-1 text-sm text-slate-500">The top section of the homepage.</p>
      <div className="mt-6">
        <HeroForm initial={initial} />
      </div>
    </div>
  );
}
