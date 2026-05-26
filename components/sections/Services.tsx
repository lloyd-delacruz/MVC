import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveIcon } from "@/lib/icons";
import type { ServiceItem } from "@/lib/content/types";

export function Services({ items }: { items: ServiceItem[] }) {
  return (
    <section id="services" className="bg-white py-16 lg:py-20">
      <div className="container-x">
        <div className="text-center">
          <h2 className="headline-serif text-[34px] font-medium text-navy-800 sm:text-[40px]">
            How We Can Help
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((service) => {
            const Icon = resolveIcon(service.iconName);
            return (
              <Link
                key={service.id}
                href={service.href}
                aria-label={`Learn more about ${service.title}`}
                className="group relative flex flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-redBorder hover:shadow-cardHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-brand-red text-brand-red">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="headline-serif pt-1 text-[17px] font-semibold leading-tight text-navy-800 transition-colors group-hover:text-brand-red">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-slate-500">
                  {service.description}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-5 inline-flex h-7 w-7 items-center justify-center self-end rounded-full text-brand-red transition-all group-hover:bg-brand-redSoft"
                >
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/pathways"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy-800 underline underline-offset-4 hover:text-brand-red"
          >
            View all services
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
