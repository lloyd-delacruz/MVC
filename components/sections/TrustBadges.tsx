import { MapleLeaf } from "@/components/ui/MapleLeaf";
import { Users, Star, MessageCircle } from "lucide-react";

const badges = [
  {
    icon: <MapleLeaf className="h-5 w-5 text-brand-red" />,
    title: "RCIC Licensed",
    description:
      "Regulated by the College of Immigration and Citizenship Consultants",
  },
  {
    icon: <Users className="h-5 w-5 text-navy-800" strokeWidth={2} />,
    title: "500+ Cases Assisted",
    description:
      "Helping individuals and families achieve their Canadian dreams",
  },
  {
    icon: <Star className="h-5 w-5 fill-navy-800 text-navy-800" strokeWidth={1.5} />,
    title: "12+ Years Experience",
    description: "Deep knowledge of Canadian immigration pathways",
  },
  {
    icon: <MessageCircle className="h-5 w-5 text-navy-800" strokeWidth={2} />,
    title: "Multilingual Support",
    description: "English, Spanish, Hebrew, Cebuano, Tagalog & Bangla",
  },
];

export function TrustBadges() {
  return (
    <section className="bg-white pb-14">
      <div className="container-x">
        <div className="grid gap-6 rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-card sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:px-8">
          {badges.map((b, i) => (
            <div
              key={b.title}
              className={`flex items-start gap-4 ${
                i < badges.length - 1 ? "lg:border-r lg:border-slate-100 lg:pr-4" : ""
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                {b.icon}
              </span>
              <div>
                <h3 className="headline-serif text-[16px] font-semibold text-navy-800">
                  {b.title}
                </h3>
                <p className="mt-1 text-[12px] leading-snug text-slate-500">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
