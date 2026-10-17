import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Analytics } from "@/components/analytics/Analytics";
import { ClickTracker } from "@/components/analytics/ClickTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { siteGraph } from "@/lib/schema";
import { BUSINESS, SITE_URL, isIndexableBuild } from "@/lib/site";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const indexable = isIndexableBuild();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Immigration Consultant Burnaby & Vancouver | MVC Immigration",
    template: "%s | MVC Immigration",
  },
  description:
    "Regulated Canadian Immigration Consultant (RCIC) in Burnaby, serving Vancouver and clients worldwide.",
  applicationName: BUSINESS.name,
  // Production build → index; every preview/development build → noindex.
  // (middleware.ts additionally sends X-Robots-Tag: noindex on non-production hosts.)
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { siteName: BUSINESS.name, locale: "en_CA", type: "website", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url] },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <JsonLd data={siteGraph()} />
        <Header />
        <main>{children}</main>
        <Footer />
        <ClickTracker />
        <Analytics />
      </body>
    </html>
  );
}
