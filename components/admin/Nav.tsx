"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/homepage", label: "Homepage Extras" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/seo", label: "SEO" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`block rounded-md px-3 py-2 text-sm transition ${
              active
                ? "bg-brand-red text-white"
                : "text-slate-200 hover:bg-navy-700 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
