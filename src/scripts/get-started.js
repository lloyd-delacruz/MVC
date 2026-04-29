/* ===========================================================
   How to Get Started — Pathway Finder Quiz + Lead-Gen Form
   Vanilla JS. Submission opens user's email client (mailto).
   To switch to a form service later, replace `sendSubmission()`.
   =========================================================== */
(function () {
  'use strict';

  // --- CONFIG -------------------------------------------------
  // To swap mailto for a real form service (Formspree / FormSubmit / etc.)
  // change SUBMIT_MODE to 'fetch' and set SUBMIT_ENDPOINT below.
  const MVC_EMAIL = 'info@myvisa4canada.com';
  const SUBMIT_MODE = 'mailto';            // 'mailto' | 'fetch'
  const SUBMIT_ENDPOINT = '';              // e.g. 'https://formsubmit.co/info@myvisa4canada.com'
  // ------------------------------------------------------------

  const form = document.getElementById('gs-quiz-form');
  if (!form) return;

  const TOTAL_STEPS = 7;
  const stepEls = Array.from(form.querySelectorAll('.gs-step'));
  const resultEl = form.querySelector('.gs-result');
  const sentBanner = document.getElementById('gs-sent');
  const sentName = document.getElementById('gs-sent-name');
  const sentRetry = document.getElementById('gs-sent-retry');
  const progressBar = document.getElementById('gs-progress-bar');
  const stepCurrentEl = document.getElementById('gs-step-current');
  const backBtn = document.getElementById('gs-back');
  const continueBtn = document.getElementById('gs-continue');
  const continueLabel = document.getElementById('gs-continue-label');
  const continueArrow = continueBtn ? continueBtn.querySelector('.gs-btn__icon--arrow') : null;
  const continuePlane = continueBtn ? continueBtn.querySelector('.gs-btn__icon--plane') : null;
  const resetBtn = document.getElementById('gs-reset');
  const resultTitle = document.getElementById('gs-result-title');
  const resultLede = document.getElementById('gs-result-lede');
  const resultReasons = document.getElementById('gs-result-reasons');
  const resultLink = document.getElementById('gs-result-link');
  const countrySelect = document.getElementById('gs-country');

  const state = {
    step: 1,
    answers: {
      goal: null,
      country: null,
      age: null,
      education: null,
      experience: null,
      signals: []
    },
    contact: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    },
    matched: null      // cached pathway result so we can include it in the email
  };

  /* ---------- Human-readable label maps ---------- */
  const LABELS = {
    goal: {
      'work-permanent': 'Work permanently',
      'study': 'Study',
      'family': 'Reunite with family',
      'work-temporary': 'Work temporarily',
      'business': 'Start or invest in a business',
      'unsure': 'Not sure yet'
    },
    age: {
      'under-18': 'Under 18',
      '18-29': '18 – 29',
      '30-39': '30 – 39',
      '40-44': '40 – 44',
      '45-plus': '45 +'
    },
    education: {
      'high-school': 'High school',
      'diploma': 'Diploma or 1-year post-secondary',
      'bachelors': "Bachelor's degree",
      'masters': "Master's degree",
      'phd': 'PhD or doctorate',
      'trade': 'Trade certification'
    },
    experience: {
      'none': 'None',
      'under-1': 'Less than 1 year',
      '1-3': '1 – 3 years',
      '4-5': '4 – 5 years',
      '6-plus': '6 + years'
    },
    signals: {
      'job-offer': 'Has a job offer in Canada',
      'family-in-canada': 'Has spouse / partner / family who is a Canadian PR or citizen',
      'prior-canadian': 'Has previously studied or worked in Canada',
      'language': 'Speaks English or French fluently',
      'funds': 'Has CAD $13,757+ in settlement funds',
      'none-of-these': 'None of the above apply'
    }
  };

  function labelFor(field, value) {
    if (!value) return '(not answered)';
    return (LABELS[field] && LABELS[field][value]) || value;
  }

  function countryLabel() {
    if (!countrySelect) return '(not answered)';
    const opt = countrySelect.options[countrySelect.selectedIndex];
    return (opt && opt.value) ? opt.text : '(not answered)';
  }

  /* ---------- Pathway catalogue ---------- */
  const PATHWAYS = {
    cec: {
      name: 'Express Entry — Canadian Experience Class',
      lede: "You've already worked in Canada — that's gold. The Canadian Experience Class is the fastest federal pathway to permanent residence for people with at least one year of skilled Canadian work experience.",
      link: '/pages/pathways/canadian-experience-class.html'
    },
    fswp: {
      name: 'Express Entry — Federal Skilled Worker',
      lede: 'The Federal Skilled Worker Program is the main route into Express Entry for people without Canadian experience but with strong age, education, language, and foreign work history. Most invitations are issued within six months of profile submission.',
      link: '/pages/pathways/federal-skilled-worker.html'
    },
    fstp: {
      name: 'Express Entry — Federal Skilled Trades',
      lede: "Canada urgently needs skilled tradespeople. The Federal Skilled Trades Program is purpose-built for certified trades workers — and the bar is lower than the other Express Entry streams.",
      link: '/pages/pathways/federal-skilled-trades.html'
    },
    pnp: {
      name: 'Provincial Nominee Program (PNP)',
      lede: 'Each Canadian province runs its own immigration streams targeting the workers it needs. A provincial nomination adds a massive 600 points to an Express Entry profile — effectively a guaranteed invitation.',
      link: '/pages/pathways/provincial-nominee.html'
    },
    family: {
      name: 'Family & Spousal Sponsorship',
      lede: "If you have a spouse, partner, or close family member who's a Canadian citizen or permanent resident, sponsorship is often the most direct route. We help build the strongest possible relationship file.",
      link: '/pages/pathways/family-sponsorship.html'
    },
    study: {
      name: 'Study Permit Program',
      lede: "Studying in Canada opens doors — to a Post-Graduation Work Permit, then to PR through the Canadian Experience Class. We help you choose the right Designated Learning Institution and prepare a refusal-proof application.",
      link: '/pages/pathways/study-permits.html'
    },
    suv: {
      name: 'Start-Up Visa (Business Immigration)',
      lede: 'The Start-Up Visa Program targets entrepreneurs with an innovative business idea backed by a designated Canadian organization. Successful applicants and their families land as permanent residents.',
      link: '/pages/pathways/entrepreneur-base-category.html'
    },
    work: {
      name: 'Temporary Work Permit',
      lede: "A Canadian work permit lets you build experience that strengthens a future PR application. Most permits require an LMIA-supported job offer or fall under an LMIA-exempt category like the International Experience Canada program.",
      link: '/pages/pathways/work-permits.html'
    },
    consultation: {
      name: 'Personal RCIC Consultation',
      lede: "Your situation has competing signals — which is normal. A 30-minute consultation with our RCIC will sort through the options and recommend the strongest single pathway for you. There's no obligation and no charge.",
      link: '#consultation'
    }
  };

  /* ---------- Result computation ---------- */
  function computeResult() {
    const a = state.answers;
    const reasons = [];

    // Hard routes — goal-driven shortcuts.
    if (a.goal === 'study') {
      reasons.push('You told us studying in Canada is your goal.');
      if (a.age === '18-29' || a.age === '30-39') reasons.push("Your age is in the strong range for student visas and PGWP transitions to PR.");
      return { key: 'study', reasons };
    }
    if (a.goal === 'business') {
      reasons.push('You want to start or invest in a Canadian business.');
      if (a.education === 'bachelors' || a.education === 'masters' || a.education === 'phd') reasons.push('Your education level supports a Start-Up Visa application.');
      return { key: 'suv', reasons };
    }
    if (a.goal === 'family' || (a.signals && a.signals.includes('family-in-canada'))) {
      reasons.push("You have family in Canada — sponsorship is often the most direct route.");
      if (a.goal !== 'family') reasons.push("Even though family wasn't your stated goal, having a sponsor changes the math significantly.");
      return { key: 'family', reasons };
    }
    if (a.goal === 'work-temporary') {
      reasons.push("You're looking at a temporary work permit rather than permanent residence right now.");
      if (a.signals && a.signals.includes('job-offer')) reasons.push('You already have a job offer — likely the foundation for an LMIA-supported permit.');
      return { key: 'work', reasons };
    }

    // Permanent work — score the Express Entry / PNP variants.
    if (a.goal === 'work-permanent' || a.goal === 'unsure') {
      const has = (s) => a.signals && a.signals.includes(s);

      // Trades route — clear signal.
      if (a.education === 'trade' && (a.experience === '1-3' || a.experience === '4-5' || a.experience === '6-plus')) {
        reasons.push('Your trade certification is the strongest signal here.');
        reasons.push("You have the work experience the Federal Skilled Trades Program requires.");
        if (has('language')) reasons.push("Your language ability meets the FSTP minimum.");
        return { key: 'fstp', reasons };
      }

      // CEC — needs Canadian work experience.
      if (has('prior-canadian')) {
        reasons.push("You've previously studied or worked in Canada — that's the qualifying signal for the Canadian Experience Class.");
        if (has('language')) reasons.push("Your language ability supports a competitive CRS score.");
        if (a.age === '18-29' || a.age === '30-39') reasons.push("Your age range maximizes your CRS score.");
        return { key: 'cec', reasons };
      }

      // FSWP — score by points.
      let fswpScore = 0;
      const fswpReasons = [];
      if (a.age === '18-29') { fswpScore += 12; fswpReasons.push("You're in the maximum-points age band (18 – 29)."); }
      else if (a.age === '30-39') { fswpScore += 10; fswpReasons.push("You're in a strong age band (30 – 39)."); }
      else if (a.age === '40-44') { fswpScore += 5; fswpReasons.push("You're still inside the eligible age range."); }

      if (a.education === 'phd' || a.education === 'masters') { fswpScore += 25; fswpReasons.push("Your graduate-level education scores at the top end."); }
      else if (a.education === 'bachelors') { fswpScore += 21; fswpReasons.push("Your bachelor's degree scores well on the FSWP grid."); }
      else if (a.education === 'diploma') { fswpScore += 19; fswpReasons.push("Your post-secondary credential meets the FSWP minimum."); }

      if (a.experience === '6-plus') { fswpScore += 15; fswpReasons.push("Six-plus years of skilled work is the maximum-points band."); }
      else if (a.experience === '4-5') { fswpScore += 13; fswpReasons.push("Four to five years of skilled work scores strongly."); }
      else if (a.experience === '1-3') { fswpScore += 11; fswpReasons.push("You meet the FSWP minimum work-experience requirement."); }

      if (has('language')) { fswpScore += 24; fswpReasons.push("Fluent English or French is the largest single point category."); }
      if (has('job-offer')) { fswpScore += 10; fswpReasons.push("A Canadian job offer adds significant points."); }
      if (has('funds')) { fswpScore += 5; fswpReasons.push("Settlement funds are confirmed."); }

      if (fswpScore >= 67) {
        return { key: 'fswp', reasons: fswpReasons.slice(0, 4) };
      }

      // PNP — fallback for those who don't quite hit FSWP threshold but have something to lean on.
      if (a.age && a.education && (a.experience === '1-3' || a.experience === '4-5' || a.experience === '6-plus')) {
        reasons.push("Your federal score is borderline, but Provincial Nominee Programs target your profile.");
        reasons.push("Each province has its own list of in-demand occupations and lower thresholds.");
        if (a.country) reasons.push("We can identify which province best matches a candidate from your country.");
        return { key: 'pnp', reasons };
      }

      // Otherwise route to consultation.
      reasons.push("Your answers point to multiple possible pathways.");
      reasons.push('A free RCIC consultation is the cleanest way to identify the strongest option for you.');
      return { key: 'consultation', reasons };
    }

    // Default catch-all.
    reasons.push('Your situation needs a human review to identify the strongest pathway.');
    return { key: 'consultation', reasons };
  }

  /* ---------- Rendering ---------- */
  function showStep(n) {
    state.step = n;
    stepEls.forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.step) === n);
    });
    resultEl.classList.remove('is-active');
    if (sentBanner) sentBanner.hidden = true;
    form.classList.remove('is-complete');
    progressBar.style.width = (n / TOTAL_STEPS * 100) + '%';
    stepCurrentEl.textContent = String(n);

    backBtn.disabled = (n === 1);

    // Single Continue button: hidden on auto-advancing radio steps (1-5),
    // visible on step 6 (multi-select needs explicit continue) and step 7 (submit).
    // Label flips to "Send to MVC" only on the final step.
    if (n === 7) {
      continueBtn.hidden = false;
      continueLabel.textContent = 'Send to MVC';
      if (continueArrow) continueArrow.hidden = true;
      if (continuePlane) continuePlane.hidden = false;
    } else if (n === 6) {
      continueBtn.hidden = false;
      continueLabel.textContent = 'Continue';
      if (continueArrow) continueArrow.hidden = false;
      if (continuePlane) continuePlane.hidden = true;
    } else {
      continueBtn.hidden = true;
      continueLabel.textContent = 'Continue';
      if (continueArrow) continueArrow.hidden = false;
      if (continuePlane) continuePlane.hidden = true;
    }

    // Move focus where it serves the user best.
    const visibleStep = stepEls.find((el) => Number(el.dataset.step) === n);
    if (visibleStep) {
      // On the contact step, focus the first empty text input — feels like
      // the form is talking to them.
      if (n === 7) {
        const firstInput = visibleStep.querySelector('input.gs-input');
        if (firstInput) {
          firstInput.focus({ preventScroll: true });
          return;
        }
      }
      const legend = visibleStep.querySelector('.gs-step__legend');
      if (legend) {
        legend.setAttribute('tabindex', '-1');
        legend.focus({ preventScroll: true });
      }
    }
  }

  function computeAndCacheResult() {
    state.matched = computeResult();
    return state.matched;
  }

  function showResult({ submitted = false } = {}) {
    const { key, reasons } = state.matched || computeAndCacheResult();
    const pathway = PATHWAYS[key];

    resultTitle.textContent = pathway.name;
    resultLede.textContent = pathway.lede;
    resultLink.setAttribute('href', pathway.link);

    resultReasons.innerHTML = '';
    const safeReasons = reasons && reasons.length ? reasons : ['Based on your overall profile.'];
    safeReasons.forEach((r) => {
      const li = document.createElement('li');
      li.textContent = r;
      resultReasons.appendChild(li);
    });

    if (sentBanner) {
      sentBanner.hidden = !submitted;
      if (submitted && sentName) {
        const firstName = (state.contact.name || '').split(' ')[0] || 'there';
        sentName.textContent = firstName;
      }
    }

    stepEls.forEach((el) => el.classList.remove('is-active'));
    resultEl.classList.add('is-active');
    form.classList.add('is-complete');
    progressBar.style.width = '100%';

    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Email body builder + sender ---------- */
  function buildPayload() {
    const { name, email, phone, notes } = state.contact;
    const a = state.answers;
    const matched = state.matched || computeAndCacheResult();
    const pathway = PATHWAYS[matched.key];
    const signalsText = (a.signals && a.signals.length)
      ? a.signals.map((s) => '  • ' + labelFor('signals', s)).join('\n')
      : '  (none selected)';
    const reasonsText = (matched.reasons || [])
      .map((r) => '  • ' + r)
      .join('\n');

    const subject = `New pathway quiz: ${name || 'Visitor'} — ${pathway.name}`;

    const body =
`Hi MVC team,

A potential client just completed the Pathway Finder quiz on the website.

CONTACT
=======
Name:    ${name}
Email:   ${email}
Phone:   ${phone || '(not provided)'}

QUIZ ANSWERS
============
1. Main goal in Canada: ${labelFor('goal', a.goal)}
2. Country of citizenship: ${countryLabel()}
3. Age: ${labelFor('age', a.age)}
4. Highest education: ${labelFor('education', a.education)}
5. Skilled work experience: ${labelFor('experience', a.experience)}
6. Additional signals:
${signalsText}

SUGGESTED PATHWAY MATCH
=======================
${pathway.name}

Why this pathway was suggested:
${reasonsText}

ADDITIONAL NOTES FROM CLIENT
============================
${notes || '(none)'}

—
Sent automatically from the How To Get Started page.
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
`;

    return { subject, body, name, email, phone, notes, pathway: pathway.name };
  }

  function sendSubmission() {
    const payload = buildPayload();

    if (SUBMIT_MODE === 'fetch' && SUBMIT_ENDPOINT) {
      // Form-service mode (Formspree / FormSubmit / etc.) — kept for future use.
      const fd = new FormData();
      fd.append('name', payload.name);
      fd.append('email', payload.email);
      fd.append('phone', payload.phone);
      fd.append('subject', payload.subject);
      fd.append('message', payload.body);
      return fetch(SUBMIT_ENDPOINT, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
        .then(() => ({ ok: true, mode: 'fetch' }))
        .catch(() => ({ ok: false, mode: 'fetch' }));
    }

    // Default: open the user's email client with the message pre-filled.
    const url = 'mailto:' + encodeURIComponent(MVC_EMAIL)
      + '?subject=' + encodeURIComponent(payload.subject)
      + '&body=' + encodeURIComponent(payload.body);
    window.location.href = url;
    return Promise.resolve({ ok: true, mode: 'mailto', url });
  }

  /* ---------- Validation ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateContact() {
    const fields = [
      { id: 'gs-contact-name',  required: true,  test: (v) => v.trim().length >= 2 },
      { id: 'gs-contact-email', required: true,  test: (v) => EMAIL_RE.test(v.trim()) }
    ];
    let firstInvalid = null;
    fields.forEach(({ id, test }) => {
      const input = document.getElementById(id);
      const wrapper = input.closest('.gs-field');
      const ok = test(input.value);
      wrapper.classList.toggle('is-invalid', !ok);
      const err = wrapper.querySelector('.gs-field__error');
      if (err) err.hidden = ok;
      if (!ok && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  /* ---------- Event handlers ---------- */
  form.addEventListener('input', (e) => {
    // Track contact fields as they're typed so state stays current.
    const t = e.target;
    if (!(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) return;
    if (t.name === 'contact-name')  state.contact.name = t.value;
    if (t.name === 'contact-email') state.contact.email = t.value;
    if (t.name === 'contact-phone') state.contact.phone = t.value;
    if (t.name === 'contact-notes') state.contact.notes = t.value;
    // Live-clear validation styling once the user types again.
    if (t.classList.contains('gs-input')) {
      const wrapper = t.closest('.gs-field');
      if (wrapper && wrapper.classList.contains('is-invalid')) {
        wrapper.classList.remove('is-invalid');
        const err = wrapper.querySelector('.gs-field__error');
        if (err) err.hidden = true;
      }
    }
  });

  form.addEventListener('change', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;

    if (target.name === 'goal') {
      state.answers.goal = target.value;
      autoAdvance(2);
    } else if (target.name === 'country') {
      state.answers.country = target.value;
      if (target.value) autoAdvance(3);
    } else if (target.name === 'age') {
      state.answers.age = target.value;
      autoAdvance(4);
    } else if (target.name === 'education') {
      state.answers.education = target.value;
      autoAdvance(5);
    } else if (target.name === 'experience') {
      state.answers.experience = target.value;
      autoAdvance(6);
    } else if (target.name === 'signals') {
      const v = target.value;
      // "none-of-these" is exclusive
      if (v === 'none-of-these' && target.checked) {
        state.answers.signals = ['none-of-these'];
        Array.from(form.querySelectorAll('input[name="signals"]')).forEach((cb) => {
          if (cb !== target) cb.checked = false;
        });
      } else {
        if (target.checked) {
          state.answers.signals = state.answers.signals.filter((x) => x !== 'none-of-these');
          if (!state.answers.signals.includes(v)) state.answers.signals.push(v);
          const noneCb = form.querySelector('input[name="signals"][value="none-of-these"]');
          if (noneCb) noneCb.checked = false;
        } else {
          state.answers.signals = state.answers.signals.filter((x) => x !== v);
        }
      }
    }
  });

  function autoAdvance(toStep) {
    setTimeout(() => showStep(toStep), 220);
  }

  backBtn.addEventListener('click', () => {
    if (state.step > 1) showStep(state.step - 1);
  });

  // Single Continue handler — branches on current step.
  function handleContinue(e) {
    if (e) e.preventDefault();
    if (state.step === 6) {
      if (state.answers.signals.length === 0) {
        const noneCb = form.querySelector('input[name="signals"][value="none-of-these"]');
        if (noneCb) { noneCb.checked = true; state.answers.signals = ['none-of-these']; }
      }
      computeAndCacheResult();   // cache so the email body has the match ready
      showStep(7);
      return;
    }
    if (state.step === 7) {
      if (!validateContact()) return;
      sendSubmission();
      showResult({ submitted: true });
      return;
    }
  }
  continueBtn.addEventListener('click', handleContinue);
  form.addEventListener('submit', handleContinue);
  // Keep handleSubmit as an alias used by the keydown handler below.
  const handleSubmit = handleContinue;

  // Re-trigger mailto if the user's email client didn't open the first time.
  if (sentRetry) {
    sentRetry.addEventListener('click', (e) => {
      e.preventDefault();
      sendSubmission();
    });
  }

  // Pressing Enter in any contact text input should submit (textarea allows newlines).
  form.addEventListener('keydown', (e) => {
    if (state.step !== 7) return;
    if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') {
      e.preventDefault();
      handleSubmit();
    }
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    state.answers = { goal: null, country: null, age: null, education: null, experience: null, signals: [] };
    state.contact = { name: '', email: '', phone: '', notes: '' };
    state.matched = null;
    // Clear any leftover validation styling.
    document.querySelectorAll('.gs-field.is-invalid').forEach((el) => {
      el.classList.remove('is-invalid');
      const err = el.querySelector('.gs-field__error');
      if (err) err.hidden = true;
    });
    showStep(1);
    document.getElementById('pathway-quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Initialize
  showStep(1);

  /* ===========================================================
     Hero — word rotator
     =========================================================== */
  (function initRotator() {
    const words = document.querySelectorAll('.gs-rotator__word');
    if (words.length < 2) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let i = 0;
    setInterval(() => {
      const current = words[i];
      const nextIdx = (i + 1) % words.length;
      const next = words[nextIdx];
      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      next.classList.add('is-active');
      setTimeout(() => current.classList.remove('is-leaving'), 600);
      i = nextIdx;
    }, 2200);
  })();

  /* ===========================================================
     Hero — animated stat counters
     =========================================================== */
  (function initCounters() {
    const counters = document.querySelectorAll('.gs-counter');
    if (!counters.length) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = (el) => {
      const target = Number(el.dataset.countTo || '0');
      const suffix = el.dataset.countSuffix || '';
      if (reduced) { el.textContent = target + suffix; return; }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + (t === 1 ? suffix : '');
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((c) => io.observe(c));
  })();

  /* ===========================================================
     Hero — Quick Start pills (pre-fill quiz, scroll, advance)
     =========================================================== */
  (function initQuickStart() {
    const pills = document.querySelectorAll('.gs-pill[data-goal]');
    if (!pills.length) return;
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const goal = pill.dataset.goal;
        if (!goal) return;

        // Pre-select the matching radio in step 1.
        const radio = form.querySelector(`input[name="goal"][value="${goal}"]`);
        if (radio) {
          radio.checked = true;
          state.answers.goal = goal;
        }

        // Smooth scroll to quiz section.
        const target = document.getElementById('pathway-quiz');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Advance past step 1 since the user already answered it.
        // For "unsure" we keep them on step 1 to read the question and confirm.
        if (goal !== 'unsure') {
          setTimeout(() => showStep(2), 600);
        } else {
          setTimeout(() => showStep(1), 600);
        }
      });
    });
  })();
})();
