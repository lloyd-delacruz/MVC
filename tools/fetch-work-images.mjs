/* One-time fetch of hero photos for the Work sub-pages from Unsplash CDN.
 * Mirrors fetch-study-images.mjs / fetch-blog-images.mjs.
 *
 * Run from project root:  node tools/fetch-work-images.mjs
 */

import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import https from 'node:https';

const OUT_DIR = './src/assets/work';

const photos = [
  {
    slug: 'lmia',
    cdnId: '1767562678474-c92cec881bc3',
    photographer: 'Roman',
    unsplashPage: 'https://unsplash.com/photos/pizza-makers-working-in-a-busy-restaurant-kitchen-XVOjIZr4rI4',
    alt: 'Workers in a busy restaurant kitchen preparing food at the line',
  },
  {
    slug: 'caregiver',
    cdnId: '1739932885175-5fdaa1bd5989',
    photographer: 'Junior REIS',
    unsplashPage: 'https://unsplash.com/photos/an-older-person-holding-the-hand-of-a-younger-person-R1H2Y7T7m3I',
    alt: 'An older person holding the hand of a younger person — a quiet caregiving moment',
  },
  {
    slug: 'iec',
    cdnId: '1568036998293-09f73fcd6835',
    photographer: 'Andre Furtado',
    unsplashPage: 'https://unsplash.com/photos/lU9HtGZSia8',
    alt: 'A young traveller with a Canadian flag on their backpack',
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
