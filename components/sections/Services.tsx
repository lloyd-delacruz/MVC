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
              <div
                key={service.id}
                className="group relative flex flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-redBorder hover:shadow-cardHover"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-brand-red text-brand-red">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="headline-serif pt-1 text-[17px] font-semibold leading-tight text-navy-800">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-slate-500">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  aria-label={`Learn more about ${service.title}`}
                  className="mt-5 inline-flex h-7 w-7 items-center justify-center self-end rounded-full text-brand-red transition-all hover:bg-brand-redSoft"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="#contact"
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
