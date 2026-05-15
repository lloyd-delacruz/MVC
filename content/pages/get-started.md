---
title: "How to Immigrate to Canada — Find Your Pathway"
slug: get-started
---

# Hero
eyebrow: "RCIC · Regulated Canadian Immigration Consultant"
title: "Your path to {work | study | family | business | a new life} in Canada — guided with care."
title_rotator_words:
  - "work"
  - "study"
  - "family"
  - "business"
  - "a new life"
lede: "Answer six quick questions and share where to send your match — our RCIC team replies within 1 business day. Always free."
quick_start:
  label: "Quick start — what's your main goal?"
  pills:
    - { value: "work-permanent", label: "Work permanently" }
    - { value: "study", label: "Study" }
    - { value: "family", label: "Reunite with family" }
    - { value: "business", label: "Start a business" }
    - { value: "unsure", label: "Not sure yet" }
trust_stats:
  - { number: "500+", label: "Cases approved" }
  - { number: "13+", label: "Years guiding clients" }
  - { number: "CICC", label: "Registered RCIC" }

# Section: Pathway Finder Quiz
eyebrow: "Pathway Finder"
heading: "Six questions, then a real reply from an RCIC."
lede: "Built by a Regulated Canadian Immigration Consultant. When you submit, your answers go straight from your inbox to ours — no third-party trackers, no data brokers."
progress:
  total_steps: 7
quiz:
  - step: 1
    type: "radio"
    question: "What's your main goal in Canada?"
    hint: "Pick the one that's closest — we'll refine from there."
    name: "goal"
    options:
      - { value: "work-permanent", title: "Work permanently", sub: "I want to live and work in Canada long-term" }
      - { value: "study", title: "Study", sub: "I want to attend a Canadian college or university" }
      - { value: "family", title: "Reunite with family", sub: "I have a spouse, partner, or family in Canada" }
      - { value: "work-temporary", title: "Work temporarily", sub: "I'm coming for a defined job or work period" }
      - { value: "business", title: "Start or invest in a business", sub: "I want to launch or run a Canadian business" }
      - { value: "unsure", title: "Not sure yet", sub: "I'd like a recommendation based on my situation" }

  - step: 2
    type: "select"
    question: "What's your country of citizenship?"
    hint: "Some pathways depend on visa requirements between Canada and your home country."
    name: "country"
    label: "Country"
    placeholder: "Choose a country…"
    options: "Full ISO country list (Afghanistan through Zimbabwe)"

  - step: 3
    type: "radio"
    question: "How old are you?"
    hint: "Age affects scoring on most economic immigration pathways."
    name: "age"
    options:
      - { value: "under-18", title: "Under 18" }
      - { value: "18-29", title: "18 – 29" }
      - { value: "30-39", title: "30 – 39" }
      - { value: "40-44", title: "40 – 44" }
      - { value: "45-plus", title: "45 +" }

  - step: 4
    type: "radio"
    question: "What's the highest education you've completed?"
    hint: "Foreign credentials are usually assessed by an ECA — we'll handle that step later."
    name: "education"
    options:
      - { value: "high-school", title: "High school" }
      - { value: "diploma", title: "Diploma or 1-year post-secondary" }
      - { value: "bachelors", title: "Bachelor's degree" }
      - { value: "masters", title: "Master's degree" }
      - { value: "phd", title: "PhD or doctorate" }
      - { value: "trade", title: "Trade certification" }

  - step: 5
    type: "radio"
    question: "How many years of skilled work experience do you have?"
    hint: "\"Skilled\" means TEER 0, 1, 2, or 3 occupations under Canada's NOC system. Don't worry — we'll verify with you."
    name: "experience"
    options:
      - { value: "none", title: "None" }
      - { value: "under-1", title: "Less than 1 year" }
      - { value: "1-3", title: "1 – 3 years" }
      - { value: "4-5", title: "4 – 5 years" }
      - { value: "6-plus", title: "6 + years" }

  - step: 6
    type: "checkbox"
    question: "Do any of these apply to you?"
    hint: "Select all that apply. Each one strengthens your case."
    name: "signals"
    options:
      - { value: "job-offer", title: "I have a job offer in Canada" }
      - { value: "family-in-canada", title: "I have a spouse, partner, or close family who's a Canadian PR or citizen" }
      - { value: "prior-canadian", title: "I've previously studied or worked in Canada" }
      - { value: "language", title: "I speak English or French fluently" }
      - { value: "funds", title: "I have CAD $13,757 or more in settlement funds" }
      - { value: "none-of-these", title: "None of these apply right now" }

  - step: 7
    type: "contact"
    question: "Last step — where should we send your match?"
    hint: "We'll email your pathway recommendation along with your answers to our RCIC team. Reply within 1 business day."
    hint_meta: "No spam. We only contact you about your file."
    fields:
      - { name: "contact-name", label: "Your name", type: "text", required: true, placeholder: "e.g. Maria Santos", autocomplete: "name" }
      - { name: "contact-email", label: "Email address", type: "email", required: true, placeholder: "you@example.com", autocomplete: "email" }
      - { name: "contact-phone", label: "Phone or WhatsApp", type: "tel", required: false, placeholder: "+1 778 288 7388", autocomplete: "tel", optional_label: "optional" }
      - { name: "contact-notes", label: "Anything else we should know?", type: "textarea", rows: 3, required: false, placeholder: "e.g. I'm currently in Canada on a study permit, my spouse will accompany me, I prefer being contacted in Spanish…", optional_label: "optional" }
    privacy: "Your details go directly from your inbox to ours. [Read our privacy policy](/privacy)."

