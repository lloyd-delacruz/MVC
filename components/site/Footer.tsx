import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Globe, Phone, Mail, MapPin } from "lucide-react";
import type { ComponentType } from "react";
import { Logo } from "@/components/ui/Logo";
import { getContact } from "@/lib/cms/repositories/contact";

const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
};

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Why Canada", href: "/why-canada" },
  { label: "Get Started", href: "/get-started" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const serviceLinks: { label: string; href: string }[] = [
  { label: "Express Entry", href: "/pathways/permanent-residence/express-entry" },
  { label: "Family Sponsorship", href: "/pathways/family/family-sponsorship" },
  { label: "Study Permits", href: "/pathways/study/study-permits" },
  { label: "Work Permits", href: "/pathways/work/work-permits" },
  { label: "Visitor Visas", href: "/pathways/visit/visitor-visas" },
  { label: "Provincial Nominee", href: "/pathways/permanent-residence/provincial-nominee" },
];

export async function Footer() {
  const contact = await getContact();

  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
            Canadian immigration guidance you can trust.
          </p>
          <div className="mt-6 flex gap-3">
            {contact.socialLinks.map((s) => {
              const Icon = socialIcons[s.platform] ?? Globe;
              return (
                <Link
                  key={s.id}
                  href={s.url}
                  aria-label={s.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-all hover:border-brand-red hover:bg-brand-red hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Services
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {serviceLinks.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contact Us
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="hover:text-white">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <span>{contact.addressLine}</span>
            </li>
            <li className="text-slate-400">Serving clients worldwide</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} My Visa For Canada Immigration
            Firm. All rights reserved.
          </p>
          <p>RCIC #R519412</p>
        </div>
      </div>
    </footer>
  );
}
