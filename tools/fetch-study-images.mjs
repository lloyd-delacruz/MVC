/* One-time fetch of hero photos for the Study sub-pages from Unsplash CDN.
 * Mirrors fetch-blog-images.mjs — 3 width variants per photo:
 *   <slug>-sm.jpg  (800w  — mobile)
 *   <slug>.jpg     (1600w — desktop default)
 *   <slug>@2x.jpg  (2400w — retina)
 *
 * Run from project root:  node tools/fetch-study-images.mjs
 */

import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import https from 'node:https';

const OUT_DIR = './src/assets/study';

const photos = [
  {
    slug: 'pgwp',
    cdnId: '1758876202676-6dcc77aeaa70',
    photographer: 'Vitaly Gariev',
    unsplashPage: 'https://unsplash.com/photos/woman-wearing-glasses-smiling-in-an-office-setting-hHjpxDBZ-9k',
    alt: 'A young professional smiling in a warm modern office, working at her desk',
  },
  {
    slug: 'spousal',
    cdnId: '1671227930642-d0d82ab40b1e',
    photographer: 'James Pere',
    unsplashPage: 'https://unsplash.com/photos/a-man-and-a-woman-walking-down-a-street-holding-hands-VWsh-t-LTEA',
    alt: 'A couple walking together down a city street, holding hands',
  },
  {
    slug: 'partner-schools',
    cdnId: '1631599143468-b7d2d09820b6',
    photographer: 'DuoNguyen',
    unsplashPage: 'https://unsplash.com/photos/a-young-girl-sitting-in-a-classroom-with-a-book-frGf5WHXzZI',
    alt: 'A student studying in a sunlit classroom with an open book',
  },
  {
    slug: 'study-permit',
    cdnId: '1748009799611-0fe8744c813c',
    photographer: 'Brelyn Bashrum',
    unsplashPage: 'https://unsplash.com/photos/a-student-walks-on-campus-with-a-backpack-J64wCIFoEws',
    alt: 'A student walking across a sunlit university campus with a backpack',
  },
];

const variants = [
  { suffix: '-sm', w: 800 },
  { suffix: '',    w: 1600 },
  { suffix: '@2x', w: 2400 },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'mvc-image-fetch/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => writeFile(dest, Buffer.concat(chunks)).then(resolve, reject));
      res.on('error', reject);
    }).on('error', reject);
  });
}

await mkdir(OUT_DIR, { recursive: true });

let okCount = 0;
let failCount = 0;
for (const p of photos) {
  for (const v of variants) {
    const url = `https://images.unsplash.com/photo-${p.cdnId}?w=${v.w}&q=80&fm=jpg&fit=crop`;
    const dest = join(OUT_DIR, `${p.slug}${v.suffix}.jpg`);
    process.stdout.write(`fetching ${p.slug}${v.suffix} (${v.w}w) ... `);
    try {
      await download(url, dest);
      const s = await stat(dest);
      console.log(`✓ ${(s.size / 1024).toFixed(0)} KB`);
      okCount++;
    } catch (e) {
      console.log(`✗ ${e.message}`);
      failCount++;
    }
  }
}

const manifest = photos.map((p) => ({
  slug: p.slug,
  photographer: p.photographer,
  unsplashPage: p.unsplashPage,
  alt: p.alt,
}));
await writeFile(join(OUT_DIR, 'attribution.json'), JSON.stringify(manifest, null, 2));

console.log(`\n${okCount} downloaded, ${failCount} failed.`);
console.log('attribution.json written.');
