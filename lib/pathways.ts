import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PATHWAYS_DIR = path.join(process.cwd(), "content", "pathways");

// ---------- Types ----------

export interface HeroSection {
  eyebrow?: string;
  title: string;
  lede?: string;
}

export interface OverviewSection {
  heading?: string;
  content?: string;
}

export interface KeyFactsSection {
  items: string[];
}

export interface QualifyGroup {
  title?: string;
  heading?: string;
  items: string[];
}

export interface QualifySection {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  content?: string;
  items?: string[];
  groups?: QualifyGroup[];
  note?: string;
}

export interface HowStep {
  title: string;
  description: string;
}

export interface HowSection {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  steps: HowStep[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  eyebrow?: string;
  heading?: string;
  items: FaqItem[];
}

export interface LatestUpdatesSection {
  eyebrow?: string;
  heading?: string;
  items: string[];
}

export interface StreamItem {
  tag?: string;
  title: string;
  description?: string;
  bullets?: string[];
}

export interface ThreeStreamsSection {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  streams: StreamItem[];
}

export interface SchoolItem {
  name: string;
  location?: string;
  province?: string;
}

export interface SchoolsGridSection {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  schools: SchoolItem[];
  note?: string;
}

export interface SimpleListSection {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  items: string[];
}

export interface BottomCtaSection {
  heading?: string;
  content?: string;
}

export interface PathwayData {
  slug: string;
  title: string;
  description: string;
  hero: HeroSection;
  overview?: OverviewSection;
  keyFacts?: KeyFactsSection;
  qualify?: QualifySection;
  how?: HowSection;
  faq?: FaqSection;
  latestUpdates?: LatestUpdatesSection;
  threeStreams?: ThreeStreamsSection;
  schoolsGrid?: SchoolsGridSection;
  pathwaysAfterGrad?: SimpleListSection;
  inDemandIndustries?: SimpleListSection;
  bottomCta?: BottomCtaSection;
}

// ---------- Parser ----------

type RawValue = string | RawList | RawObject;
type RawList = (string | RawObject)[];
interface RawObject {
  [key: string]: RawValue;
}

/**
 * Parse the YAML-ish body of a section. Supports:
 *   key: "value"
 *   key: |
 *     multi-line
 *     value
 *   key:
 *     - "list item"
 *     - "list item"
 *   key:
 *     - subkey: value
 *       subkey2: value
 *     - subkey: value
 *   key:
 *     subkey: value
 */
function parseSectionBody(body: string): RawObject {
  const lines = body.split("\n");
  const result: RawObject = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }

    // Top-level key (no indent).
    const topMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!topMatch) {
      i++;
      continue;
    }

    const key = topMatch[1];
    const rest = topMatch[2];

    if (rest === "|") {
      // Block scalar; capture indented lines.
      i++;
      const blockLines: string[] = [];
      let baseIndent: number | null = null;
      while (i < lines.length) {
        const l = lines[i];
        if (l.trim() === "") {
          blockLines.push("");
          i++;
          continue;
        }
        const indent = l.length - l.trimStart().length;
        if (indent === 0) break;
        if (baseIndent === null) baseIndent = indent;
        blockLines.push(l.slice(baseIndent));
        i++;
      }
      // Trim trailing empty lines.
      while (blockLines.length && blockLines[blockLines.length - 1] === "") {
        blockLines.pop();
      }
      result[key] = blockLines.join("\n");
      continue;
    }

    if (rest === "") {
      // Either a list or an object follows, indented.
      i++;
      // Peek next non-empty indented line to decide.
      let peek = i;
      while (peek < lines.length && lines[peek].trim() === "") peek++;
      if (peek >= lines.length) {
        result[key] = "";
        continue;
      }
      const peekLine = lines[peek];
      const indent = peekLine.length - peekLine.trimStart().length;
      if (indent === 0) {
        result[key] = "";
        continue;
      }

      if (peekLine.trimStart().startsWith("- ")) {
        // List of items (strings or objects).
        const { items, next } = parseList(lines, i, indent);
        result[key] = items;
        i = next;
        continue;
      }

      // Indented object.
      const { obj, next } = parseObject(lines, i, indent);
      result[key] = obj;
      i = next;
      continue;
    }

    // Inline scalar.
    result[key] = unquote(rest);
    i++;
  }

  return result;
}

