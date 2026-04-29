/* Filter pills for success-stories. Single-active. Uses [hidden] for accessibility. */
(function () {
  'use strict';

  const buttons = document.querySelectorAll('.stories-filter__btn');
  const cards = document.querySelectorAll('.story-card');
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    cards.forEach((card) => {
      const cardPathway = card.dataset.pathway || '';
      const match = filter === 'all' || cardPathway === filter;
      if (match) {
        card.removeAttribute('hidden');
      } else {
        card.setAttribute('hidden', '');
      }
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'all';
      buttons.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      applyFilter(filter);
    });
  });
})();
