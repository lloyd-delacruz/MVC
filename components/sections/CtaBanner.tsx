import { Button } from "@/components/ui/Button";
import { MapleLeaf } from "@/components/ui/MapleLeaf";

export function CtaBanner() {
  return (
    <section id="contact" className="relative overflow-hidden bg-navy-800">
      <MapleLeaf className="absolute -left-4 -top-4 h-24 w-24 rotate-[18deg] text-white/[0.06]" />
      <MapleLeaf className="absolute left-24 -bottom-6 h-16 w-16 -rotate-12 text-white/[0.06]" />
      <MapleLeaf className="absolute right-1/3 top-3 h-10 w-10 rotate-12 text-white/[0.05]" />

      <div className="container-x relative flex flex-col items-start justify-between gap-5 py-8 lg:flex-row lg:items-center lg:py-9">
        <div>
          <h2 className="headline-serif text-[20px] font-medium leading-tight text-white sm:text-[22px]">
            Your Canadian journey starts with a conversation.
          </h2>
          <p className="mt-1.5 text-[13px] text-slate-300">
            Book your free 15-minute assessment and let&rsquo;s explore your best
            pathway together.
          </p>
        </div>
        <Button href="#book" variant="primary" trail="calendar">
          Book Your Free Assessment
        </Button>
      </div>
    </section>
  );
}
