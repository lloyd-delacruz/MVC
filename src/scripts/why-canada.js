(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1) Hero rotating word
     ============================================================ */
  const rotator = document.querySelector('[data-rotator-word]');
  if (rotator) {
    const words = ['belonging', 'opportunity', 'hope', 'family', 'home', 'freedom'];
    let i = 0;

    if (reduceMotion) {
      // pick the first word and stop
      rotator.textContent = words[0];
    } else {
      const cycle = () => {
        rotator.classList.add('is-leaving');
        setTimeout(() => {
          i = (i + 1) % words.length;
          rotator.textContent = words[i];
          rotator.classList.remove('is-leaving');
          rotator.classList.add('is-entering');
          // allow paint, then drop the entering class
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              rotator.classList.remove('is-entering');
            });
          });
        }, 350);
      };
      setInterval(cycle, 2600);
    }
  }

  /* ============================================================
     2) Stats counter (IntersectionObserver-driven count-up)
     ============================================================ */
  const counters = document.querySelectorAll('[data-count-target]');
  if (counters.length) {
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (el) => {
      const target = parseFloat(el.dataset.countTarget) || 0;
      const prefix = el.dataset.countPrefix || '';
      const suffix = el.dataset.countSuffix || '';
      const fmt = el.dataset.countFormat || '';
      const duration = 1600;
      const start = performance.now();

      const formatNum = (n) => {
        if (fmt === 'comma') return Math.round(n).toLocaleString('en-CA');
        return Math.round(n).toString();
      };

      if (reduceMotion) {
        el.textContent = `${prefix}${formatNum(target)}${suffix}`;
        return;
      }

      // Reset to 0 just before animating so the count-up reads naturally.
      el.textContent = `${prefix}${formatNum(0)}${suffix}`;

      const tick = (now) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(t);
        el.textContent = `${prefix}${formatNum(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = `${prefix}${formatNum(target)}${suffix}`;
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });
      counters.forEach((el) => io.observe(el));
    } else {
      counters.forEach(animate);
    }
  }

  /* ============================================================
     3) "What matters most" chip selector
     ============================================================ */
  const chips = document.querySelectorAll('[data-matter]');
  const panels = document.querySelectorAll('[data-matter-panel]');
  if (chips.length && panels.length) {
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const key = chip.dataset.matter;
        chips.forEach((c) => {
          const on = c === chip;
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-selected', String(on));
        });
        panels.forEach((p) => {
          p.classList.toggle('is-active', p.dataset.matterPanel === key);
        });
      });
    });
  }

  /* ============================================================
     4) Region map hotspots
     ============================================================ */
  const hotspots = document.querySelectorAll('[data-region]');
  const regions  = document.querySelectorAll('[data-region-panel]');
  if (hotspots.length && regions.length) {
    hotspots.forEach((spot) => {
      spot.addEventListener('click', () => {
        const key = spot.dataset.region;
        hotspots.forEach((s) => s.classList.toggle('is-active', s === spot));
        regions.forEach((r) => r.classList.toggle('is-active', r.dataset.regionPanel === key));
      });
    });
  }

  /* ============================================================
     5) Seasons tabs
     ============================================================ */
  const seasonTabs   = document.querySelectorAll('[data-season]');
  const seasonPanels = document.querySelectorAll('[data-season-panel]');
  if (seasonTabs.length && seasonPanels.length) {
    seasonTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.season;
        seasonTabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', String(on));
        });
        seasonPanels.forEach((p) => {
          p.classList.toggle('is-active', p.dataset.seasonPanel === key);
        });
      });
    });
  }

  /* ============================================================
     6) Fact flip cards — also support tap on touch devices
        (CSS already handles hover/focus)
     ============================================================ */
  const facts = document.querySelectorAll('.wc-fact');
  if (facts.length) {
    facts.forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
      });
    });
  }
})();
