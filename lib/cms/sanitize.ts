const TAB = 9;
const NEWLINE = 10;
const DEL = 127;

// Remove ASCII control characters (0–31 and 127). When keepFormatting is true,
// newlines and tabs are preserved (used for markdown bodies).
function stripControlChars(input: string, keepFormatting: boolean): string {
  let out = "";
  for (const ch of input) {
    const code = ch.charCodeAt(0);
    const isControl = (code >= 0 && code <= 31) || code === DEL;
    if (!isControl) {
      out += ch;
    } else if (keepFormatting && (code === NEWLINE || code === TAB)) {
      out += ch;
    }
  }
  return out;
}

// Single-line plain text: trim edges and remove all control characters.
export function sanitizeText(input: string): string {
  return stripControlChars(input.trim(), false);
}

// Long-form markdown: trim edges, keep newlines/tabs, drop other control chars.
export function sanitizeMarkdown(input: string): string {
  return stripControlChars(input.trim(), true);
}

const SAFE_URL_PREFIXES = ["http://", "https://", "/", "mailto:", "tel:"];

// Allow only safe URL schemes / root-relative paths; unsafe schemes such as
// javascript: or data: become an empty string.
export function sanitizeUrl(input: string): string {
  const url = input.trim();
  return SAFE_URL_PREFIXES.some((p) => url.startsWith(p)) ? url : "";
}
