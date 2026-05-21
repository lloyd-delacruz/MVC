import { getAboutForAdmin } from "@/lib/cms/repositories/about";
import { AboutForm } from "./form";

export const metadata = { title: "About" };

export default async function AdminAboutPage() {
  const initial = await getAboutForAdmin();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">About page</h1>
      <p className="mt-1 text-sm text-slate-500">The hero and story copy on the About page.</p>
      <div className="mt-6">
        <AboutForm initial={initial} />
      </div>
    </div>
  );
}
