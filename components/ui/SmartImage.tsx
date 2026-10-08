"use client";

import Image, { type ImageProps } from "next/image";

/**
 * next/image that serves Unsplash photos straight from Unsplash's own image CDN
 * (imgix) at the exact width the browser needs, instead of routing them through
 * Vercel's image optimizer. That skips a slow first-hit fetch+resize on Vercel
 * and keeps the photos fast everywhere. Local /public images behave as usual.
 */
const UNSPLASH = /^https:\/\/(images|plus)\.unsplash\.com\//;

function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  return url.toString();
}

export function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  if (UNSPLASH.test(src)) {
    return <Image {...props} loader={unsplashLoader} />;
  }
  return <Image {...props} />;
}
