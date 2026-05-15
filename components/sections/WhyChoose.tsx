import { ShieldCheck, UserRound, ScrollText } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Honest Advice",
    description: "Clear, straightforward guidance that's in your best interest.",
  },
  {
    icon: UserRound,
    title: "Personal Attention",
    description:
      "Every case is personally reviewed and tailored to your situation.",
  },
  {
    icon: ScrollText,
    title: "Regulated Expertise",
    description:
      "Licensed RCIC with in-depth knowledge of Canadian immigration law.",
  },
];

export function WhyChoose() {
  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="container-x">
        <div className="text-center">
          <h2 className="headline-serif text-[30px] font-medium text-navy-800 sm:text-[36px]">
            Why Clients Choose MVC
          </h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center text-brand-red">
                <Icon className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="headline-serif text-[16px] font-semibold text-navy-800">
                  {title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
