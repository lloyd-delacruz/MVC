import { resolveIcon } from "@/lib/cms/icons";
import type { TrustBadgeItem } from "@/lib/cms/types";

// Preserve the original per-badge icon treatment: the maple leaf is red, the
// rest navy, and Star is filled. New/unknown icons default to the navy style.
function iconClassFor(name: string): string {
  if (name === "MapleLeaf") return "h-5 w-5 text-brand-red";
  if (name === "Star") return "h-5 w-5 fill-navy-800 text-navy-800";
  return "h-5 w-5 text-navy-800";
}

export function TrustBadges({ badges }: { badges: TrustBadgeItem[] }) {
  return (
    <section className="bg-white pb-14">
      <div className="container-x">
        <div className="grid gap-6 rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-card sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:px-8">
          {badges.map((b, i) => {
            const Icon = resolveIcon(b.iconName);
            return (
              <div
                key={b.id}
                className={`flex items-start gap-4 ${
                  i < badges.length - 1 ? "lg:border-r lg:border-slate-100 lg:pr-4" : ""
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                  <Icon className={iconClassFor(b.iconName)} strokeWidth={b.iconName === "Star" ? 1.5 : 2} />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
