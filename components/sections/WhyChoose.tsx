import { resolveIcon } from "@/lib/icons";
import type { WhyChooseItem } from "@/lib/content/types";

export function WhyChoose({ items }: { items: WhyChooseItem[] }) {
  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="container-x">
        <div className="text-center">
          <h2 className="headline-serif text-[30px] font-medium text-navy-800 sm:text-[36px]">
            Why Clients Choose MVC
          </h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {items.map((item) => {
            const Icon = resolveIcon(item.iconName);
            return (
              <div key={item.id} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center text-brand-red">
                  <Icon className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="headline-serif text-[16px] font-semibold text-navy-800">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
