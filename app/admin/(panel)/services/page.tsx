import { getServicesForAdmin } from "@/lib/cms/repositories/services";
import { ServicesAdmin } from "./ui";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const items = await getServicesForAdmin();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">Services</h1>
      <p className="mt-1 text-sm text-slate-500">The &ldquo;How We Can Help&rdquo; cards on the homepage.</p>
      <div className="mt-6">
        <ServicesAdmin items={items} />
      </div>
    </div>
  );
}
