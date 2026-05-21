import type { ContactContent } from "@/lib/cms/types";

// Footer values + contact-page detail blocks. The footer phone is reconciled to
// the real Burnaby number per CLAUDE.md (was a placeholder).
export const CONTACT_FALLBACK: ContactContent = {
  phone: "+1 778 288 7388",
  email: "info@myvisaforcanada.com",
  addressLine: "Vancouver, British Columbia, Canada",
  offices: [
    {
      id: "fallback-canada",
      iconName: "MapPin",
      label: "Canada Office",
      lines: ["Suite 900 – 2025 Willingdon Avenue", "Burnaby, BC V5C 0J3", "Canada", "+1 778 288 7388"],
    },
    {
      id: "fallback-philippines",
      iconName: "MapPin",
      label: "Philippines Office",
      lines: [
        "Unit 610B Oakridge IT Centre 2",
        "880 A.S. Fortuna St., Mandaue City",
        "Cebu 6014, Philippines",
        "+63 917 794 9960 (Mobile / WhatsApp)",
        "+63 939 922 4533 (Mobile)",
        "+63 32 253 0843 (Landline)",
      ],
    },
    { id: "fallback-email", iconName: "Mail", label: "Email", lines: ["info@myvisa4canada.com"] },
    { id: "fallback-hours", iconName: "Clock", label: "Hours", lines: ["9:00am – 5:00pm", "By appointment only"] },
    { id: "fallback-languages", iconName: "Languages", label: "Languages", lines: ["English, Spanish, Filipino, Hebrew"] },
  ],
  bookingOptions: [
    {
      id: "fallback-virtual",
      title: "MVC 1:1 Virtual Consultation",
      price: "$250 CAD",
      description:
        "Talk to a Regulated Canadian Immigration Consultant online (Zoom or Google Meet) and discuss your immigration plan or ask specific case-related questions. 60 minutes. Notes & next steps emailed afterwards.",
      href: "https://calendly.com/REPLACE-WITH-MVC-CALENDLY/virtual-consultation",
    },
    {
      id: "fallback-inoffice",
      title: "MVC 1:1 In-Office Consultation",
      price: "$350 CAD",
      description:
        "Meet your RCIC face-to-face at our Burnaby, BC office. Bring documents, ask every question, and leave with a written plan. 60 minutes. Free parking on site, transit-accessible.",
      href: "https://calendly.com/REPLACE-WITH-MVC-CALENDLY/in-office-consultation",
    },
  ],
  socialLinks: [
    { id: "fallback-facebook", platform: "Facebook", url: "#" },
    { id: "fallback-instagram", platform: "Instagram", url: "#" },
    { id: "fallback-linkedin", platform: "LinkedIn", url: "#" },
    { id: "fallback-youtube", platform: "YouTube", url: "#" },
  ],
};
