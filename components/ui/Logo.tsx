import Image from "next/image";
import Link from "next/link";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="My Visa For Canada">
      <Image
        src="/logo-header.png"
        alt="My Visa For Canada — Immigration Firm"
        width={369}
        height={201}
        priority
        className={`h-[74px] w-auto lg:h-[90px] ${variant === "light" ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}
