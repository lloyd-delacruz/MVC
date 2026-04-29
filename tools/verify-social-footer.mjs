import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';

mkdirSync('./.screenshots', { recursive: true });

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('requestfailed', r => {
  const url = r.url();
  if (!url.includes('fonts.g')) errors.push('reqfail: ' + url);
});
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

const targets = [
  { url: 'http://localhost:3000/', name: 'index' },
  { url: 'http://localhost:3000/pages/about.html', name: 'about' },
];
const widths = [375, 768, 1280];

for (const t of targets) {
  for (const w of widths) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 2 });
    await page.goto(t.url, { waitUntil: 'networkidle2' });
    await page.evaluate(() => document.querySelector('.site-footer')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 200));
    const footer = await page.$('.site-footer');
    if (footer) {
      await footer.screenshot({ path: `./.screenshots/social-${t.name}-${w}.png` });
      console.log(`✓ ${t.name} @ ${w}`);
    } else {
      console.log(`✗ ${t.name} @ ${w} — no footer found`);
    }
  }
}

const count = await page.evaluate(() => document.querySelectorAll('.site-footer__social-link').length);
console.log(`social links visible on last page: ${count}`);
console.log('errors:', errors.length === 0 ? 'none' : errors);

await browser.close();
