/* One-time fetch of blog hero photos from Unsplash CDN.
 * Each photo is downloaded in 3 width variants:
 *   <slug>-sm.jpg  (800w  — mobile)
 *   <slug>.jpg     (1600w — desktop default)
 *   <slug>@2x.jpg  (2400w — retina)
 *
 * Photographer attribution is written to src/assets/blog/attribution.json
 * for the post pages to reference.
 *
 * Run from project root:  node tools/fetch-blog-images.mjs
 */

import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import https from 'node:https';

const OUT_DIR = './src/assets/blog';

const photos = [
  {
    slug: 'top-3-mistakes',
    cdnId: '1667489023374-ea7bf696829d',
    photographer: 'Peter Olexa',
    unsplashPage: 'https://unsplash.com/photos/a-person-writing-on-a-piece-of-paper-EahB9XZt310',
  },
  {
    slug: 'when-hiring-a-consultant',
    cdnId: '1758691737246-95bf8f09a997',
    photographer: 'Vitaly Gariev',
    unsplashPage: 'https://unsplash.com/photos/two-women-talking-at-a-desk-in-an-office-aoweP90-XwM',
  },
  {
    slug: 'ielts',
    cdnId: '1711843250777-f48a9448d9c1',
    photographer: 'Kelly Sikkema',
    unsplashPage: 'https://unsplash.com/photos/a-person-sitting-at-a-table-with-a-notebook-and-pen-f41ZKPTRtZs',
  },
  {
    slug: 'settlement-funds',
    cdnId: '1625225233840-695456021cde',
    photographer: 'Mediamodifier',
    unsplashPage: 'https://unsplash.com/photos/black-calculator-beside-black-pen-on-white-printer-paper-I3HPUolh5hA',
  },
  {
    slug: 'which-province',
    cdnId: '1558818061-547b1114aa6a',
    photographer: 'David Wirzba',
    unsplashPage: 'https://unsplash.com/photos/moraine-lake-canada-wxalerEiUVQ',
  },
  {
    slug: 'am-i-too-old',
    cdnId: '1771456450664-663ea851c24d',
    photographer: 'Jacob Postuma',
    unsplashPage: 'https://unsplash.com/photos/canadian-flag-flies-on-a-forested-mountain-peak-PM1R1vEkSjc',
  },
  {
    slug: 'immigration-myths',
    cdnId: '1522785601066-4cac84ebfee6',
    photographer: 'Toa Heftiba',
    unsplashPage: 'https://unsplash.com/photos/woman-sitting-on-rug-while-reading-book-near-coffee-table-lUx8JtwReV0',
  },
  {
    slug: '77-jobs',
    cdnId: '1758873269276-9518d0cb4a0b',
    photographer: 'Vitaly Gariev',
    unsplashPage: 'https://unsplash.com/photos/diverse-team-collaborates-around-a-table-in-office-fm4B1xWEIsU',
  },
  {
    slug: 'underrated-pathway',
    cdnId: '1741699428220-65f37f3fbbcb',
    photographer: 'Zoshua Colah',
    unsplashPage: 'https://unsplash.com/photos/student-studies-at-a-library-with-books-klbApl9mxr0',
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
}));
await writeFile(join(OUT_DIR, 'attribution.json'), JSON.stringify(manifest, null, 2));

console.log(`\n${okCount} downloaded, ${failCount} failed.`);
console.log('attribution.json written.');
