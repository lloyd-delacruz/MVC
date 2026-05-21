import { getContactForAdmin } from "@/lib/cms/repositories/contact";
import { ContactAdmin } from "./ui";

export const metadata = { title: "Contact" };

export default async function AdminContactPage() {
  const data = await getContactForAdmin();

  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">Contact information</h1>
      <p className="mt-1 text-sm text-slate-500">
        Footer details, contact-page blocks, booking options, and social links.
      </p>
      <div className="mt-6">
        <ContactAdmin data={data} />
      </div>
    </div>
  );
}
