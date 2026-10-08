"use client";

import { FREE_ASSESSMENT_URL } from "@/lib/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { PATHWAY_CATEGORIES } from "@/lib/pathway-taxonomy";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/success-stories" },
  { label: "Resources", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pathwaysOpen, setPathwaysOpen] = useState(false);
  const [mobilePathwaysOpen, setMobilePathwaysOpen] = useState(false);
  const pathname = usePathname();
  // Instant feedback: highlight the clicked nav item and show a progress bar
  // straight away, before the next page has finished loading.
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const current = pendingHref ?? pathname ?? "";
  const isActive = (href: string) =>
    href === "/" ? current === "/" : current.startsWith(href);

  const onHeaderClickCapture = (e: React.MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!a || !href || !href.startsWith("/") || a.target === "_blank") return;
    const path = href.split(/[?#]/)[0];
    if (path !== pathname) setPendingHref(path);
  };

  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPathwaysOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPathwaysOpen(false), 120);
  };

  // Close dropdown and clear pending state when route changes
  useEffect(() => {
    setPathwaysOpen(false);
    setMobileOpen(false);
    setPendingHref(null);
  }, [pathname]);

  // Safety net: never leave the progress bar stuck
  useEffect(() => {
    if (!pendingHref) return;
    const t = setTimeout(() => setPendingHref(null), 10000);
    return () => clearTimeout(t);
  }, [pendingHref]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!pathwaysOpen) return;
    function onClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setPathwaysOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [pathwaysOpen]);

  return (
    <header
      onClickCapture={onHeaderClickCapture}
      className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur"
    >
      {pendingHref && (
        <div
          role="progressbar"
          aria-label="Loading page"
          className="absolute inset-x-0 bottom-0 h-[3px] translate-y-full overflow-hidden"
        >
          <div className="h-full w-1/3 animate-navProgress bg-brand-red" />
        </div>
      )}
      <div className="container-x flex h-20 items-center justify-between lg:h-24">
        <Logo />

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <li
                  key={item.label}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={openDropdown}
                  onMouseLeave={scheduleClose}
                >
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.href}
                      className={`group relative inline-flex items-center text-[15.4px] font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-brand-red"
                          : "text-navy-800 hover:text-brand-red"
                      }`}
                    >
                      {item.label}
                      {isActive(item.href) && (
                        <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-brand-red" />
                      )}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPathwaysOpen((v) => !v)}
                      aria-expanded={pathwaysOpen}
                      aria-haspopup="menu"
                      aria-label={`${item.label} menu`}
                      className={`inline-flex h-5 w-5 items-center justify-center rounded transition-colors ${
                        isActive(item.href)
                          ? "text-brand-red"
                          : "text-navy-800 hover:text-brand-red"
                      }`}
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 opacity-70 transition-transform ${
                          pathwaysOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {pathwaysOpen && (
                    <div
                      className="absolute left-1/2 top-full z-50 mt-5 w-[820px] -translate-x-1/2 animate-fadeUp"
                      onMouseEnter={openDropdown}
                      onMouseLeave={scheduleClose}
                    >
                      <div className="overflow-hidden rounded-2xl border border-brand-blue/20 bg-white shadow-cardHover ring-1 ring-black/[0.03]">
                        <div className="grid grid-cols-3 gap-px bg-slate-100">
                          {PATHWAY_CATEGORIES.map((cat) => (
                            <div key={cat.id} className="bg-white p-5">
                              <Link
                                href={`/pathways/${cat.id}`}
                                className="group inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-red hover:text-brand-redDark"
                              >
                                {cat.label}
                                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                              </Link>
                              <ul className="mt-3 space-y-1.5">
                                {cat.pathways.map((p) => (
                                  <li key={p.slug}>
                                    <Link
                                      href={`/pathways/${cat.id}/${p.slug}`}
                                      className="block rounded-md px-2 py-1 -mx-2 text-[13px] text-navy-800 transition-colors hover:bg-brand-redSoft hover:text-brand-red"
                                    >
                                      {p.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-cream-50 px-5 py-3">
                          <Link
                            href="/services"
                            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-navy-800 hover:text-brand-red"
                          >
                            Services overview
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href="/pathways"
                            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-navy-800 hover:text-brand-red"
                          >
                            View all pathways
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`group relative inline-flex items-center gap-1 text-[15.4px] font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-brand-red"
                        : "text-navy-800 hover:text-brand-red"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-brand-red" />
                    )}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button href={FREE_ASSESSMENT_URL} variant="primary" trail="calendar">
            Book a Free Assessment
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.label}>
                  <div
                    className={`flex w-full items-center justify-between rounded-md text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-brand-redSoft text-brand-red"
                        : "text-navy-800 hover:bg-slate-50"
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="flex-1 px-3 py-2.5"
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobilePathwaysOpen((v) => !v)}
                      aria-expanded={mobilePathwaysOpen}
                      aria-label={`${item.label} menu`}
                      className="px-3 py-2.5"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          mobilePathwaysOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {mobilePathwaysOpen && (
                    <div className="mt-1 space-y-3 border-l-2 border-slate-100 pl-3">
                      <Link
                        href="/services"
                        className="block px-3 py-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-brand-red hover:text-brand-redDark"
                      >
                        Services Overview
                      </Link>
                      <Link
                        href="/pathways"
                        className="block px-3 py-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-navy-800 hover:text-brand-red"
                      >
                        All Pathways
                      </Link>
                      {PATHWAY_CATEGORIES.map((cat) => (
                        <div key={cat.id}>
                          <Link
                            href={`/pathways/${cat.id}`}
                            className="block px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-red"
                          >
                            {cat.label}
                          </Link>
                          <ul className="mt-1 space-y-0.5">
                            {cat.pathways.map((p) => (
                              <li key={p.slug}>
                                <Link
                                  href={`/pathways/${cat.id}/${p.slug}`}
                                  className="block rounded-md px-3 py-1.5 text-[13px] text-navy-800 hover:bg-slate-50 hover:text-brand-red"
                                >
                                  {p.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-brand-redSoft text-brand-red"
                      : "text-navy-800 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="pt-3">
              <Button href={FREE_ASSESSMENT_URL} variant="primary" trail="calendar" className="w-full">
                Book a Free Assessment
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