function parseList(
  lines: string[],
  start: number,
  indent: number,
): { items: (string | RawObject)[]; next: number } {
  const items: (string | RawObject)[] = [];
  let i = start;

  while (i < lines.length) {
    const l = lines[i];
    if (l.trim() === "") {
      i++;
      continue;
    }
    const lineIndent = l.length - l.trimStart().length;
    if (lineIndent < indent) break;
    if (lineIndent === indent && l.trimStart().startsWith("- ")) {
      const after = l.slice(indent + 2);
      const inlineMatch = after.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
      if (inlineMatch) {
        // Object item; first key on same line as dash, then indented continuation.
        const obj: RawObject = {};
        const k = inlineMatch[1];
        const v = inlineMatch[2];
        if (v === "|") {
          // Block scalar within an object item.
          i++;
          const blockLines: string[] = [];
          let baseIndent: number | null = null;
          while (i < lines.length) {
            const ll = lines[i];
            if (ll.trim() === "") {
              blockLines.push("");
              i++;
              continue;
            }
            const ind = ll.length - ll.trimStart().length;
            if (ind <= indent + 2) break;
            if (baseIndent === null) baseIndent = ind;
            blockLines.push(ll.slice(baseIndent));
            i++;
          }
          while (
            blockLines.length &&
            blockLines[blockLines.length - 1] === ""
          ) {
            blockLines.pop();
          }
          obj[k] = blockLines.join("\n");
        } else if (v === "") {
          // Nested list/object under this key.
          i++;
          // Determine sub-indent.
          let subPeek = i;
          while (subPeek < lines.length && lines[subPeek].trim() === "")
            subPeek++;
          if (
            subPeek < lines.length &&
            lines[subPeek].length - lines[subPeek].trimStart().length >
              indent + 2
          ) {
            const subIndent =
              lines[subPeek].length - lines[subPeek].trimStart().length;
            if (lines[subPeek].trimStart().startsWith("- ")) {
              const r = parseList(lines, i, subIndent);
              obj[k] = r.items as RawValue;
              i = r.next;
            } else {
              const r = parseObject(lines, i, subIndent);
              obj[k] = r.obj;
              i = r.next;
            }
          } else {
            obj[k] = "";
          }
        } else {
          obj[k] = unquote(v);
          i++;
        }

        // Continue reading sibling keys at indent + 2 (same as obj item body indent).
        while (i < lines.length) {
          const ll = lines[i];
          if (ll.trim() === "") {
            i++;
            continue;
          }
          const ind = ll.length - ll.trimStart().length;
          if (ind <= indent) break;
          // Sibling key under this object item.
          const m = ll
            .slice(ind)
            .match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
          if (!m) {
            i++;
            continue;
          }
          const subKey = m[1];
          const subVal = m[2];
          if (subVal === "|") {
            i++;
            const blockLines: string[] = [];
            let baseIndent: number | null = null;
            while (i < lines.length) {
              const ll2 = lines[i];
              if (ll2.trim() === "") {
                blockLines.push("");
                i++;
                continue;
              }
              const ind2 = ll2.length - ll2.trimStart().length;
              if (ind2 <= ind) break;
              if (baseIndent === null) baseIndent = ind2;
              blockLines.push(ll2.slice(baseIndent));
              i++;
            }
            while (
              blockLines.length &&
              blockLines[blockLines.length - 1] === ""
            ) {
              blockLines.pop();
            }
            obj[subKey] = blockLines.join("\n");
          } else if (subVal === "") {
            i++;
            let p = i;
            while (p < lines.length && lines[p].trim() === "") p++;
            if (
              p < lines.length &&
              lines[p].length - lines[p].trimStart().length > ind
            ) {
              const subIndent = lines[p].length - lines[p].trimStart().length;
              if (lines[p].trimStart().startsWith("- ")) {
                const r = parseList(lines, i, subIndent);
                obj[subKey] = r.items as RawValue;
                i = r.next;
              } else {
                const r = parseObject(lines, i, subIndent);
                obj[subKey] = r.obj;
                i = r.next;
              }
            } else {
              obj[subKey] = "";
            }
          } else {
            obj[subKey] = unquote(subVal);
            i++;
          }
        }

        items.push(obj);
        continue;
      }
      // Plain string list item.
      items.push(unquote(after));
      i++;
      continue;
    }
    break;
  }

  return { items, next: i };
}

