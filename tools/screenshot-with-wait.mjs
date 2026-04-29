import puppeteer from 'puppeteer';
const url = process.argv[2];
const out = process.argv[3] || './.screenshots/with-wait.png';
const waitMs = parseInt(process.argv[4] || '5000', 10);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1600, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, waitMs));
await page.screenshot({ path: out, fullPage: false });
console.log(`✓ ${out} (after ${waitMs}ms)`);
await browser.close();
