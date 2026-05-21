import { getAllSeoForAdmin } from "@/lib/cms/repositories/seo";
import { SeoAdmin } from "./ui";

export const metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  const entries = await getAllSeoForAdmin();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">SEO metadata</h1>
      <p className="mt-1 text-sm text-slate-500">
        Page titles, descriptions, and social share images. Blog-post SEO is edited on each post.
      </p>
      <div className="mt-6">
        <SeoAdmin entries={entries} />
      </div>
    </div>
  );
}
