import { getFaqsForAdmin } from "@/lib/cms/repositories/faqs";
import { FaqsAdmin } from "./ui";

export const metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  const items = await getFaqsForAdmin();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">FAQs</h1>
      <p className="mt-1 text-sm text-slate-500">Questions and answers, grouped by category on the FAQ page.</p>
      <div className="mt-6">
        <FaqsAdmin items={items} />
      </div>
    </div>
  );
}
