import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Languages, CalendarDays, CreditCard } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BottomCta } from "@/components/ui/BottomCta";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Contact MVC Immigration",
  description:
    "Get in touch with MVC Immigration — send us a message, visit our offices, or book a 1:1 consultation with a Regulated Canadian Immigration Consultant.",
};

const pathwayOptions = [
  { value: "", label: "Select a pathway…" },
  { value: "express-entry", label: "Express Entry" },
  { value: "provincial-nominee", label: "Provincial Nominee Program" },
  { value: "family-sponsorship", label: "Family Sponsorship" },
  { value: "work-permit", label: "Work Permit" },
  { value: "study-permit", label: "Study Permit" },
  { value: "visitor-visa", label: "Visitor Visa" },
  { value: "not-sure", label: "Not sure yet" },
];

const contactDetails = [
  {
    icon: MapPin,
    label: "Canada Office",
    lines: [
      "Suite 900 – 2025 Willingdon Avenue",
      "Burnaby, BC V5C 0J3",
      "Canada",
      "+1 778 288 7388",
    ],
  },
  {
    icon: MapPin,
    label: "Philippines Office",
    lines: [
      "Unit 610B Oakridge IT Centre 2",
      "880 A.S. Fortuna St., Mandaue City",
      "Cebu 6014, Philippines",
      "+63 917 794 9960 (Mobile / WhatsApp)",
      "+63 939 922 4533 (Mobile)",
      "+63 32 253 0843 (Landline)",
    ],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["info@myvisa4canada.com"],
  },
  {
    icon: Clock,
    label: "Hours",
    lines: ["9:00am – 5:00pm", "By appointment only"],
  },
  {
    icon: Languages,
    label: "Languages",
    lines: ["English, Spanish, Filipino, Hebrew"],
  },
];

const bookingOptions = [
  {
    title: "MVC 1:1 Virtual Consultation",
    price: "$250 CAD",
    description:
      "Talk to a Regulated Canadian Immigration Consultant online (Zoom or Google Meet) and discuss your immigration plan or ask specific case-related questions. 60 minutes. Notes & next steps emailed afterwards.",
    href: "https://calendly.com/REPLACE-WITH-MVC-CALENDLY/virtual-consultation",
  },
  {
    title: "MVC 1:1 In-Office Consultation",
    price: "$350 CAD",
    description:
      "Meet your RCIC face-to-face at our Burnaby, BC office. Bring documents, ask every question, and leave with a written plan. 60 minutes. Free parking on site, transit-accessible.",
    href: "https://calendly.com/REPLACE-WITH-MVC-CALENDLY/in-office-consultation",
  },
];

const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-navy-800 placeholder:text-slate-400 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15";
const labelClass =
  "block text-[12.5px] font-semibold uppercase tracking-[0.12em] text-navy-800";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Let's talk about your situation"
        lede="The first step is a conversation — no paperwork, no commitment, no sales pitch."
      />

      <section id="main" className="bg-white py-16 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* FORM */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              Send us a message
            </p>
            <h2 className="headline-serif mt-2 text-[30px] font-medium leading-tight text-navy-800 sm:text-[34px]">
              Send us a message
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500">
              Tell us a little about your situation. We usually respond within 1 business day.
            </p>

            <form className="mt-8 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full Name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={`${inputClass} mt-2`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address <span className="text-brand-red">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={`${inputClass} mt-2`}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (___) ___-____"
                    className={`${inputClass} mt-2`}
                  />
                </div>
                <div>
                  <label htmlFor="country" className={labelClass}>
                    Country You&rsquo;re Applying From
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    className={`${inputClass} mt-2`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pathway" className={labelClass}>
                  Pathway You&rsquo;re Interested In
                </label>
                <select id="pathway" name="pathway" className={`${inputClass} mt-2`}>
                  {pathwayOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Briefly describe your situation, timeline, and any specific questions."
                  className={`${inputClass} mt-2 resize-y`}
                />
              </div>

              <p className="text-[12px] leading-relaxed text-slate-500">
                Your information is kept confidential and used only to respond to your inquiry.
                We do not share your data with third parties. See our{" "}
                <Link
                  href="/privacy"
                  className="text-brand-red underline underline-offset-4 hover:text-brand-redDark"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-brand-red px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(201,31,26,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-redDark"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* DETAILS */}
          <aside>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red">
              Reach us directly
            </p>
            <h2 className="headline-serif mt-2 text-[30px] font-medium leading-tight text-navy-800 sm:text-[34px]">
              Visit, call, or write
            </h2>

            <div className="mt-8 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-card">
              {contactDetails.map(({ icon: Icon, label, lines }) => (
                <div key={label} className="flex gap-4 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-cream-50 text-brand-red">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-navy-800">
                      {label}
                    </h3>
                    <div className="mt-1.5 space-y-0.5 text-[13.5px] leading-relaxed text-slate-600">
                      {lines.map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* BOOKING */}
      <section id="consultation" className="bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Book a 1:1 consultation"
            title="Schedule with your RCIC."
            lede="For specific case questions and a binding RCIC opinion, book a paid 1:1 consultation. Pick the format that fits your situation."
          />

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="text-[15px] font-semibold text-navy-800">
                  MVC Immigration Consulting
                </div>
                <div className="text-[12px] text-slate-500">
                  Regulated Canadian Immigration Consultants
                </div>
              </div>
              <CalendarDays className="h-5 w-5 text-brand-red" />
            </div>

            <p className="mt-5 text-[14px] leading-relaxed text-slate-600">
              Welcome — please pick the consultation type that fits your situation and we&rsquo;ll add it to your calendar.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {bookingOptions.map((o) => (
                <a
                  key={o.title}
                  href={o.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-redBorder hover:shadow-cardHover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="headline-serif text-[16px] font-semibold leading-tight text-navy-800">
                      {o.title}
                    </h4>
                    <span className="shrink-0 rounded-full bg-brand-redSoft px-2.5 py-1 text-[11px] font-semibold text-brand-red">
                      {o.price}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-slate-500">
                    {o.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-red">
                    Schedule now
                    <CalendarDays className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="text-[11.5px] text-slate-500">
                Secure scheduling &amp; payment via Calendly
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                <CreditCard className="h-3.5 w-3.5" />
                <span>VISA · MC · AMEX · DISCOVER</span>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] leading-relaxed text-slate-500">
            Not ready to book a paid session?{" "}
            <Link
              href="#main"
              className="text-brand-red underline underline-offset-4 hover:text-brand-redDark"
            >
              Send us a message
            </Link>{" "}
            for a free 30-minute discovery call — we&rsquo;ll tell you whether a 1:1 consultation is the right next step.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-center text-[11.5px] leading-relaxed text-slate-400">
            Consultation fees are non-refundable but are credited toward your retainer if you choose to engage MVC for full representation.
          </p>
        </div>
      </section>

      <BottomCta
        title="Ready to start your journey?"
        body="Book a free 30-minute consultation — no obligation."
        buttonText="Book a Free Consultation"
        buttonHref="#consultation"
      />
    </>
  );
}
