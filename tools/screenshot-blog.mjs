import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'http://localhost:3000';
const targets = [
  { slug: 'blog-index',                url: '/pages/blog.html' },
  { slug: 'top-3',                     url: '/pages/blog/top-3-immigration-mistakes.html' },
  { slug: 'when-hiring',               url: '/pages/blog/when-hiring-a-consultant-pays-off.html' },
  { slug: 'ielts',                     url: '/pages/blog/ielts-scores-matter.html' },
  { slug: 'settlement',                url: '/pages/blog/settlement-funds-explained.html' },
  { slug: 'which-province',            url: '/pages/blog/which-canadian-province-is-right.html' },
  { slug: 'am-i-too-old',              url: '/pages/blog/am-i-too-old-to-immigrate.html' },
  { slug: 'myths',                     url: '/pages/blog/immigration-myths-busted.html' },
  { slug: '77-jobs',                   url: '/pages/blog/77-jobs-that-fast-track-pr.html' },
  { slug: 'underrated',                url: '/pages/blog/canadas-underrated-pathway.html' },
];
const viewports = [
  { name: 'm', w: 375,  h: 812, dpr: 2 },
  { name: 'd', w: 1280, h: 900, dpr: 1 },
];
const outDir = './.screenshots';
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const allIssues = {};

for (const t of targets) {
  allIssues[t.slug] = { console: [], pageError: [], reqFail: [], hScroll: {} };
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: vp.dpr });
    page.on('console', m => {
      if (m.type() === 'error' || m.type() === 'warning') {
        allIssues[t.slug].console.push(`[${vp.name}] ${m.type()}: ${m.text()}`);
      }
    });
    page.on('pageerror', e => allIssues[t.slug].pageError.push(`[${vp.name}] ${e.message}`));
    page.on('requestfailed', r => {
      const u = r.url();
      if (u.includes('fonts.g')) return;
      allIssues[t.slug].reqFail.push(`[${vp.name}] ${u} — ${r.failure()?.errorText}`);
    });
    try {
      await page.goto(base + t.url, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
      allIssues[t.slug].pageError.push(`[${vp.name}] navigation: ${e.message}`);
      await page.close();
      continue;
    }
    const hScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    allIssues[t.slug].hScroll[vp.name] = hScroll;
    await page.screenshot({ path: join(outDir, `blog-${t.slug}-${vp.name}.png`), fullPage: true });
    console.log(`✓ ${t.slug.padEnd(18)} ${vp.name} ${vp.w}px ${hScroll ? '⚠ HSCROLL' : ''}`);
    await page.close();
  }
}
await browser.close();

console.log('\n=== ISSUES ===');
let cleanCount = 0;
for (const [slug, issues] of Object.entries(allIssues)) {
  const hasH = Object.values(issues.hScroll).some(v => v);
  const isClean = issues.console.length === 0 && issues.pageError.length === 0 && issues.reqFail.length === 0 && !hasH;
  if (isClean) { cleanCount++; console.log(`✓ ${slug}: clean`); }
  else {
    console.log(`✗ ${slug}:`);
    if (hasH) console.log(`  hscroll: ${JSON.stringify(issues.hScroll)}`);
    issues.console.forEach(m => console.log(`  console: ${m}`));
    issues.pageError.forEach(m => console.log(`  pageerror: ${m}`));
    issues.reqFail.forEach(m => console.log(`  reqfail: ${m}`));
  }
}
console.log(`\n${cleanCount}/${targets.length} pages clean`);
