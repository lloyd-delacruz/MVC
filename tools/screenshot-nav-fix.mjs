import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

const targets = [
  { url: 'http://localhost:3000/',         label: 'home' },
  { url: 'http://localhost:3000/pages/about.html', label: 'about' },
];
const viewports = [
  { name: 'm', w: 375,  h: 812, dpr: 2 },
  { name: 'd', w: 1280, h: 900, dpr: 1 },
];

const allErrors = [];

for (const t of targets) {
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: vp.dpr });

    page.on('pageerror', e => allErrors.push(`[${t.label}/${vp.name}] pageerror: ${e.message}`));
    page.on('console', m => {
      if (m.type() === 'error' || m.type() === 'warning') {
        allErrors.push(`[${t.label}/${vp.name}] ${m.type()}: ${m.text()}`);
      }
    });
    page.on('requestfailed', r => {
      if (!r.url().includes('fonts.g')) {
        allErrors.push(`[${t.label}/${vp.name}] reqfail: ${r.url()}`);
      }
    });

    await page.goto(t.url, { waitUntil: 'networkidle2' });

    // Top of page
    await page.screenshot({ path: `./.screenshots/nav-${t.label}-${vp.name}-top.png`, fullPage: false });

    // Measure nav metrics
    const navMetrics = await page.evaluate(() => {
      const nav = document.querySelector('.site-nav');
      if (!nav) return null;
      const r = nav.getBoundingClientRect();
      const cs = getComputedStyle(nav);
      const img = nav.querySelector('.site-nav__brand img');
      const ir = img ? img.getBoundingClientRect() : null;
      return {
        navHeight: r.height,
        navPosition: cs.position,
        navTop: r.top,
        imgHeight: ir ? ir.height : null,
        imgWidth: ir ? ir.width : null,
        firstSectionPaddingTop: getComputedStyle(document.querySelector('main > section')).paddingTop,
      };
    });
    console.log(`${t.label}/${vp.name}:`, JSON.stringify(navMetrics));

    // Scroll 400 and take screenshot
    await page.evaluate(() => window.scrollTo(0, 400));
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: `./.screenshots/nav-${t.label}-${vp.name}-scrolled400.png`, fullPage: false });

    // Verify nav still visible at top after scroll
    const stillSticky = await page.evaluate(() => {
      const nav = document.querySelector('.site-nav');
      const r = nav.getBoundingClientRect();
      return { top: r.top, isScrolledClass: nav.classList.contains('is-scrolled') };
    });
    console.log(`  after scroll 400: nav.top=${stillSticky.top}, is-scrolled=${stillSticky.isScrolledClass}`);

    // Mobile-only: test hamburger
    if (vp.name === 'm') {
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 200));
      const ham = await page.$('.site-nav__hamburger');
      if (ham) {
        await ham.click();
        await new Promise(r => setTimeout(r, 400));
        await page.screenshot({ path: `./.screenshots/nav-${t.label}-${vp.name}-menu-open.png`, fullPage: false });
        const menuOpen = await page.evaluate(() =>
          document.querySelector('.site-nav').classList.contains('is-menu-open')
        );
        console.log(`  hamburger menu open: ${menuOpen}`);
        await ham.click();
        await new Promise(r => setTimeout(r, 300));
      }
    }

    await page.close();
  }
}

await browser.close();

console.log('\n=== ERRORS ===');
console.log(allErrors.length === 0 ? '✓ none' : allErrors.join('\n'));
