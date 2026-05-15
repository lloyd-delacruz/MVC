import { Button } from "@/components/ui/Button";

interface BottomCtaProps {
  title?: string;
  body?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function BottomCta({
  title = "Ready to start your journey?",
  body = "Book a free 15-minute consultation and let's explore your best pathway together.",
  buttonText = "Book a Free Assessment",
  buttonHref = "/contact",
}: BottomCtaProps) {
  return (
    <section className="bg-cream-50">
      <div className="container-x flex flex-col items-center gap-5 py-14 text-center lg:py-16">
        <h2 className="headline-serif max-w-2xl text-[28px] font-medium leading-tight text-navy-800 sm:text-[34px]">
          {title}
        </h2>
        <p className="max-w-xl text-[14.5px] leading-relaxed text-slate-500">
          {body}
        </p>
        <Button href={buttonHref} variant="primary" trail="calendar">
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
