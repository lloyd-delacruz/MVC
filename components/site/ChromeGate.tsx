"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Renders the public site chrome (Header/Footer) on every route EXCEPT the
 * admin area. Admin pages provide their own shell. Using usePathname keeps
 * public pages statically rendered (reading headers() would force dynamic).
 */
export function ChromeGate({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <>
      {!isAdmin && header}
      <main>{children}</main>
      {!isAdmin && footer}
    </>
  );
}
