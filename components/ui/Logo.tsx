import Image from "next/image";
import Link from "next/link";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="My Visa For Canada">
      <Image
        src="/logo.svg"
        alt="My Visa For Canada — Immigration Firm"
        width={392}
        height={220}
        priority
        className={`-my-1 h-[84px] w-auto lg:-my-2 lg:h-[100px] ${variant === "light" ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}
