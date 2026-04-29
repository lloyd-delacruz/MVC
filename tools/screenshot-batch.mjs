import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'http://localhost:3000';
const pages = [
  { slug: 'express-entry',      url: '/pages/pathways/express-entry.html' },
  { slug: 'provincial-nominee', url: '/pages/pathways/provincial-nominee.html' },
  { slug: 'family-sponsorship', url: '/pages/pathways/family-sponsorship.html' },
  { slug: 'work-permits',       url: '/pages/pathways/work-permits.html' },
  { slug: 'study-permits',      url: '/pages/pathways/study-permits.html' },
  { slug: 'visitor-visas',      url: '/pages/pathways/visitor-visas.html' },
  { slug: 'about',              url: '/pages/about.html' },
  { slug: 'success-stories',    url: '/pages/success-stories.html' },
  { slug: 'contact',            url: '/pages/contact.html' },
  { slug: 'faq',                url: '/pages/faq.html' },
];

const viewports = [
  { name: 'm', width: 375,  height: 812,  dpr: 2 },
  { name: 'd', width: 1280, height: 900,  dpr: 1 },
];

const outDir = './.screenshots';
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const allIssues = {};

for (const p of pages) {
  allIssues[p.slug] = { console: [], pageError: [], reqFail: [], hScroll: {} };

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });

    page.on('console', m => {
      if (m.type() === 'error' || m.type() === 'warning') {
        allIssues[p.slug].console.push(`[${vp.name}] ${m.type()}: ${m.text()}`);
      }
    });
    page.on('pageerror', e => allIssues[p.slug].pageError.push(`[${vp.name}] ${e.message}`));
    page.on('requestfailed', r => {
      // Skip Google Fonts CSS warnings (not page-fatal)
      const u = r.url();
      if (u.includes('fonts.googleapis.com') || u.includes('fonts.gstatic.com')) return;
      allIssues[p.slug].reqFail.push(`[${vp.name}] ${u} — ${r.failure()?.errorText}`);
    });

    try {
      await page.goto(base + p.url, { waitUntil: 'networkidle2', timeout: 20000 });
    } catch (e) {
      allIssues[p.slug].pageError.push(`[${vp.name}] navigation: ${e.message}`);
      await page.close();
      continue;
    }

    // Horizontal scroll check
    const hScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    allIssues[p.slug].hScroll[vp.name] = hScroll;

    const file = join(outDir, `${p.slug}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`✓ ${p.slug.padEnd(20)} ${vp.name} ${vp.width}px ${hScroll ? '⚠ HSCROLL' : ''}`);
    await page.close();
  }
}

await browser.close();

console.log('\n=== ISSUE REPORT ===');
let cleanCount = 0;
for (const [slug, issues] of Object.entries(allIssues)) {
  const hasHScroll = Object.values(issues.hScroll).some(v => v);
  const isClean = issues.console.length === 0 && issues.pageError.length === 0 && issues.reqFail.length === 0 && !hasHScroll;
  if (isClean) {
    cleanCount++;
    console.log(`✓ ${slug}: clean`);
  } else {
    console.log(`✗ ${slug}:`);
    if (hasHScroll) console.log(`  hscroll: ${JSON.stringify(issues.hScroll)}`);
    issues.console.forEach(m => console.log(`  console: ${m}`));
    issues.pageError.forEach(m => console.log(`  pageerror: ${m}`));
    issues.reqFail.forEach(m => console.log(`  reqfail: ${m}`));
  }
}
console.log(`\n${cleanCount}/${pages.length} pages clean`);
