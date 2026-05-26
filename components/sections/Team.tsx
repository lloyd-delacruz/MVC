import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { TeamMemberItem } from "@/lib/content/types";

export function Team({ members }: { members: TeamMemberItem[] }) {
  return (
    <section className="bg-white pb-14 pt-2 lg:pb-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="headline-serif text-[30px] font-medium text-navy-800 sm:text-[36px]">
            Meet the Team
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-slate-500 sm:text-[15px]">
            Behind MVC is a dedicated team helping clients move through the immigration process with care, clarity, and attention to detail.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-card">
                <Image
                  src={m.imageUrl}
                  alt={m.imageAlt || m.name}
                  width={140}
                  height={140}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="headline-serif text-[15px] font-semibold leading-tight text-navy-800">
                  {m.name}
                </div>
                <div className="mt-0.5 text-[12px] font-medium text-brand-red">
                  {m.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="#contact"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-navy-800 underline underline-offset-4 hover:text-brand-red"
          >
            Meet the full team
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
