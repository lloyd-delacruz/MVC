import type { AboutContent } from "@/lib/content/types";

const ABOUT: AboutContent = {
  eyebrow: "About MVC",
  heading: "Where every immigration journey is met with care.",
  lede: "Licensed RCIC. Personal review. Real guidance for families, workers, students, and businesses — tailored to your goals.",
  bodyMarkdown: [
    "## Our work is personal.",
    "",
    "Every case is reviewed by Yaniv Babani — MVC's founder and a Regulated Canadian Immigration Consultant (RCIC #R519412), in good standing with the College of Immigration and Citizenship Consultants (CICC). We don't hand files to junior staff or take shortcuts. We read your situation carefully, tell you what we see, and give you a real answer.",
    "",
    "Yaniv earned his Post-Graduate Diploma in Immigration Consultancy from Ashton College in Vancouver, and a Bachelor's degree in Business Administration from the College of Management Academic Studies in Rishon LeZion, Israel.",
    "",
    "With more than thirteen years of experience in Canadian immigration, he has assisted hundreds of individuals, couples, families, and foreign workers across diverse nationalities and backgrounds in reaching their goals of immigrating to Canada.",
  ].join("\n"),
  imageUrl: "/team/yaniv.jpg",
  imageAlt: "Yaniv Babani, Founder & RCIC",
};

export async function getAbout(): Promise<AboutContent> {
  return ABOUT;
}
