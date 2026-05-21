import { getTestimonialsForAdmin } from "@/lib/cms/repositories/testimonials";
import { TestimonialsAdmin } from "./ui";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const items = await getTestimonialsForAdmin();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">Testimonials</h1>
      <p className="mt-1 text-sm text-slate-500">Client success stories shown on the Success Stories page.</p>
      <div className="mt-6">
        <TestimonialsAdmin items={items} />
      </div>
    </div>
  );
}
