---
title: "Contact MVC Immigration"
slug: contact
---

# Hero
eyebrow: "Get in Touch"
title: "Let's talk about your situation"
lede: "The first step is a conversation — no paperwork, no commitment, no sales pitch."

# Section: Send us a message (Form)
heading: "Send us a message"
lede: "Tell us a little about your situation. We usually respond within 1 business day."
form:
  fields:
    - label: "Full Name"
      name: "name"
      type: "text"
      required: true
      autocomplete: "name"
    - label: "Email Address"
      name: "email"
      type: "email"
      required: true
      autocomplete: "email"
    - label: "Phone Number"
      name: "phone"
      type: "tel"
      required: false
      autocomplete: "tel"
      placeholder: "+1 (___) ___-____"
    - label: "Country You're Applying From"
      name: "country"
      type: "text"
      required: false
      autocomplete: "country-name"
    - label: "Pathway You're Interested In"
      name: "pathway"
      type: "select"
      required: false
      options:
        - { value: "", label: "Select a pathway…" }
        - { value: "express-entry", label: "Express Entry" }
        - { value: "provincial-nominee", label: "Provincial Nominee Program" }
        - { value: "family-sponsorship", label: "Family Sponsorship" }
        - { value: "work-permit", label: "Work Permit" }
        - { value: "study-permit", label: "Study Permit" }
        - { value: "visitor-visa", label: "Visitor Visa" }
        - { value: "not-sure", label: "Not sure yet" }
    - label: "Message"
      name: "message"
      type: "textarea"
      rows: 5
      placeholder: "Briefly describe your situation, timeline, and any specific questions."
  submit_label: "Send Message"
  privacy: |
    Your information is kept confidential and used only to respond to your inquiry.
    We do not share your data with third parties. See our [Privacy Policy](/privacy).
success:
  title: "Thank you — message received."
  body: |
    We've got your note and a regulated consultant will be in touch within
    1 business day. If your matter is urgent, please call us directly during
    office hours.

# Section: Visit, call, or write
heading: "Visit, call, or write"
details:
  - label: "Canada Office"
    value: |
      Suite 900 – 2025 Willingdon Avenue
      Burnaby, BC V5C 0J3
      Canada
      +1 778 288 7388
  - label: "Philippines Office"
    value: |
      Unit 610B Oakridge IT Centre 2
      880 A.S. Fortuna St., Mandaue City
      Cebu 6014, Philippines
      +63 917 794 9960 (Mobile / WhatsApp)
      +63 939 922 4533 (Mobile)
      +63 32 253 0843 (Landline)
  - label: "Email"
    value: "info@myvisa4canada.com"
  - label: "Hours"
    value: |
      9:00am – 5:00pm
      By appointment only
  - label: "Languages"
    value: "English, Spanish, Filipino, Hebrew"
maps:
  - label: "Canada · Burnaby, BC"
    address: "2025 Willingdon Avenue, Burnaby, BC V5C 0J3, Canada"
  - label: "Philippines · Mandaue City, Cebu"
    address: "Oakridge IT Centre 2, 880 A.S. Fortuna St, Mandaue City, Cebu, Philippines"

# Section: Book a 1:1 consultation
eyebrow: "Book a 1:1 consultation"
heading: "Schedule with your RCIC."
lede: "For specific case questions and a binding RCIC opinion, book a paid 1:1 consultation. Pick the format that fits your situation."
booking_card:
  brand_name: "MVC Immigration Consulting"
  brand_sub: "Regulated Canadian Immigration Consultants"
  welcome: "Welcome — please pick the consultation type that fits your situation and we'll add it to your calendar."
  options:
    - title: "MVC 1:1 Virtual Consultation"
      price: "$250 CAD"
      description: "Talk to a Regulated Canadian Immigration Consultant online (Zoom or Google Meet) and discuss your immigration plan or ask specific case-related questions. 60 minutes. Notes & next steps emailed afterwards."
      href: "https://calendly.com/REPLACE-WITH-MVC-CALENDLY/virtual-consultation"
    - title: "MVC 1:1 In-Office Consultation"
      price: "$350 CAD"
      description: "Meet your RCIC face-to-face at our Burnaby, BC office. Bring documents, ask every question, and leave with a written plan. 60 minutes. Free parking on site, transit-accessible."
      href: "https://calendly.com/REPLACE-WITH-MVC-CALENDLY/in-office-consultation"
  footer: "Secure scheduling & payment via Calendly"
  payments: ["VISA", "MC", "AMEX", "DISCOVER"]
note: |
  Not ready to book a paid session?
  [Send us a message](#main) for a free 30-minute discovery call —
  we'll tell you whether a 1:1 consultation is the right next step.
legal: "Consultation fees are non-refundable but are credited toward your retainer if you choose to engage MVC for full representation."

# Section: Bottom CTA
heading: "Ready to start your journey?"
content: "Book a free 30-minute consultation — no obligation."
cta:
  label: "Book a Free Consultation"
  href: "#consultation"
