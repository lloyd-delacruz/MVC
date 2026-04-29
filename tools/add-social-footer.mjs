import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const root = '/Users/lloyd.vince1985gmail.com/Desktop/Software_Dev/MVC';
const files = execSync(
  `grep -rln "site-footer__brand" "${root}" --include="*.html"`,
  { encoding: 'utf8' }
).trim().split('\n');

const SOCIAL =
`
        <div class="site-footer__social">
          <h3>Follow Us</h3>
          <ul class="site-footer__social-list">
            <li><a href="#" rel="noopener" aria-label="Facebook" class="site-footer__social-link"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a></li>
            <li><a href="#" rel="noopener" aria-label="Instagram" class="site-footer__social-link"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.86 5.86 0 0 0 1.38 2.13 5.86 5.86 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg></a></li>
            <li><a href="#" rel="noopener" aria-label="YouTube" class="site-footer__social-link"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg></a></li>
            <li><a href="#" rel="noopener" aria-label="LinkedIn" class="site-footer__social-link"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg></a></li>
            <li><a href="#" rel="noopener" aria-label="X (Twitter)" class="site-footer__social-link"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M23.64 4.94a9.6 9.6 0 0 1-2.78.76 4.85 4.85 0 0 0 2.13-2.68 9.66 9.66 0 0 1-3.07 1.18 4.83 4.83 0 0 0-8.36 3.3c0 .38.04.76.13 1.12A13.72 13.72 0 0 1 1.66 3.6a4.83 4.83 0 0 0 1.5 6.45 4.79 4.79 0 0 1-2.19-.6v.06a4.83 4.83 0 0 0 3.88 4.74 4.84 4.84 0 0 1-2.18.08 4.84 4.84 0 0 0 4.51 3.36A9.7 9.7 0 0 1 0 19.54a13.69 13.69 0 0 0 7.42 2.18c8.9 0 13.77-7.37 13.77-13.77 0-.21 0-.42-.01-.63a9.83 9.83 0 0 0 2.46-2.55z"/></svg></a></li>
          </ul>
        </div>`;

// Match <p class="site-footer__rcic">...</p> across single- or multi-line, non-greedy.
const RCIC_RE = /(<p class="site-footer__rcic">[\s\S]*?<\/p>)/;

let touched = 0, skipped = 0, alreadyDone = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  if (src.includes('site-footer__social')) { alreadyDone++; continue; }
  if (!RCIC_RE.test(src)) {
    console.log(`SKIP (RCIC <p> not found): ${file}`);
    skipped++;
    continue;
  }
  const out = src.replace(RCIC_RE, `$1${SOCIAL}`);
  writeFileSync(file, out);
  touched++;
}

console.log(`Done. Touched ${touched}, already-done ${alreadyDone}, skipped ${skipped} of ${files.length}.`);
