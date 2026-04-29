import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'hero';
const outDir = './.screenshots';
await mkdir(outDir, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1280, height: 800,  deviceScaleFactor: 1 },
  { name: 'mobile',  width: 375,  height: 812,  deviceScaleFactor: 2 },
];

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  const file = join(outDir, `hero-${vp.name}-${label}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✓ ${vp.name} ${vp.width}×${vp.height} → ${file}`);
  await page.close();
}
await browser.close();
