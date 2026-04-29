import puppeteer from 'puppeteer';
import { mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const base = 'http://localhost:3000';
const pages = [
  { slug: 'index',              url: '/' },
  { slug: 'about',              url: '/pages/about.html' },
  { slug: 'success-stories',    url: '/pages/success-stories.html' },
  { slug: 'contact',            url: '/pages/contact.html' },
  { slug: 'faq',                url: '/pages/faq.html' },
  { slug: 'express-entry',      url: '/pages/pathways/express-entry.html' },
  { slug: 'provincial-nominee', url: '/pages/pathways/provincial-nominee.html' },
  { slug: 'family-sponsorship', url: '/pages/pathways/family-sponsorship.html' },
  { slug: 'work-permits',       url: '/pages/pathways/work-permits.html' },
  { slug: 'study-permits',      url: '/pages/pathways/study-permits.html' },
  { slug: 'visitor-visas',      url: '/pages/pathways/visitor-visas.html' },
];

const viewports = [
  { name: 'm',  width: 375,  height: 812, dpr: 1 },
  { name: 't',  width: 768,  height: 1024, dpr: 1 },
  { name: 'd',  width: 1280, height: 900, dpr: 1 },
];

const outDir = './.screenshots-phase4';
await mkdir(outDir, { recursive: true });

async function fileExists(p) {
  try { await access(p); return true; } catch { return false; }
}

const issues = {};
let totalShots = 0;

for (const p of pages) {
  issues[p.slug] = { console: [], pageError: [], reqFail: [], hScroll: {} };

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  for (const vp of viewports) {
    const file = join(outDir, `${p.slug}-${vp.name}-${vp.width}.png`);
    if (await fileExists(file)) {
      console.log(`-- skip (exists): ${p.slug} ${vp.name}`);
      totalShots++;
      issues[p.slug].hScroll[vp.name] = false;
      continue;
    }

    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });

    page.on('console', m => {
      if (m.type() === 'error' || m.type() === 'warning') {
        issues[p.slug].console.push(`[${vp.name}] ${m.type()}: ${m.text()}`);
      }
    });
    page.on('pageerror', e => issues[p.slug].pageError.push(`[${vp.name}] ${e.message}`));
    page.on('requestfailed', r => {
      const u = r.url();
      if (u.includes('fonts.googleapis.com') || u.includes('fonts.gstatic.com')) return;
      issues[p.slug].reqFail.push(`[${vp.name}] ${u} — ${r.failure()?.errorText}`);
    });

    try {
      await page.goto(base + p.url, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
      issues[p.slug].pageError.push(`[${vp.name}] navigation: ${e.message}`);
      try { await page.close(); } catch {}
      continue;
    }

    const hScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    });
    issues[p.slug].hScroll[vp.name] = hScroll;

    try {
      await page.screenshot({ path: file, fullPage: true });
      totalShots++;
      console.log(`${totalShots.toString().padStart(2)}. ${p.slug.padEnd(22)} ${vp.name} ${vp.width}px ${hScroll ? '⚠ HSCROLL' : ''}`);
    } catch (e) {
      console.log(`!! screenshot fail: ${p.slug} ${vp.name}: ${e.message}`);
    }
    try { await page.close(); } catch {}
  }
  await browser.close();
}

console.log(`\n=== ${totalShots} screenshots in ${outDir} ===\n`);

let clean = 0;
for (const [slug, i] of Object.entries(issues)) {
  const anyHscroll = Object.values(i.hScroll).some(v => v);
  const ok = i.console.length === 0 && i.pageError.length === 0 && i.reqFail.length === 0 && !anyHscroll;
  if (ok) { clean++; console.log(`✓ ${slug}: clean`); continue; }
  console.log(`✗ ${slug}:`);
  if (anyHscroll) console.log(`  hscroll: ${JSON.stringify(i.hScroll)}`);
  i.console.slice(0,3).forEach(m => console.log(`  console: ${m}`));
  i.pageError.slice(0,3).forEach(m => console.log(`  pageerror: ${m}`));
  i.reqFail.slice(0,3).forEach(m => console.log(`  reqfail: ${m}`));
}
console.log(`\n${clean}/${pages.length} pages clean`);
