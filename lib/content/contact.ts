import type { ContactContent } from "@/lib/content/types";

const CONTACT: ContactContent = {
  phone: "+1 (778) 288 7388",
  email: "info@myvisaforcanada.com",
  addressLine: "Burnaby, British Columbia, Canada",
  offices: [
    {
      id: "canada",
      iconName: "MapPin",
      label: "Canada Office",
      lines: ["Suite 900 – 2025 Willingdon Avenue", "Burnaby, BC V5C 0J3", "Canada", "+1 778 288 7388"],
      mapsQuery: "Suite 900, 2025 Willingdon Avenue, Burnaby, BC V5C 0J3, Canada",
    },
    {
      id: "philippines",
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
      mapsQuery: "Unit 610B Oakridge IT Centre 2, 880 A.S. Fortuna St., Mandaue City, Cebu 6014, Philippines",
    },
    { id: "email", iconName: "Mail", label: "Email", lines: ["info@myvisa4canada.com"] },
    { id: "hours", iconName: "Clock", label: "Hours", lines: ["9:00am – 5:00pm", "By appointment only"] },
    { id: "languages", iconName: "Languages", label: "Languages", lines: ["English, Spanish, Filipino, Hebrew"] },
  ],
  bookingOptions: [
    {
      id: "virtual",
      title: "MVC 1:1 Virtual Consultation",
      price: "$250 CAD",
      description:
        "Talk to a Regulated Canadian Immigration Consultant online (Zoom or Google Meet) and discuss your immigration plan or ask specific case-related questions. 60 minutes. Notes & next steps emailed afterwards.",
      href: "https://calendly.com/REPLACE-WITH-MVC-CALENDLY/virtual-consultation",
    },
    {
      id: "inoffice",
      title: "MVC 1:1 In-Office Consultation",
      price: "$350 CAD",
      description:
        "Meet your RCIC face-to-face at our Burnaby, BC office. Bring documents, ask every question, and leave with a written plan. 60 minutes. Free parking on site, transit-accessible.",
      href: "https://calendly.com/REPLACE-WITH-MVC-CALENDLY/in-office-consultation",
    },
  ],
  socialLinks: [
    { id: "facebook", platform: "Facebook", url: "#" },
    { id: "instagram", platform: "Instagram", url: "#" },
    { id: "linkedin", platform: "LinkedIn", url: "#" },
    { id: "youtube", platform: "YouTube", url: "#" },
  ],
};

export async function getContact(): Promise<ContactContent> {
  return CONTACT;
}
