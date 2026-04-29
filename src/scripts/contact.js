/* Contact form: HTML5 validation + JS-driven success state. No backend. */
(function () {
  'use strict';

  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.classList.add('is-submitted');
    const success = form.parentElement?.querySelector('.contact-success');
    if (success) {
      success.setAttribute('tabindex', '-1');
      success.focus({ preventScroll: false });
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
