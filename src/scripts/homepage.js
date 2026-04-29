/* FAQ accordion — single-open. Animates max-height for smooth open/close. */
(function () {
  'use strict';

  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  function close(item) {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    item.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.style.maxHeight = '0px';
  }

  function open(item) {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    item.classList.add('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
  }

  items.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach((other) => { if (other !== item) close(other); });
      if (isOpen) close(item); else open(item);
    });
  });

  // Recalculate any open panel on resize so wrap changes don't clip text.
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      items.forEach((item) => {
        if (item.classList.contains('is-open')) {
          const panel = item.querySelector('.faq-a');
          if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }, 120);
  });
})();
