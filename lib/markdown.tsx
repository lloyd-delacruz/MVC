import Link from "next/link";
import React from "react";
import { categoryForSlug } from "@/lib/pathways";

function rewriteLegacyHref(href: string): string {
  if (!(href.startsWith("/") || href.startsWith("#"))) return href;
  // Strip /pages/ prefix and .html suffix.
  let cleaned = href.replace(/^\/pages\//, "/").replace(/\.html(?=$|#|\?)/, "");
  // Nest pathway URLs under their category (e.g. /pathways/express-entry → /pathways/permanent-residence/express-entry).
  const m = cleaned.match(/^\/pathways\/([^/#?]+)(.*)$/);
  if (m) {
    const slug = m[1];
    const tail = m[2];
    const cat = categoryForSlug(slug);
    if (cat) cleaned = `/pathways/${cat}/${slug}${tail}`;
  }
  return cleaned;
}

/**
 * Render inline markdown — supports **bold** and [text](href).
 * Returns an array of React nodes for one line.
 */
export function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Combined regex: **bold** OR [text](href)
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    if (m[1] !== undefined) {
      nodes.push(
        <strong key={`b-${key++}`} className="font-semibold text-navy-800">
          {m[1]}
        </strong>,
      );
    } else if (m[2] !== undefined && m[3] !== undefined) {
      const href = m[3];
      const internal = href.startsWith("/") || href.startsWith("#");
      const cleanHref = internal ? rewriteLegacyHref(href) : href;
      if (internal) {
        nodes.push(
          <Link
            key={`a-${key++}`}
            href={cleanHref}
            className="text-brand-red underline underline-offset-4 hover:text-brand-redDark"
          >
            {m[2]}
          </Link>,
        );
      } else {
        nodes.push(
          <a
            key={`a-${key++}`}
            href={cleanHref}
            className="text-brand-red underline underline-offset-4 hover:text-brand-redDark"
            target="_blank"
            rel="noopener noreferrer"
          >
            {m[2]}
          </a>,
        );
      }
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/**
 * Render a multi-paragraph block of markdown content. Paragraphs are
 * separated by blank lines. Each paragraph supports inline marks above.
 */
export function renderBlock(content: string): React.ReactNode {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {paragraphs.map((p, idx) => (
        <p key={idx} className={idx === 0 ? "" : "mt-4"}>
          {renderInline(p.replace(/\n/g, " "))}
        </p>
      ))}
    </>
  );
}
