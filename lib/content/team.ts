import type { TeamMemberItem } from "@/lib/content/types";

const TEAM: TeamMemberItem[] = [
  {
    id: "yaniv",
    name: "Yaniv Babani",
    role: "Owner & RCIC",
    imageUrl: "/team/yaniv.jpg",
    imageAlt: "Yaniv Babani",
    bio:
      "Yaniv is MVC's founder and a Regulated Canadian Immigration Consultant (RCIC #R519412), in good standing with the College of Immigration and Citizenship Consultants (CICC). Every case at MVC is reviewed personally by Yaniv — no junior hand-offs, no shortcuts.\n\nHe earned his Post-Graduate Diploma in Immigration Consultancy from Ashton College in Vancouver, and a Bachelor's degree in Business Administration from the College of Management Academic Studies in Rishon LeZion, Israel.\n\nWith more than thirteen years of experience in Canadian immigration, Yaniv has assisted hundreds of individuals, couples, families, and foreign workers across diverse nationalities and backgrounds in reaching their goals of immigrating to Canada.",
    languages: ["English", "Spanish", "Hebrew"],
    imagePosition: "object-top",
  },
  {
    id: "adrienne",
    name: "Adrienne Omega",
    role: "Marketing",
    imageUrl: "/team/adrienne.jpg",
    imageAlt: "Adrienne Omega",
    languages: ["English", "Cebuano", "Tagalog"],
    bio:
      "Assisting in operations as Marketing & Communications Manager, Adrienne is herself an immigrant who landed in Canada directly as a permanent resident through the Express Entry system. She understands the immigration application process first-hand, along with the experience of starting out in a foreign country.\n\nShe brings to the company over 10 years of work experience in project management, marketing, account management, and business administration — drawn from roles at top multinational companies and Canadian government agencies.\n\nAdrienne is completing her Master's in Business Administration from Carleton University and received her Bachelor's in Communications from the Ateneo de Manila University. She has also completed certifications from the Project Management Institute, PROSCI, and LEAN.",
  },
  {
    id: "carisse",
    name: "Carisse Solatorio",
    role: "Operations",
    imageUrl: "/team/carisse.jpg",
    imageAlt: "Carisse Solatorio",
    languages: ["English", "Cebuano", "Tagalog", "Ilonggo"],
    bio:
      "Carisse is the Operations Manager for MVC Immigration's office in the Philippines. She brings over 12 years of corporate and business experience from the pharmaceutical and travel industries.\n\nShe completed her post-degree diploma in Entrepreneurship and Management from Fanshawe College in London, Ontario, and graduated from the University of St. La Salle Bacolod City with a Bachelor's in Engineering, majoring in Electronics and Communications.",
  },
  {
    id: "khristine",
    name: "Khristinne Araneta",
    role: "Operations",
    imageUrl: "/team/khristine.jpg",
    imageAlt: "Khristinne Araneta",
    languages: ["English", "Cebuano", "Tagalog"],
    bio:
      "Khristinne is the Operations Manager for MVC Immigration's office in the Philippines. She brings over 15 years of experience in business development, marketing, and account management from the telecommunications, oil, and travel industries.\n\nShe earned her MBA at the National University of Singapore (NUS) and graduated from the University of San Carlos (USC) with a Bachelor's in Economics.",
  },
  {
    id: "marianne",
    name: "Marianne Fulguirinas",
    role: "Admin Support",
    imageUrl: "/team/marianne.jpg",
    imageAlt: "Marianne Fulguirinas",
    languages: ["English", "Tagalog", "Cebuano"],
    bio: "Marianne is a Case Representative for MVC Immigration's office in the Philippines.",
  },
  {
    id: "michelle",
    name: "Michelle Rose Gallemit",
    role: "Admin Support",
    imageUrl: "/team/michelle.jpg",
    imageAlt: "Michelle Rose Gallemit",
    languages: ["English", "Tagalog", "Cebuano"],
    bio: "Michelle is a Case Representative for MVC Immigration's office in the Philippines.",
  },
  {
    id: "nico",
    name: "Nico Pelayo",
    role: "Case Processing",
    imageUrl: "/team/nico.jpg",
    imageAlt: "Nico Pelayo",
    languages: ["English", "Tagalog"],
    bio:
      "Nico, Immigration Specialist and Case Coordinator, is responsible for documents and requirements collection across various immigration pathways. He has extensive experience in Canadian immigration, having previously worked at the Canadian Visa Application Center in the Philippines.\n\nNico's hospitality background — with roles in Queenstown, New Zealand, and hotels in the Philippines — shapes his approach to client care. He completed his Bachelor's in International Hospitality Management from the Lyceum of the Philippines University in Manila.",
  },
];

export async function getTeam(): Promise<TeamMemberItem[]> {
  return TEAM;
}
