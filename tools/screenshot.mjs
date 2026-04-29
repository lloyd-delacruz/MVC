import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const outDir = './.screenshots';

await mkdir(outDir, { recursive: true });

const viewports = [
  { name: 'mobile',  width: 375,  height: 812,  deviceScaleFactor: 2 },
  { name: 'tablet',  width: 768,  height: 1024, deviceScaleFactor: 2 },
  { name: 'desktop', width: 1280, height: 900,  deviceScaleFactor: 1 },
];

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const consoleMsgs = [];
const pageErrors = [];

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: vp.deviceScaleFactor,
  });
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') {
      consoleMsgs.push(`[${vp.name}] ${m.type()}: ${m.text()}`);
    }
  });
  page.on('pageerror', (e) => pageErrors.push(`[${vp.name}] pageerror: ${e.message}`));
  page.on('requestfailed', (req) => pageErrors.push(`[${vp.name}] reqfail: ${req.url()} — ${req.failure()?.errorText}`));

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  const stem = label ? `screenshot-${vp.name}-${label}` : `screenshot-${vp.name}`;
  const file = join(outDir, `${stem}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`✓ ${vp.name.padEnd(8)} ${vp.width}×${vp.height} → ${file}`);

  // Hamburger toggle test on mobile/tablet only
  if (vp.name === 'mobile' || vp.name === 'tablet') {
    const hamburger = await page.$('.site-nav__hamburger');
    if (hamburger) {
      await hamburger.click();
      await new Promise(r => setTimeout(r, 400));
      const openFile = join(outDir, `${stem}-menu-open.png`);
      await page.screenshot({ path: openFile, fullPage: false });
      console.log(`✓ ${vp.name.padEnd(8)} menu open       → ${openFile}`);
      await hamburger.click();
      await new Promise(r => setTimeout(r, 400));
    }
  }

  await page.close();
}

await browser.close();

if (consoleMsgs.length) {
  console.log('\n--- console warnings/errors ---');
  consoleMsgs.forEach(m => console.log(m));
} else {
  console.log('\n✓ no console warnings/errors');
}
if (pageErrors.length) {
  console.log('\n--- page errors ---');
  pageErrors.forEach(m => console.log(m));
} else {
  console.log('✓ no page/request errors');
}
