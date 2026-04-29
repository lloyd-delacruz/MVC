(function () {
  'use strict';

  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const hamburger = nav.querySelector('.site-nav__hamburger');
  const overlay = nav.querySelector('.site-nav__overlay');
  // Only true links should close the menu — toggle buttons must not.
  const overlayLinks = nav.querySelectorAll(
    '.site-nav__overlay-links a, .site-nav__overlay-cta'
  );
  const body = document.body;

  /* ----- scroll → toggle is-scrolled ----- */
  let lastY = -1;
  let ticking = false;
  function readScroll() {
    const y = window.scrollY || window.pageYOffset || 0;
    if (y !== lastY) {
      lastY = y;
      nav.classList.toggle('is-scrolled', y > 20);
    }
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(readScroll);
      ticking = true;
    }
  }
  readScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- mobile menu ----- */
  function setMenu(open) {
    nav.classList.toggle('is-menu-open', open);
    body.classList.toggle('is-menu-open', open);
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (overlay) overlay.setAttribute('aria-hidden', String(!open));
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      setMenu(!nav.classList.contains('is-menu-open'));
    });
  }

  overlayLinks.forEach((a) => a.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-menu-open')) {
      setMenu(false);
      if (hamburger) hamburger.focus();
    }
  });

  /* close menu if viewport grows past mobile breakpoint */
  const mql = window.matchMedia('(min-width: 1280px)');
  const onMQ = (e) => { if (e.matches) setMenu(false); };
  if (mql.addEventListener) mql.addEventListener('change', onMQ);
  else if (mql.addListener) mql.addListener(onMQ);

  /* ----- desktop dropdown groups ----- */
  const groups = nav.querySelectorAll('[data-menu]');

  function closeAllGroups(except) {
    groups.forEach((g) => {
      if (g === except) return;
      g.classList.remove('is-open');
      const trigger = g.querySelector('.site-nav__link--menu');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  groups.forEach((group) => {
    const trigger = group.querySelector('.site-nav__link--menu');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !group.classList.contains('is-open');
      closeAllGroups(group);
      group.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-menu]')) closeAllGroups(null);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openGroup = nav.querySelector('[data-menu].is-open');
      if (openGroup) {
        closeAllGroups(null);
        const trigger = openGroup.querySelector('.site-nav__link--menu');
        if (trigger) trigger.focus();
      }
    }
  });

  /* ----- mobile overlay collapsible groups ----- */
  const overlayGroups = nav.querySelectorAll('[data-overlay-menu]');
  overlayGroups.forEach((group) => {
    const toggle = group.querySelector(':scope > .site-nav__overlay-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const open = !group.classList.contains('is-open');
      group.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });

  /* ----- mobile overlay nested groups (e.g. Express Entry streams) ----- */
  const overlaySubgroups = nav.querySelectorAll('[data-overlay-submenu]');
  overlaySubgroups.forEach((group) => {
    const toggle = group.querySelector('.site-nav__overlay-subtoggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !group.classList.contains('is-open');
      group.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });

  /* ----- desktop nested submenu (Express Entry → streams) ----- */
  const subgroups = nav.querySelectorAll('[data-subgroup]');
  subgroups.forEach((sg) => {
    const trig = sg.querySelector('.site-nav__sublink--menu');
    if (!trig) return;
    trig.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = !sg.classList.contains('is-open');
      sg.classList.toggle('is-open', open);
      trig.setAttribute('aria-expanded', String(open));
    });
  });
})();
