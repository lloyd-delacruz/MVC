import type { AboutContent } from "@/lib/content/types";

const ABOUT: AboutContent = {
  eyebrow: "About MVC",
  heading: "Where every immigration journey is met with care.",
  lede: "Licensed RCIC. Personal review. Real guidance for families, workers, students, and businesses — tailored to your goals.",
  bodyMarkdown: [
    "## Our work is personal.",
    "",
    "Yaniv Babani founded MVC on a simple conviction: that every person navigating Canada's immigration system deserves to be met with care, honesty, and a real answer — not a form letter or a file passed down to junior staff.",
    "",
    "A Regulated Canadian Immigration Consultant in good standing with the College of Immigration and Citizenship Consultants (CICC), Yaniv personally reviews every case that comes through MVC. He earned his Post-Graduate Diploma in Immigration Consultancy from Ashton College in Vancouver, and holds a Bachelor's degree in Business Administration from the College of Management Academic Studies in Rishon LeZion, Israel.",
    "",
    "Over more than a decade in Canadian immigration, Yaniv has guided hundreds of individuals, couples, families, and foreign workers — across a wide range of nationalities and backgrounds — toward their goal of building a life in Canada. That range is part of how he works: he understands that a skilled worker's Express Entry file, a family reunification case, and an entrepreneur's provincial nomination each carry their own pressures, timelines, and hopes.",
    "",
    "Yaniv works in English, Spanish, and Hebrew, and brings a business owner's practical eye to every plan — mapping not just the next form, but the pathway from where you are now to where you want to be.",
    "",
    "You can verify Yaniv's licence and standing on the [CICC public register](https://college-ic.ca/).",
  ].join("\n"),
  imageUrl: "/team/yaniv.jpg",
  imageAlt: "Yaniv Babani, Founder & RCIC",
};

export async function getAbout(): Promise<AboutContent> {
  return ABOUT;
}
