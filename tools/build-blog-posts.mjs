/* One-shot generator for the remaining blog posts.
 * Run from project root: node tools/build-blog-posts.mjs
 *
 * Each entry below produces pages/blog/<slug>.html with the same
 * head/nav/footer pattern as the hand-written first three posts.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_DIR = './pages/blog';

// ------------------------------------------------------------------
// Helpers — related-post cards keyed by slug
// ------------------------------------------------------------------
const cardsBySlug = {
  'top-3-immigration-mistakes': {
    photoSlug: 'top-3-mistakes',
    alt: 'A person reviewing documents at a desk',
    pill: 'Process',
    date: 'Apr 22, 2026',
    title: 'The top three mistakes we see in Canadian immigration',
    dek: 'The three errors that cost applicants the most.',
  },
  'when-hiring-a-consultant-pays-off': {
    photoSlug: 'when-hiring-a-consultant',
    alt: 'Two professionals talking at an office desk',
    pill: 'Reflection',
    date: 'Apr 1, 2026',
    title: 'When does hiring an immigration consultant actually pay off?',
    dek: "A regulated consultant's value isn't filling forms — it's reading your situation.",
  },
  'ielts-scores-matter': {
    photoSlug: 'ielts',
    alt: 'A notebook and pen on a desk',
    pill: 'Process',
    date: 'Mar 11, 2026',
    title: 'Why your IELTS score matters more than you think',
    dek: 'Your IELTS score is often the single biggest lever you have.',
  },
  'settlement-funds-explained': {
    photoSlug: 'settlement-funds',
    alt: 'A calculator and pen on a sheet of paper',
    pill: 'Process',
    date: 'Feb 18, 2026',
    title: 'Settlement funds, explained: what "show money" actually means',
    dek: 'Whether visitor, student, or PR — what to show, how much, why officers care.',
  },
  'which-canadian-province-is-right': {
    photoSlug: 'which-province',
    alt: 'Moraine Lake in Banff National Park, Alberta',
    pill: 'Pathway Guide',
    date: 'Jan 28, 2026',
    title: 'Which Canadian province is right for you?',
    dek: 'Ten provinces, three territories, and very different lives. A practical guide.',
  },
  'am-i-too-old-to-immigrate': {
    photoSlug: 'am-i-too-old',
    alt: 'A Canadian flag waving on a forested mountain peak in the Rockies',
    pill: 'Reflection',
    date: 'Dec 17, 2025',
    title: 'Am I too old to immigrate to Canada?',
    dek: "It's the question we hear most often. The honest answer surprises everyone.",
  },
  'immigration-myths-busted': {
    photoSlug: 'immigration-myths',
    alt: 'A woman reading a book at home',
    pill: 'Reflection',
    date: 'Nov 24, 2025',
    title: 'Common Canadian immigration myths, busted',
    dek: 'Three myths we hear weekly — and the truth.',
  },
  '77-jobs-that-fast-track-pr': {
    photoSlug: '77-jobs',
    alt: 'A diverse team collaborating around a table in an office',
    pill: 'Pathway Guide',
    date: 'Oct 30, 2025',
    title: '77 in-demand jobs that fast-track your PR application',
    dek: "British Columbia's PNP \"priority occupations\" list shaves months off processing times.",
  },
  'canadas-underrated-pathway': {
    photoSlug: 'underrated-pathway',
    alt: 'A student studying at a library with books',
    pill: 'Pathway Guide',
    date: 'Sep 19, 2025',
    title: "Canada's most underrated immigration pathway, explained",
    dek: 'Why the Canadian study permit is one of the surest routes to PR.',
  },
};

const navHtml = (activeSlug) => `
  <nav class="site-nav" aria-label="Primary">
    <div class="site-nav__inner">
      <a class="site-nav__brand" href="/" aria-label="MVC Immigration — Home">
        <img src="/src/assets/logo.svg" alt="MVC Immigration" width="200" height="45">
      </a>
      <ul class="site-nav__links">
        <li><a class="site-nav__link" href="/">Home</a></li>
        <li><a class="site-nav__link" href="/#pathways">Pathways</a></li>
        <li><a class="site-nav__link" href="/pages/about.html">About</a></li>
        <li><a class="site-nav__link" href="/pages/success-stories.html">Success Stories</a></li>
        <li><a class="site-nav__link is-active" href="/pages/blog.html" aria-current="page">Resources</a></li>
        <li><a class="site-nav__link" href="/pages/contact.html">Contact</a></li>
      </ul>
      <a class="btn-primary btn-sm site-nav__cta" href="/pages/contact.html">Book a Consultation</a>
      <button class="site-nav__hamburger" type="button" aria-controls="primary-overlay" aria-expanded="false" aria-label="Open menu">
        <span class="site-nav__hamburger-bar" aria-hidden="true"></span>
      </button>
    </div>
    <div id="primary-overlay" class="site-nav__overlay" aria-hidden="true">
      <ul class="site-nav__overlay-links">
        <li><a class="site-nav__overlay-link" href="/">Home</a></li>
        <li><a class="site-nav__overlay-link" href="/#pathways">Pathways</a></li>
        <li><a class="site-nav__overlay-link" href="/pages/about.html">About</a></li>
        <li><a class="site-nav__overlay-link" href="/pages/success-stories.html">Success Stories</a></li>
        <li><a class="site-nav__overlay-link" href="/pages/blog.html">Resources</a></li>
        <li><a class="site-nav__overlay-link" href="/pages/contact.html">Contact</a></li>
      </ul>
      <a class="btn-primary site-nav__overlay-cta" href="/pages/contact.html">Book a Consultation</a>
      <p class="site-nav__overlay-meta">RCIC #RXXXXXXX · Member of CICC</p>
    </div>
  </nav>`;

const footerHtml = `
  <footer class="site-footer">
    <div class="site-footer__cta-strip">
      <div class="site-footer__cta-inner">
        <div class="site-footer__cta-text">
          <h2>Ready to start your journey?</h2>
          <p>Book a free 30-minute consultation — no obligation.</p>
        </div>
        <a class="btn-primary" href="/pages/contact.html">Book a Free Consultation</a>
      </div>
    </div>
    <div class="site-footer__main">
      <div class="site-footer__brand">
        <img loading="lazy" src="/src/assets/logo-mono.svg" alt="MVC Immigration" width="160" height="36">
        <p>Regulated Canadian Immigration Consultants helping families, workers, and students build their lives in Canada.</p>
        <p class="site-footer__rcic">RCIC #RXXXXXXX · Member of the College of Immigration and Citizenship Consultants (CICC).</p>
      </div>
      <div>
        <h3>Immigration Pathways</h3>
        <ul class="site-footer__list">
          <li><a href="/pages/pathways/express-entry.html">Express Entry</a></li>
          <li><a href="/pages/pathways/provincial-nominee.html">Provincial Nominee Program</a></li>
          <li><a href="/pages/pathways/family-sponsorship.html">Family Sponsorship</a></li>
          <li><a href="/pages/pathways/work-permits.html">Work Permits</a></li>
          <li><a href="/pages/pathways/study-permits.html">Study Permits</a></li>
          <li><a href="/pages/pathways/visitor-visas.html">Visitor Visas</a></li>
        </ul>
      </div>
      <div>
        <h3>Navigate</h3>
        <ul class="site-footer__list">
          <li><a href="/">Home</a></li>
          <li><a href="/pages/about.html">About Us</a></li>
          <li><a href="/pages/success-stories.html">Success Stories</a></li>
          <li><a href="/pages/resources.html">Free Resources</a></li>
          <li><a href="/pages/blog.html">Blog</a></li>
          <li><a href="/pages/contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <address class="site-footer__contact">
          [Office Address]<br>
          [City], [Province] [Postal Code]<br>
          <a href="tel:+10000000000">(000) 000-0000</a><br>
          <a href="mailto:hello@example.com">hello@example.com</a><br>
          Mon–Fri · 9:00am – 6:00pm
        </address>
      </div>
    </div>
    <div class="site-footer__bottom">
      <div class="site-footer__bottom-inner">
        <span>© 2026 MVC Immigration Consulting. All rights reserved.</span>
        <div class="site-footer__legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/disclaimer">Legal Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>`;

const relatedCard = (slug) => {
  const c = cardsBySlug[slug];
  return `
          <a class="blog-card-link" href="/pages/blog/${slug}.html">
            <article class="blog-card">
              <div class="blog-card__media">
                <img src="/src/assets/blog/${c.photoSlug}.jpg" srcset="/src/assets/blog/${c.photoSlug}-sm.jpg 800w, /src/assets/blog/${c.photoSlug}.jpg 1600w" sizes="(min-width: 768px) 50vw, 100vw" alt="${c.alt}" width="1600" height="900" loading="lazy">
              </div>
              <div class="blog-card__body">
                <div class="blog-card__meta">
                  <span class="blog-card__pill">${c.pill}</span>
                  <span class="blog-card__date">${c.date}</span>
                </div>
                <h3 class="blog-card__title">${c.title}</h3>
                <p class="blog-card__dek">${c.dek}</p>
                <span class="blog-card__cta">Read article →</span>
              </div>
            </article>
          </a>`;
};

const renderPost = (p) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#1B3557">
  <meta name="color-scheme" content="light">

  <title>${p.title} · MVC Immigration</title>
  <meta name="description" content="${p.description}">

  <link rel="canonical" href="https://example.com/pages/blog/${p.slug}">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.shortDescription}">
  <meta property="og:url" content="https://example.com/pages/blog/${p.slug}">
  <meta property="og:image" content="/src/assets/blog/${p.photoSlug}.jpg">
  <meta property="article:published_time" content="${p.dateIso}">
  <meta property="article:author" content="MVC Editorial Team">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap">

  <link rel="stylesheet" href="/src/styles/global.css">
  <link rel="stylesheet" href="/src/styles/inner-shared.css">
  <link rel="stylesheet" href="/src/styles/blog.css">
  <link rel="stylesheet" href="/src/styles/blog-post.css">

  <link rel="icon" type="image/svg+xml" href="/src/assets/logo.svg">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": ${JSON.stringify(p.title)},
    "description": ${JSON.stringify(p.shortDescription)},
    "image": "https://example.com/src/assets/blog/${p.photoSlug}.jpg",
    "datePublished": "${p.dateIso}",
    "author": { "@type": "Person", "name": "MVC Editorial Team" },
    "publisher": { "@type": "Organization", "name": "MVC Immigration" },
    "mainEntityOfPage": "https://example.com/pages/blog/${p.slug}"
  }
  </script>
</head>

<body>
  <a class="skip-to-content" href="#main">Skip to content</a>
${navHtml(p.slug)}
  <main id="main" tabindex="-1">

    <section class="page-hero page-top-offset" aria-labelledby="post-title">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">${p.category} · ${p.dateReadable}</p>
        <h1 id="post-title" class="page-hero__title">
          ${p.headlineHtml}
        </h1>
        <p class="page-hero__lede">${p.lede}</p>
        <p class="page-hero__meta">${p.readTime} · MVC Editorial Team</p>
      </div>
    </section>

    <figure class="post-hero-photo">
      <img src="/src/assets/blog/${p.photoSlug}.jpg"
           srcset="/src/assets/blog/${p.photoSlug}-sm.jpg 800w, /src/assets/blog/${p.photoSlug}.jpg 1600w, /src/assets/blog/${p.photoSlug}@2x.jpg 2400w"
           sizes="100vw"
           alt="${p.photoAlt}"
           width="1600" height="900" fetchpriority="high">
    </figure>

    <section class="section bg-base-100 post-body">
      <article class="post-prose">
${p.body}
      </article>

      <aside class="post-author">
        <div class="post-author__avatar" aria-hidden="true">M</div>
        <div class="post-author__info">
          <strong>MVC Editorial Team</strong>
          <p>Reviewed by [Consultant Name], Regulated Canadian Immigration Consultant (RCIC #RXXXXXXX). <!-- CLIENT: replace --></p>
        </div>
      </aside>

      <p class="post-photo-credit">
        Photo by <a href="${p.photoPageUrl}" rel="noopener">${p.photographer}</a> on <a href="https://unsplash.com" rel="noopener">Unsplash</a>.
      </p>
    </section>

    <section class="post-related" aria-labelledby="related-title">
      <div class="post-related__inner">
        <h2 id="related-title" class="post-related__head">Related articles</h2>
        <div class="post-related__grid">
${p.relatedSlugs.map(relatedCard).join('\n')}
        </div>
      </div>
    </section>

    <section class="bottom-cta" aria-labelledby="post-cta-title">
      <div class="bottom-cta__inner">
        <h2 id="post-cta-title" class="bottom-cta__title">Want a candid read on <em>your file?</em></h2>
        <p class="bottom-cta__lede">Book a free 30-minute consultation. We'll review what's strong, what's weak, and what your fastest path looks like.</p>
        <div class="bottom-cta__row">
          <a class="btn-primary" href="/pages/contact.html">Book a Free Consultation</a>
        </div>
      </div>
    </section>

  </main>
${footerHtml}
  <script src="/src/scripts/nav.js" defer></script>
</body>
</html>
`;

// ------------------------------------------------------------------
// Posts to generate (5 of 9 — first 4 already hand-written)
// ------------------------------------------------------------------

const posts = [
  {
    slug: 'which-canadian-province-is-right',
    title: 'Which Canadian province is right for you?',
    headlineHtml: 'Which Canadian <em>province</em> is right for you?',
    description: 'Ten provinces, three territories. A practical guide to choosing where to land — by city size, climate, services, and immigration program eligibility.',
    shortDescription: 'A practical guide to choosing where to land in Canada.',
    lede: "Canada is the second-largest country in the world. Choosing the right province isn't just an administrative step — it shapes your weather, your community, and your immigration options.",
    category: 'Pathway Guide',
    date: 'Jan 28, 2026',
    dateIso: '2026-01-28',
    dateReadable: 'Jan 28, 2026',
    readTime: '6 min read',
    photoSlug: 'which-province',
    photoAlt: 'Moraine Lake in Banff National Park, Alberta — turquoise water and mountain peaks',
    photographer: 'David Wirzba',
    photoPageUrl: 'https://unsplash.com/photos/moraine-lake-canada-wxalerEiUVQ',
    relatedSlugs: ['77-jobs-that-fast-track-pr', 'canadas-underrated-pathway'],
    body: `        <p>With 10 provinces and 3 territories making up the second-largest country in the world, choosing the right province in Canada — whether you'll be studying, immigrating, working, or starting a business — is one of the bigger decisions you'll make. Each region has its own culture, services, climate, landscapes, and industries. Even if you have friends or family already in Canada, take some time to think about what you actually want your new life to look like.</p>

        <h2>Start with the obvious questions</h2>
        <p>Before you can compare provinces sensibly, you need to be honest about a few things:</p>
        <ul>
          <li>Do you want to live in a large metropolitan city, or would you be happier in a small town?</li>
          <li>How important is the climate to you? Atlantic winters and prairie summers are real.</li>
          <li>What's the cost-of-living trade-off you're willing to make?</li>
          <li>How critical is access to specific health services, schools, or cultural communities?</li>
          <li>What language is spoken locally? (Most of Canada is English; Quebec is officially French.)</li>
        </ul>

        <h2>The three big cities</h2>
        <p>Most newcomers settle in one of Canada's three largest cities. Each has its own personality:</p>
        <ul>
          <li><strong>Toronto, Ontario</strong> — the country's financial and cultural centre; the most diverse city in Canada; expensive housing, deep job market.</li>
          <li><strong>Montréal, Quebec</strong> — the largest French-speaking city in North America; lower cost of living than Toronto or Vancouver; strong arts and tech scenes.</li>
          <li><strong>Vancouver, British Columbia</strong> — Pacific coast, mild climate, mountains and ocean within an hour; high cost of living; growing tech and film industries.</li>
        </ul>

        <h2>Medium-sized cities</h2>
        <p>Population roughly 100,000 to 1 million. Lower housing costs than the big three, full city amenities, often easier immigration pathways through provincial nominee programs:</p>
        <ul>
          <li><strong>Atlantic:</strong> St. John's (NL), Halifax (NS)</li>
          <li><strong>Quebec:</strong> Québec City</li>
          <li><strong>Ontario:</strong> Ottawa, Hamilton, London, Kitchener-Waterloo, Windsor, Mississauga, Oshawa, St. Catharines, Sudbury, Thunder Bay</li>
          <li><strong>Prairies:</strong> Winnipeg, Saskatoon, Regina, Calgary, Edmonton</li>
          <li><strong>Pacific:</strong> Victoria</li>
        </ul>

        <h2>Smaller cities</h2>
        <p>Most of the same public and private services as the larger cities, with substantially lower costs of living: Sydney (NS), Corner Brook (NL), Charlottetown (PEI), Moncton (NB), Trois-Rivières (QC), Brandon (MB), Moose Jaw (SK), Red Deer (AB), Kelowna (BC).</p>

        <h2>Living outside cities</h2>
        <p>Suburbs and surrounding towns within 60–100 km of a major city offer relatively lower costs while keeping access to big-city amenities. Canada's rural areas offer wide open spaces and fresh air; access to services depends on how close you are to the nearest large town.</p>

        <blockquote class="post-pullquote">
          The provinces with smaller populations — and often harsher climates — typically have more lenient immigration program requirements. The trade-off is real, in both directions.
        </blockquote>

        <h2>From an immigration perspective</h2>
        <p>From a regulated consultant's perspective, this is where the choice gets practical. Provinces with smaller populations and harsher climates — Saskatchewan, Manitoba, the Atlantic provinces, the territories — typically have more flexible PNP eligibility criteria because they're working harder to attract newcomers. Ontario, BC, and Quebec are more competitive because everyone wants to land there.</p>
        <p>The right province for your immigration file is rarely the "best" one in the abstract. It's the one where:</p>
        <ul>
          <li>Your occupation is in demand</li>
          <li>Your language profile fits the local stream</li>
          <li>You can credibly demonstrate intent to settle</li>
          <li>The program timing works with your life</li>
        </ul>

        <div class="post-callout">
          <span class="post-callout__label">RCIC honest take</span>
          <p>Provinces watch carefully for nominees who land and immediately move elsewhere. Stating an intent to settle in Manitoba "to get the nomination" and then moving to Toronto a month after PR is a fast way to undermine future Canadian citizenship applications. Choose a province you'd actually want to live in.</p>
        </div>

        <h2>Get a profile-specific recommendation</h2>
        <p>If you'd like to know which provinces match your profile and timeline, <a href="/pages/contact.html">book a free 45-minute consultation</a>. We'll walk you through the practical trade-offs given your specific situation — occupation, family, language, and goals — before you commit to a stream.</p>`,
  },

  {
    slug: 'am-i-too-old-to-immigrate',
    title: 'Am I too old to immigrate to Canada?',
    headlineHtml: 'Am I <em>too old</em> to immigrate to Canada?',
    description: "It's the question we hear most often. The honest answer involves age points, eligibility math, and one rule that surprises almost everyone — don't delay.",
    shortDescription: 'The honest answer involves age points, eligibility, and one rule that surprises everyone.',
    lede: "It's probably the most common question we get as immigration consultants. The answer isn't a simple yes or no — but the math doesn't lie, and waiting almost always costs you.",
    category: 'Reflection',
    date: 'Dec 17, 2025',
    dateIso: '2025-12-17',
    dateReadable: 'Dec 17, 2025',
    readTime: '4 min read',
    photoSlug: 'am-i-too-old',
    photoAlt: 'A Canadian flag waving on a forested mountain peak in the Rockies — a wide horizon, no matter when you start',
    photographer: 'Jacob Postuma',
    photoPageUrl: 'https://unsplash.com/photos/canadian-flag-flies-on-a-forested-mountain-peak-PM1R1vEkSjc',
    relatedSlugs: ['top-3-immigration-mistakes', 'ielts-scores-matter'],
    body: `        <p>This is probably the most common question I get asked as an immigration consultant. Before answering it directly, I want to establish that Canada is one of the few countries left that genuinely remains open to foreigners — as students, tourists, refugees, workers, or immigrants. This post focuses on the immigrant pathway specifically.</p>

        <p>We've had many clients who are interested in immigrating to Canada but put their plans on hold because they're "still busy" with other things. From an immigration perspective, that's almost always a mistake.</p>

        <h2>Why timing matters so much</h2>
        <p>Immigrating to Canada is both a "numbers" game and a "qualifications" game. The honest truth is that Canada's immigration policies are designed to admit people who are younger, educated, skilled, and proficient in English or French. The age component is the one variable you genuinely can't reverse.</p>

        <p>In the points-based federal economic streams (Express Entry's CRS, most PNP base scores), age is weighted heaviest in your twenties and early thirties. From your mid-thirties onward, every birthday quietly subtracts points from your profile. By your late forties, age points are minimal.</p>

        <h2>"Too old" isn't really the right question</h2>
        <p>The better question is: <em>which streams do I qualify for, and how much harder is the pathway given my age?</em></p>
        <ul>
          <li>For applicants in their <strong>20s to early 30s</strong>: age is your biggest asset. Average IELTS scores can still get you accepted directly as a PR.</li>
          <li>For applicants in their <strong>mid-30s to early 40s</strong>: age points start eroding. You'll need stronger language scores, more work experience, or a provincial nomination to compensate.</li>
          <li>For applicants in their <strong>mid-40s and beyond</strong>: direct PR streams become harder, but other pathways open up — work permits leading to PR, family sponsorship, business and entrepreneur streams, or a Canadian education followed by a study-to-PR transition.</li>
        </ul>

        <blockquote class="post-pullquote">
          Canada is a beautiful country, and if you're planning to immigrate — don't delay. The older you are, the fewer streams you have available.
        </blockquote>

        <h2>"I'm still busy with other things"</h2>
        <p>Every month you wait, you give up points you can't get back. Immigration applications take time — gathering documents, language tests, ECAs, government processing — six months to a year is typical. Waiting another year before starting means you're 18 to 24 months from landing, and your profile is weaker by then.</p>

        <h2>If you have life plans, just file</h2>
        <p>If you have life plans you're trying to align with, our advice is simple: lodge your application now. We'll take care of the file. Your future self will thank you for starting earlier rather than waiting for the "right time" that never quite arrives.</p>

        <div class="post-callout">
          <span class="post-callout__label">RCIC honest take</span>
          <p>We've had clients in their fifties land in Canada through alternate streams. The pathway gets narrower with age, but it rarely closes entirely. The real risk isn't being "too old" — it's running out of options before you decide to act.</p>
        </div>

        <h2>Get assessed</h2>
        <p>The only way to know what's possible for you, specifically, is a profile assessment. <a href="/pages/contact.html">Book a free 30-minute consultation</a> and we'll tell you honestly what your strongest path forward looks like — at any age.</p>`,
  },

  {
    slug: 'immigration-myths-busted',
    title: 'Common Canadian immigration myths, busted',
    headlineHtml: 'Common Canadian immigration <em>myths</em>, busted',
    description: '"Immigrants only get minimum-wage jobs." "Immigration is too expensive." "Newcomers are a drain on the economy." Three myths we hear weekly — and the honest truth.',
    shortDescription: 'Three myths we hear weekly — and the truth.',
    lede: "If you're planning to immigrate, study, or work in Canada, you'll inevitably encounter rumours and misinformation. Some are harmless. Others cost people real money and time.",
    category: 'Reflection',
    date: 'Nov 24, 2025',
    dateIso: '2025-11-24',
    dateReadable: 'Nov 24, 2025',
    readTime: '5 min read',
    photoSlug: 'immigration-myths',
    photoAlt: 'A woman reading a book at home, near a coffee table',
    photographer: 'Toa Heftiba',
    photoPageUrl: 'https://unsplash.com/photos/woman-sitting-on-rug-while-reading-book-near-coffee-table-lUx8JtwReV0',
    relatedSlugs: ['top-3-immigration-mistakes', 'when-hiring-a-consultant-pays-off'],
    body: `        <p>If you plan on immigrating to Canada, want to enroll in a Canadian university or college, or want to work in Canada, a knowledgeable immigration expert can add clarity to the process and help maximize your chances of success. A Canadian immigration consultant is a regulated, licensed professional who navigates the legal documentation and procedures that move you from your home country to Canada.</p>

        <p>In recent years, as immigration has reached record highs, misconceptions about the Canadian immigration process have spread alongside it. Many prospective migrants are unaware of the actual legal process, and they easily fall prey to myths shared online or by word of mouth. Some myths are harmless. Others cost people undue stress, time, and hard-earned resources.</p>

        <p>Here are three of the most common myths we hear at MVC Immigration Consulting — and the reality behind each.</p>

        <h2>Myth 1: Immigrants will be stuck with minimum-wage jobs in Canada</h2>
        <p>There is nothing wrong with minimum-wage work. We understand, though, that financial stability is a real concern for newcomers. The myth that all immigrants end up working low-wage jobs unsettles many of our clients — and it doesn't reflect what we see.</p>
        <p>Successful immigrants are working in every industry. Doctors, software engineers, financial analysts, entrepreneurs, tradespeople, executives. The opportunity is real; what determines outcomes is preparation: knowing how the Canadian labour market reads your credentials, understanding which industries are hiring in which provinces, and being strategic about where you start.</p>
        <p>At MVC, part of what we do is share insights and practical tips that have proven successful for clients navigating Canada's labour market — from credential recognition through to job-search strategy.</p>

        <h2>Myth 2: Immigration is too expensive</h2>
        <p>Many people assume immigrating to Canada is prohibitively expensive. It's not — but it does require investment, and it's worth seeing it as exactly that: an investment with long-term returns for you and the generations that follow.</p>
        <p>Immigration is about creating better opportunities for yourself and your family, alongside the experience of building a life in a generous, well-resourced first-world country. We offer fair pricing for all our services and installment options when needed. The fees you pay represent a fraction of what successful integration into Canada returns over a lifetime.</p>

        <blockquote class="post-pullquote">
          Mechanisms in Canada's immigration system exist precisely so that immigrants don't become a burden — they ensure newcomers arrive ready to contribute.
        </blockquote>

        <h2>Myth 3: Immigrants are a drain on the Canadian economy</h2>
        <p>This myth is corrosive — both to the immigration system itself and to the people it's directed at. It's also factually wrong.</p>
        <p>The Canadian government has built a careful set of standards to determine who receives permanent residence, study permits, work permits, and visitor visas. There's a financial component: applicants must demonstrate they can support themselves and their families during their stay or as they settle. Asset documentation from home countries is required. Most economic immigration programs require a defined level of education, work experience, and English or French proficiency.</p>
        <p>These mechanisms exist precisely so that newcomers arrive prepared to integrate — and statistically, they do. Canada's immigration system is designed to admit people who are well-positioned to contribute to the economy, and that's overwhelmingly what they end up doing.</p>

        <div class="post-callout">
          <span class="post-callout__label">RCIC honest take</span>
          <p>If you've encountered these myths from family, friends, or social media, get a regulated opinion before letting them shape your decision. Walking away from a strong immigration profile because of a rumour is one of the saddest stories we see.</p>
        </div>

        <h2>Get the regulated answer</h2>
        <p>If you're navigating myths and conflicting advice, that's exactly when a regulated consultant is most useful. As an RCIC firm in good standing with the College of Immigration and Citizenship Consultants (CICC), our team helps clients present themselves accurately on their applications and prove to the Canadian government that they'll be assets to the country.</p>
        <p>Our team is fluent in English, Spanish, Filipino, and Hebrew, and we have offices in Vancouver, British Columbia, and Cebu City, Philippines. <a href="/pages/contact.html">Book a free consultation</a> to get the truth about your specific situation.</p>`,
  },

  {
    slug: '77-jobs-that-fast-track-pr',
    title: '77 in-demand jobs that fast-track your PR application',
    headlineHtml: '77 in-demand jobs that <em>fast-track</em> your PR application',
    description: "British Columbia's PNP \"priority occupations\" list shaves months off processing times — sometimes down to roughly 3 months. Tech, healthcare, childcare, and the unexpected entries.",
    shortDescription: "British Columbia's PNP priority occupations list shaves months off processing times.",
    lede: 'Becoming a Canadian permanent resident has gotten harder over the past few years. But for the right occupations in the right province, processing times can drop to roughly three months.',
    category: 'Pathway Guide',
    date: 'Oct 30, 2025',
    dateIso: '2025-10-30',
    dateReadable: 'Oct 30, 2025',
    readTime: '7 min read',
    photoSlug: '77-jobs',
    photoAlt: 'A diverse team collaborating around a table in an office',
    photographer: 'Vitaly Gariev',
    photoPageUrl: 'https://unsplash.com/photos/diverse-team-collaborates-around-a-table-in-office-fm4B1xWEIsU',
    relatedSlugs: ['which-canadian-province-is-right', 'canadas-underrated-pathway'],
    body: `        <p>Becoming a permanent resident (PR) in Canada isn't as easy or as fast as it once was. Requirements have tightened across most federal streams. The British Columbia provincial government, however, has released 77 "priority occupations" that allow eligible candidates to become PRs significantly faster — processing times of roughly three months are common through this stream.</p>

        <p>BC continues to be one of the most attractive provinces for foreign workers, immigrants, and international students — not just for its mild climate and natural beauty, but because there are jobs available across nearly every industry sector.</p>

        <h2>How the BC PNP "priority" stream works</h2>
        <p>BC addresses labour shortages and economic development by helping employers hire foreign workers — both those already in Canada and those still in their home countries. For someone wanting to immigrate, working temporarily in Canada for at least one year (especially in a skilled position) can lead to permanent residency, provided the candidate meets the other eligibility requirements.</p>
        <p>The catch is that all PNP streams are competitive, with varying processing times. The "priority occupations" list within the BC PNP is meant to expedite candidates whose skills are in immediate demand — and the speed advantage is significant.</p>

        <blockquote class="post-pullquote">
          Working under one of these priority occupations can mean PR processing in roughly three months. That's faster than most people would believe is possible.
        </blockquote>

        <h2>What's on the priority list</h2>
        <p>The priority occupations under the BC PNP are concentrated in three areas: technology, healthcare, and childcare. There are also a few unexpected entries — veterinarians and animal-health technologists made the list. BC anticipates continued population and economic growth, and the province wants to ensure it has the workforce to support that growth.</p>

        <h3>Technology and managerial roles</h3>
        <ul>
          <li>10030 — Telecommunication carriers managers</li>
          <li>20012 — Computer and information systems managers</li>
          <li>21100 — Physicists and astronomers</li>
          <li>21210 — Mathematicians, statisticians and actuaries</li>
          <li>21211 — Data scientists</li>
          <li>21220 — Cybersecurity specialists</li>
          <li>21221 — Business systems specialists</li>
          <li>21222 — Information systems specialists</li>
          <li>21223 — Database analysts and data administrators</li>
          <li>21230 — Computer systems developers and programmers</li>
          <li>21231 — Software engineers and designers</li>
          <li>21232 — Software developers and programmers</li>
          <li>21233 — Web designers</li>
          <li>21234 — Web developers and programmers</li>
        </ul>

        <h3>Engineering</h3>
        <ul>
          <li>21300 — Civil engineers</li>
          <li>21301 — Mechanical engineers</li>
          <li>21310 — Electrical and electronics engineers</li>
          <li>21311 — Computer engineers (except software)</li>
          <li>21320 — Chemical engineers</li>
          <li>21399 — Other professional engineers</li>
          <li>22110 — Biological technologists and technicians</li>
          <li>22220 — Computer network and web technicians</li>
          <li>22221 — User support technicians</li>
          <li>22222 — Information systems testing technicians</li>
          <li>22310 — Electrical and electronics engineering technologists and technicians</li>
          <li>22312 — Industrial instrument technicians and mechanics</li>
        </ul>

        <h3>Media and creative</h3>
        <ul>
          <li>50011 — Managers — publishing, motion pictures, broadcasting and performing arts</li>
          <li>51111 — Authors and writers (except technical)</li>
          <li>51112 — Technical writers</li>
          <li>51120 — Producers, directors, choreographers and related occupations</li>
          <li>52119 — Other technical and coordinating occupations in motion pictures, broadcasting and the performing arts</li>
          <li>52112 — Broadcast technicians</li>
          <li>52113 — Audio and video recording technicians</li>
          <li>52120 — Graphic designers and illustrators</li>
          <li>53111 — Motion pictures, broadcasting, photography and performing arts assistants and operators</li>
        </ul>

        <h3>Healthcare</h3>
        <ul>
          <li>30010 — Managers in health care</li>
          <li>31100 — Specialists in clinical and laboratory medicine</li>
          <li>31101 — Specialists in surgery</li>
          <li>31102 — General practitioners and family physicians</li>
          <li>31110 — Dentists</li>
          <li>31112 — Audiologists and speech-language pathologists</li>
          <li>31120 — Pharmacists</li>
          <li>31121 — Dietitians and nutritionists</li>
          <li>31200 — Psychologists</li>
          <li>31201 — Chiropractors</li>
          <li>31202 — Physiotherapists</li>
          <li>31203 — Occupational therapists</li>
          <li>31204 — Kinesiologists and other professional occupations in therapy and assessment</li>
          <li>31209 — Other professional occupations in health diagnosing and treating</li>
          <li>31300 — Nursing coordinators and supervisors</li>
          <li>31301 — Registered nurses and registered psychiatric nurses</li>
          <li>31302 — Nurse practitioners</li>
          <li>31303 — Physician assistants, midwives and allied health professionals</li>
          <li>32101 — Licensed practical nurses</li>
          <li>32102 — Paramedical occupations</li>
          <li>32103 — Respiratory therapists, clinical perfusionists and cardiopulmonary technologists</li>
          <li>32109 — Other technical occupations in therapy and assessment</li>
          <li>32110 — Denturists</li>
          <li>32111 — Dental hygienists and dental therapists</li>
          <li>32112 — Dental technologists and technicians</li>
          <li>32120 — Medical laboratory technologists</li>
          <li>32121 — Medical radiation technologists</li>
          <li>32122 — Medical sonographers</li>
          <li>32123 — Cardiology technologists and electrophysiological diagnostic technologists</li>
          <li>32124 — Pharmacy technicians</li>
          <li>32129 — Other medical technologists and technicians</li>
          <li>32200 — Traditional Chinese medicine practitioners and acupuncturists</li>
          <li>33100 — Dental assistants and dental laboratory assistants</li>
          <li>33101 — Medical laboratory assistants and related technical occupations</li>
          <li>33102 — Nurse aides, orderlies and patient service associates</li>
          <li>33103 — Pharmacy technical assistants and pharmacy assistants</li>
        </ul>

        <h3>Social services and childcare</h3>
        <ul>
          <li>41300 — Social workers</li>
          <li>41301 — Therapists in counselling and related specialized therapies</li>
          <li>42201 — Social and community service workers</li>
          <li>42202 — Early childhood educators and assistants</li>
        </ul>

        <div class="post-callout">
          <span class="post-callout__label">RCIC honest take</span>
          <p>This list updates periodically as BC's labour-market needs shift. What's "priority" today may not be in twelve months. If you're already employed in one of these occupations and considering PR, the timing is in your favour right now — but don't sit on it.</p>
        </div>

        <h2>How to use this list</h2>
        <p>If you're a foreign national already working in Canada (or in your home country) in one of these occupations, the BC PNP priority stream may be the most direct route to PR available to you. We can help you assess your eligibility, prepare your file, and submit through this stream — for you and your immediate family.</p>
        <p>This pathway works best for those who have completed some education in Canada or in their home country and have a confirmed job offer from a BC-based employer. <a href="/pages/contact.html">Book a free consultation</a> and we'll assess whether this stream applies to you. Reference: <a href="https://www.welcomebc.ca/Immigrate-to-B-C/About-The-BC-PNP" rel="noopener">WelcomeBC's BC PNP overview</a>.</p>`,
  },

  {
    slug: 'canadas-underrated-pathway',
    title: "Canada's most underrated immigration pathway, explained",
    headlineHtml: "Canada's most <em>underrated</em> immigration pathway, explained",
    description: 'Most people don\'t realize a Canadian study permit is one of the surest routes to permanent residence. The numbers, the process, and why we recommend it for the right candidates.',
    shortDescription: 'Why a Canadian study permit is one of the surest routes to PR.',
    lede: 'Canada is home to some of the best universities, colleges, and learning institutions in the world. What most prospective applicants miss is how directly studying in Canada can lead to permanent residence.',
    category: 'Pathway Guide',
    date: 'Sep 19, 2025',
    dateIso: '2025-09-19',
    dateReadable: 'Sep 19, 2025',
    readTime: '5 min read',
    photoSlug: 'underrated-pathway',
    photoAlt: 'A student studying at a library with books — quiet, focused, building a future',
    photographer: 'Zoshua Colah',
    photoPageUrl: 'https://unsplash.com/photos/student-studies-at-a-library-with-books-klbApl9mxr0',
    relatedSlugs: ['77-jobs-that-fast-track-pr', 'which-canadian-province-is-right'],
    body: `        <p>Canada is home to some of the best universities, colleges, and other learning institutions in the world, which makes it one of the top destinations for international study. But beyond the education itself, studying in Canada opens up something most prospective applicants don't fully appreciate: a direct, predictable pathway to permanent residence.</p>

        <p>That's right — applying for a Canadian study permit doesn't just give you access to world-class education. It positions you as one of the most desirable categories of candidates in Canada's immigration system.</p>

        <h2>Why Canadian-educated applicants are favoured</h2>
        <p>From an immigration policy perspective, a Canadian-educated foreign national is a highly desirable candidate for permanent residence. The reason is straightforward: international students who've studied in Canada are already familiar with the Canadian education system, the workplace culture, and broader social norms. They tend to integrate smoothly — and the government knows it.</p>
        <p>This is why several streams (Canadian Experience Class, the Federal Skilled Worker programs, most Provincial Nominee Programs, the Post-Graduation Work Permit pathway) effectively reward Canadian study credentials with extra points or eligibility advantages.</p>

        <h2>You can work while you study</h2>
        <p>International students at designated learning institutions (DLIs) are typically allowed to work part-time during academic sessions and full-time during scheduled breaks between semesters. That isn't just a way to offset tuition — it's a way to start building Canadian work experience, which is one of the strongest signals on a future PR application.</p>

        <blockquote class="post-pullquote">
          Studying in Canada isn't just an education. It's a structured, well-trodden route to permanent residence — and most prospective applicants underestimate it.
        </blockquote>

        <h2>Who is the study permit pathway for?</h2>
        <p>This pathway works particularly well for:</p>
        <ul>
          <li>Young students starting their post-secondary education</li>
          <li>Working professionals who want to upgrade their credentials</li>
          <li>Mid-career applicants seeking specialized graduate or professional programs</li>
          <li>Anyone whose direct PR profile isn't quite competitive yet, but who has the means to invest in Canadian education</li>
        </ul>
        <p>The combination of Canadian study, Canadian work experience (during and after the program), and the resulting CRS bonuses on Express Entry can transform a marginal direct-PR profile into a strong one.</p>

        <h2>How to start</h2>
        <p>You begin by checking your eligibility. From there, the steps are:</p>
        <ol>
          <li>Identify a Designated Learning Institution (DLI) and program that fits your goals.</li>
          <li>Secure your acceptance letter.</li>
          <li>Arrange your finances — the cost of a study visa depends on the school and the province you choose, and you'll need to demonstrate funds for tuition plus living expenses for at least the first year.</li>
          <li>Submit your study permit application — through the SDS stream if you're eligible (faster), otherwise through the regular stream.</li>
          <li>Plan your post-graduation Work Permit (PGWP) and PR strategy <em>before</em> you start the program — not after.</li>
        </ol>

        <div class="post-callout">
          <span class="post-callout__label">RCIC honest take</span>
          <p>Not every program at every DLI leads to PGWP eligibility. Choose your school and program with PR in mind from day one — that means checking PGWP eligibility, program length, and credential type before you accept an offer. We've seen too many students realize, two years in, that their program doesn't qualify them for the work permit they were counting on.</p>
        </div>

        <h2>We'll help you choose the right institution</h2>
        <p>If you need help picking a reputable educational institution, we can provide you with a list of accredited colleges and universities that fit your budget and goals. We'll also walk you through the immigration steps that follow your studies, so the path from your acceptance letter through to your PR application is mapped out in advance.</p>
        <p>For more information about study permits and Canadian immigration programs, <a href="/pages/contact.html">book a free consultation</a>. We're an immigration consulting firm based in Vancouver, BC — we deliver professionalism, transparency, exceptional customer service, and competitive pricing, with up-to-date knowledge of Canadian immigration laws, regulations, and policies.</p>`,
  },
];

await mkdir(OUT_DIR, { recursive: true });

for (const p of posts) {
  const html = renderPost(p);
  const dest = join(OUT_DIR, `${p.slug}.html`);
  await writeFile(dest, html);
  console.log(`✓ wrote ${dest} (${(html.length / 1024).toFixed(0)} KB)`);
}

console.log(`\n${posts.length} posts generated.`);