result:
  sent_message: "Thanks {name} — your email window is open. Click *Send* in your email app to deliver your answers to MVC. We'll reply within 1 business day."
  retry_label: "Didn't open? Click here to try again."
  eyebrow: "Your strongest pathway"
  example_title: "Express Entry — Canadian Experience Class"
  why_heading: "Why this fits you"
  ctas:
    - { label: "Book a Free Consultation", href: "#consultation" }
    - { label: "See full pathway details", href: "#" }
  disclaimer: |
    **This is informational guidance — not a binding eligibility decision.**
    Immigration cases are unique. Your free 30-minute consultation gives you
    an RCIC's formal opinion on your situation. We never guarantee immigration
    outcomes.
  reset_label: "↺ Take the quiz again"

controls:
  back_label: "← Back"
  continue_label: "Continue"

# Section: Editorial Divider
content: |
  Whatever pathway fits — *here's what working with us actually looks like,*
  from your first call to your landing in Canada.

# Section: The Five-Step Process
eyebrow: "The Five-Step Process"
heading: "No surprises. Just steps."
lede: "Click any step to expand. Step 1 is open by default — that's where every client journey begins."
steps:
  - num: "01"
    title: "Book your free consultation"
    body: |
      A 30-minute call with a Regulated Canadian Immigration Consultant.
      No obligation, no sales pressure. We listen to your goals, ask about
      your situation, and give you our honest read on whether — and how —
      we can help.
    you_do: "Book a time. Tell us a little about your situation in the booking form so we can prepare."
    we_do: "Review your situation in advance. Walk you through the relevant pathways. Answer every question."
  - num: "02"
    title: "Eligibility assessment & pathway selection"
    body: |
      A formal RCIC review of your case. You receive a written
      recommendation outlining your strongest pathway, alternative options,
      realistic timelines, and what each will cost. This is where uncertainty
      ends and your plan begins.
    you_do: "Provide documents we ask for — passport scans, prior visa records, education credentials, work history."
    we_do: "Score your case against IRCC eligibility rules. Deliver a written pathway recommendation."
  - num: "03"
    title: "Document preparation"
    body: |
      A checklist tailored to your pathway. We review every document
      before submission — language tests, Educational Credential Assessment
      (ECA), employment letters, civil documents, police certificates.
      Quality of evidence is the single biggest predictor of approval.
    you_do: "Take your IELTS / CELPIP / TEF. Gather employment letters, references, and civil documents."
    we_do: "Review every document. Fix wording in employment letters. Catch issues before IRCC sees them."
  - num: "04"
    title: "Application submission & monitoring"
    body: |
      We file with IRCC on your behalf and track every status change.
      If IRCC requests additional documents or sends a procedural fairness
      letter, we draft the response. You'll always know where your file
      stands — no guessing, no portal anxiety.
    you_do: "Stay reachable. Respond promptly when we need a signature, biometrics, or a medical exam."
    we_do: "Submit through the official IRCC portal. Track status. Respond to every IRCC request on your behalf."
  - num: "05"
    title: "Decision & landing support"
    body: |
      Approval letter in hand — now what? We walk you through PR landing
      or visa activation, and connect you with settlement resources: bank
      accounts, healthcare enrolment, SIN application, school registration.
      The work doesn't end at approval. The work ends when you're settled.
    you_do: "Travel to Canada. Activate your status. Bring the documents we list for landing."
    we_do: "Prepare your landing checklist. Stay reachable for questions during your first months in Canada."

# Section: What you'll need
eyebrow: "Start gathering these now"
heading: "What you'll need (eventually)."
lede: "You don't need everything to book a consultation — but the more of these you have ready, the faster we can move."
checklist:
  - title: "Valid passport"
    description: "Not expiring within 6 months of intended travel."
  - title: "Language test results"
    description: "IELTS General, CELPIP, or TEF Canada — required for Express Entry and many other pathways."
  - title: "Educational Credential Assessment (ECA)"
    description: "Required if your degree is from outside Canada. We help you choose the right designated organization."
  - title: "Employment reference letters"
    description: "Showing job duties, dates of employment, salary, and hours per week — not just titles."
  - title: "Civil documents"
    description: "Birth, marriage, and police certificates from every country lived in for 6+ months since age 18."
  - title: "Proof of settlement funds"
    description: "Bank statements showing the funds required for your family size (CAD $13,757+ for a single applicant)."
  - title: "Medical exam"
    description: "Done by a panel physician approved by IRCC. Only required when IRCC asks — usually after invitation."
note: |
  Don't worry about gathering everything at once — we walk through this list
  with you in [step 3](#process-title).

# Section: Bottom CTA
heading: "Ready to start your journey?"
content: "Book a free 30-minute consultation — no obligation."
cta:
  label: "Book a Free Consultation"
  href: "/pages/contact.html"