function parseObject(
  lines: string[],
  start: number,
  indent: number,
): { obj: RawObject; next: number } {
  const obj: RawObject = {};
  let i = start;

  while (i < lines.length) {
    const l = lines[i];
    if (l.trim() === "") {
      i++;
      continue;
    }
    const lineIndent = l.length - l.trimStart().length;
    if (lineIndent < indent) break;
    if (lineIndent !== indent) {
      i++;
      continue;
    }
    const m = l.slice(indent).match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1];
    const rest = m[2];
    if (rest === "|") {
      i++;
      const blockLines: string[] = [];
      let baseIndent: number | null = null;
      while (i < lines.length) {
        const ll = lines[i];
        if (ll.trim() === "") {
          blockLines.push("");
          i++;
          continue;
        }
        const ind = ll.length - ll.trimStart().length;
        if (ind <= indent) break;
        if (baseIndent === null) baseIndent = ind;
        blockLines.push(ll.slice(baseIndent));
        i++;
      }
      while (blockLines.length && blockLines[blockLines.length - 1] === "") {
        blockLines.pop();
      }
      obj[key] = blockLines.join("\n");
    } else if (rest === "") {
      i++;
      let p = i;
      while (p < lines.length && lines[p].trim() === "") p++;
      if (p < lines.length) {
        const subIndent = lines[p].length - lines[p].trimStart().length;
        if (subIndent > indent) {
          if (lines[p].trimStart().startsWith("- ")) {
            const r = parseList(lines, i, subIndent);
            obj[key] = r.items as RawValue;
            i = r.next;
          } else {
            const r = parseObject(lines, i, subIndent);
            obj[key] = r.obj;
            i = r.next;
          }
        } else {
          obj[key] = "";
        }
      } else {
        obj[key] = "";
      }
    } else {
      obj[key] = unquote(rest);
      i++;
    }
  }

  return { obj, next: i };
}

