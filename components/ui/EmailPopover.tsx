"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Mail, Check, Copy, ChevronDown } from "lucide-react";

type Props = {
  email: string;
  /** Pre-filled subject when opening Gmail. */
  subject?: string;
  label?: string;
};

/**
 * "Email us" CTA with a small popover anchored right below it:
 * open a Gmail compose window, or copy the address to the clipboard.
 * Closes on outside click and Escape (matches the lightbox pattern used elsewhere).
 */
export function EmailPopover({
  email,
  subject = "Immigration inquiry",
  label = "Email us",
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email,
  )}&su=${encodeURIComponent(subject)}`;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const itemClass =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium text-navy-800 transition-colors hover:bg-cream-50 focus-visible:bg-cream-50 focus-visible:outline-none active:bg-brand-redSoft";

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-red px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(201,31,26,0.55)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-brand-redDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98]"
      >
        <Mail className="h-4 w-4" strokeWidth={1.8} />
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="dialog"
          aria-label="Email options"
          className="absolute left-0 top-full z-30 mt-2 w-[min(18rem,calc(100vw-2.5rem))] rounded-xl border border-brand-blue/20 bg-white p-2 shadow-cardHover"
        >
          <p className="truncate px-3 pb-2 pt-1.5 text-[12px] text-slate-500">{email}</p>
          <a
            href={gmailHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <GmailIcon />
            Send via Gmail
          </a>
          <button type="button" onClick={copyEmail} className={itemClass} aria-live="polite">
            {copied ? (
              <Check className="h-[18px] w-[18px] text-emerald-600" strokeWidth={2} />
            ) : (
              <Copy className="h-[18px] w-[18px] text-brand-red" strokeWidth={1.8} />
            )}
            {copied ? "Copied!" : "Copy email address"}
          </button>
        </div>
      )}
    </div>
  );
}

function GmailIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M1.6 20.5h3.8v-9.2L0 7.3v11.6c0 .9.7 1.6 1.6 1.6Z" />
      <path fill="#34A853" d="M18.6 20.5h3.8c.9 0 1.6-.7 1.6-1.6V7.3l-5.4 4Z" />
      <path fill="#FBBC04" d="M18.6 4.5v6.8l5.4-4V5.1c0-2-2.3-3.1-3.8-1.9Z" />
      <path fill="#EA4335" d="M5.4 11.3V4.5L12 9.4l6.6-4.9v6.8L12 16.2Z" />
      <path fill="#C5221F" d="M0 5.1v2.2l5.4 4V4.5L3.8 3.2C2.3 2 0 3.1 0 5.1Z" />
    </svg>
  );
}
