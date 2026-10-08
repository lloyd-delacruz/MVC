import fs from "node:fs";
import path from "node:path";
import { SmartImage } from "@/components/ui/SmartImage";
import { getPageImage } from "@/lib/content/page-images";

interface FeatureImageProps {
  route: string;
  /** "wide" for landing pages, "article" for blog posts (narrower column). */
  variant?: "wide" | "article";
  className?: string;
}

/**
 * Photo band shown directly under a page hero. Content lives in
 * lib/content/page-images.ts. Local images that haven't been added to
 * /public yet are skipped instead of rendering a broken image.
 */
export function FeatureImage({ route, variant = "wide", className = "" }: FeatureImageProps) {
  const img = getPageImage(route);
  if (!img) return null;
  if (img.src.startsWith("/") && !fs.existsSync(path.join(process.cwd(), "public", img.src))) {
    return null;
  }

  const frame =
    variant === "article"
      ? "mx-auto max-w-3xl aspect-[16/9]"
      : "aspect-[4/3] sm:aspect-[16/7] lg:aspect-[3/1]";

  return (
    <div className={`container-x ${className}`}>
      <figure className={`relative overflow-hidden rounded-2xl border border-brand-blue/20 bg-slate-100 shadow-card ${frame}`}>
        <SmartImage
          priority
          src={img.src}
          alt={img.alt}
          fill
          sizes={variant === "article" ? "(min-width: 768px) 768px, 100vw" : "(min-width: 1200px) 1200px, 100vw"}
          className="object-cover"
          style={{ objectPosition: img.position ?? "center" }}
        />
      </figure>
    </div>
  );
}