function unquote(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

// ---------- Section splitting ----------

interface RawSection {
  name: string;
  body: string;
}

function splitSections(content: string): RawSection[] {
  const lines = content.split("\n");
  const sections: RawSection[] = [];
  let current: RawSection | null = null;
  for (const line of lines) {
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) {
      if (current) sections.push(current);
      current = { name: m[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    }
  }
  if (current) sections.push(current);
  return sections;
}

// ---------- Mappers ----------

function asString(v: RawValue | undefined): string | undefined {
  if (typeof v === "string") return v || undefined;
  return undefined;
}

function asStringArray(v: RawValue | undefined): string[] | undefined {
  if (Array.isArray(v)) {
    return v.filter((x): x is string => typeof x === "string");
  }
  return undefined;
}

function asObjectArray(v: RawValue | undefined): RawObject[] | undefined {
  if (Array.isArray(v)) {
    return v.filter(
      (x): x is RawObject => typeof x === "object" && x !== null && !Array.isArray(x),
    );
  }
  return undefined;
}

function buildPathway(slug: string, raw: string): PathwayData {
  const fm = matter(raw);
  const data = fm.data as { title: string; slug: string; description: string };
  const sections = splitSections(fm.content);

  const sectionMap = new Map<string, RawObject>();
  for (const s of sections) {
    sectionMap.set(s.name, parseSectionBody(s.body));
  }

  const get = (name: string): RawObject | undefined => sectionMap.get(name);

  const heroRaw = get("Hero") ?? {};
  const hero: HeroSection = {
    eyebrow: asString(heroRaw.eyebrow),
    title: asString(heroRaw.title) ?? data.title,
    lede: asString(heroRaw.lede),
  };

  const overviewRaw = get("Overview");
  const overview: OverviewSection | undefined = overviewRaw
    ? {
        heading: asString(overviewRaw.heading),
        content: asString(overviewRaw.content),
      }
    : undefined;

  const keyFactsRaw = get("Key Facts");
  const keyFacts: KeyFactsSection | undefined = keyFactsRaw
    ? { items: asStringArray(keyFactsRaw.items) ?? [] }
    : undefined;

  const qualifyRaw = get("Do You Qualify");
  let qualify: QualifySection | undefined;
  if (qualifyRaw) {
    const groupsRaw = asObjectArray(qualifyRaw.groups);
    qualify = {
      eyebrow: asString(qualifyRaw.eyebrow),
      heading: asString(qualifyRaw.heading),
      lede: asString(qualifyRaw.lede),
      content: asString(qualifyRaw.content),
      items: asStringArray(qualifyRaw.items),
      groups: groupsRaw
        ? groupsRaw.map((g) => ({
            title: asString(g.title),
            heading: asString(g.heading),
            items: asStringArray(g.items) ?? [],
          }))
        : undefined,
      note: asString(qualifyRaw.note),
    };
  }

  const howRaw = get("How It Works");
  let how: HowSection | undefined;
  if (howRaw) {
    const stepsRaw = asObjectArray(howRaw.steps) ?? [];
    how = {
      eyebrow: asString(howRaw.eyebrow),
      heading: asString(howRaw.heading),
      lede: asString(howRaw.lede),
      steps: stepsRaw.map((s) => ({
        title: asString(s.title) ?? "",
        description: asString(s.description) ?? "",
      })),
    };
  }

  const faqRaw = get("FAQ");
  let faq: FaqSection | undefined;
  if (faqRaw) {
    const itemsRaw = asObjectArray(faqRaw.items) ?? [];
    faq = {
      eyebrow: asString(faqRaw.eyebrow),
      heading: asString(faqRaw.heading),
      items: itemsRaw.map((q) => ({
        question: asString(q.question) ?? "",
        answer: asString(q.answer) ?? "",
      })),
    };
  }

  const updatesRaw = get("Latest Updates");
  const latestUpdates: LatestUpdatesSection | undefined = updatesRaw
    ? {
        eyebrow: asString(updatesRaw.eyebrow),
        heading: asString(updatesRaw.heading),
        items: asStringArray(updatesRaw.items) ?? [],
      }
    : undefined;

  const streamsRaw = get("Three Streams");
  let threeStreams: ThreeStreamsSection | undefined;
  if (streamsRaw) {
    const sRaw = asObjectArray(streamsRaw.streams) ?? [];
    threeStreams = {
      eyebrow: asString(streamsRaw.eyebrow),
      heading: asString(streamsRaw.heading),
      lede: asString(streamsRaw.lede),
      streams: sRaw.map((s) => ({
        tag: asString(s.tag),
        title: asString(s.title) ?? "",
        description: asString(s.description),
        bullets: asStringArray(s.bullets),
      })),
    };
  }

  const schoolsRaw = get("Schools Grid");
  let schoolsGrid: SchoolsGridSection | undefined;
  if (schoolsRaw) {
    const sRaw = asObjectArray(schoolsRaw.schools) ?? [];
    schoolsGrid = {
      eyebrow: asString(schoolsRaw.eyebrow),
      heading: asString(schoolsRaw.heading),
      lede: asString(schoolsRaw.lede),
      note: asString(schoolsRaw.note),
      schools: sRaw.map((s) => ({
        name: asString(s.name) ?? "",
        location: asString(s.location),
        province: asString(s.province),
      })),
    };
  }

  const pgRaw = get("Pathways After Graduation");
  const pathwaysAfterGrad: SimpleListSection | undefined = pgRaw
    ? {
        eyebrow: asString(pgRaw.eyebrow),
        heading: asString(pgRaw.heading),
        lede: asString(pgRaw.lede),
        items: asStringArray(pgRaw.items) ?? [],
      }
    : undefined;

  const indRaw = get("In-Demand Industries");
  const inDemandIndustries: SimpleListSection | undefined = indRaw
    ? {
        eyebrow: asString(indRaw.eyebrow),
        heading: asString(indRaw.heading),
        lede: asString(indRaw.lede),
        items: asStringArray(indRaw.items) ?? [],
      }
    : undefined;

  const ctaRaw = get("Bottom CTA");
  const bottomCta: BottomCtaSection | undefined = ctaRaw
    ? {
        heading: asString(ctaRaw.heading),
        content: asString(ctaRaw.content),
      }
    : undefined;

  return {
    slug: data.slug ?? slug,
    title: data.title,
    description: data.description,
    hero,
    overview,
    keyFacts,
    qualify,
    how,
    faq,
    latestUpdates,
    threeStreams,
    schoolsGrid,
    pathwaysAfterGrad,
    inDemandIndustries,
    bottomCta,
  };
}

// ---------- Public API ----------

import {
  PATHWAY_CATEGORIES,
  categoryForSlug,
  pathwayHref,
  type PathwayCategory,
  type PathwayCategoryGroup,
} from "./pathway-taxonomy";

export {
  PATHWAY_CATEGORIES,
  categoryForSlug,
  pathwayHref,
  type PathwayCategory,
  type PathwayCategoryGroup,
};

export function getAllPathwaySlugs(): string[] {
  return PATHWAY_CATEGORIES.flatMap((c) => c.pathways.map((p) => p.slug));
}

export function getPathway(slug: string): PathwayData | null {
  const category = categoryForSlug(slug);
  if (!category) return null;
  const file = path.join(PATHWAYS_DIR, category, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return buildPathway(slug, raw);
}

export function getAllPathways(): PathwayData[] {
  return getAllPathwaySlugs()
    .map((s) => getPathway(s))
    .filter((p): p is PathwayData => p !== null);
}

export function getAllCategorySlugPairs(): { category: PathwayCategory; slug: string }[] {
  return PATHWAY_CATEGORIES.flatMap((c) =>
    c.pathways.map((p) => ({ category: c.id, slug: p.slug })),
  );
}
