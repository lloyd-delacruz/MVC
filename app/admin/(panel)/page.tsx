import Link from "next/link";

export const metadata = { title: "Dashboard" };

const modules = [
  { href: "/admin/hero", label: "Homepage Hero", desc: "Headline, intro, guarantees, founder card." },
  { href: "/admin/homepage", label: "Homepage Extras", desc: "Trust badges, why-choose, CTA banner." },
  { href: "/admin/about", label: "About Page", desc: "Heading, intro, and body copy." },
  { href: "/admin/services", label: "Services", desc: "The 'How We Can Help' cards." },
  { href: "/admin/team", label: "Team", desc: "Team member names, roles, photos." },
  { href: "/admin/testimonials", label: "Testimonials", desc: "Client success stories." },
  { href: "/admin/faqs", label: "FAQs", desc: "Questions and answers by category." },
  { href: "/admin/blog", label: "Blog", desc: "Posts, drafts, and publishing." },
  { href: "/admin/contact", label: "Contact Info", desc: "Offices, email, phone, social, booking." },
  { href: "/admin/seo", label: "SEO", desc: "Page titles, descriptions, social images." },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="headline-serif text-2xl font-medium text-navy-800">Content dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Choose a section to edit. Changes go live within a few seconds of saving.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
          >
            <div className="font-semibold text-navy-800">{m.label}</div>
            <div className="mt-1 text-sm text-slate-500">{m.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
