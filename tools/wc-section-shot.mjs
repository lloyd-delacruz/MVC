import puppeteer from 'puppeteer';
const url = process.argv[2];
const out = process.argv[3];
const w = parseInt(process.argv[4], 10);
const h = parseInt(process.argv[5], 10);
const selector = process.argv[6];
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
const el = await page.$(selector);
if (!el) { console.error('selector not found:', selector); process.exit(2); }
await el.scrollIntoView();
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('saved', out);
