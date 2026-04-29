/* FAQ page category tabs. Accordion behavior is provided by homepage.js. */
(function () {
  'use strict';

  const tabs = document.querySelectorAll('.faq-tab');
  const groups = document.querySelectorAll('.faq-category');
  if (!tabs.length || !groups.length) return;

  function activate(category) {
    tabs.forEach((t) => {
      const isOn = t.dataset.category === category;
      t.classList.toggle('is-active', isOn);
      t.setAttribute('aria-selected', isOn ? 'true' : 'false');
    });
    groups.forEach((g) => {
      g.classList.toggle('is-active', g.dataset.category === category);
    });

    // Close any open accordion items in deactivated groups
    document.querySelectorAll('.faq-category:not(.is-active) .faq-item.is-open')
      .forEach((item) => {
        const btn = item.querySelector('.faq-q');
        const panel = item.querySelector('.faq-a');
        item.classList.remove('is-open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.style.maxHeight = '0px';
      });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;
      if (cat) activate(cat);
    });
  });
})();
