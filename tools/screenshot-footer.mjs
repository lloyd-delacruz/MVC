import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('requestfailed', r => {
  if (!r.url().includes('fonts.g')) errors.push('reqfail: ' + r.url());
});

await page.goto('http://localhost:3000/pages/about.html', { waitUntil: 'networkidle2' });

// Footer screenshot
const footer = await page.$('.site-footer, footer');
if (footer) {
  await footer.screenshot({ path: './.screenshots/footer-zoom.png' });
  console.log('✓ footer screenshot');
}

// Nav screenshot
const nav = await page.$('.site-nav, nav.site-nav');
if (nav) {
  await nav.screenshot({ path: './.screenshots/nav-zoom.png' });
  console.log('✓ nav screenshot');
}

// Mobile footer
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
await page.reload({ waitUntil: 'networkidle2' });
const footerM = await page.$('.site-footer, footer');
if (footerM) {
  await footerM.screenshot({ path: './.screenshots/footer-zoom-mobile.png' });
  console.log('✓ footer mobile screenshot');
}

console.log('errors:', errors.length === 0 ? 'none' : errors);
await browser.close();
