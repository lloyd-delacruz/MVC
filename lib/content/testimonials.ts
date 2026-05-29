import type { TestimonialItem, GoogleReviewItem } from "@/lib/content/types";

// ─────────────────────────────────────────────────────────────────────────────
// Real client success stories. Photos live in /public/testimonials and are real
// MVC clients holding their approved Canadian visas / passports.
//
// NOTE FOR CLIENT: the quote wording below was drafted from each photo as a
// starting point. Please confirm or replace with each client's own words before
// launch, and confirm written consent to publish first names + photos.
// First names only, per client direction.
// ─────────────────────────────────────────────────────────────────────────────

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "maricar",
    author: "Maricar",
    location: "Philippines",
    year: "2023",
    pathway: "Permanent Residence",
    outcome: "Permanent Residence — Approved",
    quote:
      "Sitting down with Yaniv changed everything. He explained exactly what my file needed and handled every detail with so much care. The day my approval came through, I went straight to the office to celebrate with the team that made it happen.",
    imageUrl: "/testimonials/maricar.jpg",
    imageAlt:
      "Maricar at the MVC office holding her approval letter beside consultant Yaniv",
    imagePosition: "object-center",
    featured: true,
  },
  {
    id: "mae",
    author: "Mae",
    location: "Philippines → Canada",
    year: "2023",
    pathway: "Family Pathway",
    outcome: "Settled in Canada",
    quote:
      "Our first Christmas together in our own home in Canada. None of this would have happened without MVC walking beside us through every form, every appointment, every milestone. We're finally home.",
    imageUrl: "/testimonials/mae.jpg",
    imageAlt: "Mae and her family at home in Canada during the holidays",
    imagePosition: "object-top",
    featured: true,
  },
  {
    id: "carisse",
    author: "Carisse",
    location: "Philippines",
    year: "2022",
    pathway: "Study Permit + Family",
    outcome: "Whole Family Approved",
    quote:
      "We didn't want to leave anyone behind. MVC planned a study pathway that let me bring my husband and our children with me. Seeing our kids' faces the day the visas were approved is something I'll never forget.",
    imageUrl: "/testimonials/carisse.jpg",
    imageAlt:
      "Carisse and her family at the MVC office in front of the Study & Work in Canada banner",
    imagePosition: "object-center",
  },
  {
    id: "camille",
    author: "Camille",
    location: "Manila, Philippines",
    year: "2023",
    pathway: "Study Permit",
    outcome: "Study Permit — Approved",
    quote:
      "I still tear up looking at this photo. After all the worry about whether I'd be approved, opening my passport to that Canadian visa felt unreal. MVC kept the whole process calm and clear from start to finish.",
    imageUrl: "/testimonials/camille.jpg",
    imageAlt: "Camille smiling as she holds her passport with the approved Canadian study visa",
    imagePosition: "object-center",
  },
  {
    id: "ben-john",
    author: "Ben John",
    location: "Philippines",
    year: "2023",
    pathway: "Study Permit",
    outcome: "Study Permit — Approved",
    quote:
      "First try, approved. The team double-checked every document before we submitted and kept me updated the whole way. I couldn't stop smiling when my visa finally came through.",
    imageUrl: "/testimonials/ben-john.jpg",
    imageAlt: "Ben John holding his passport open to the approved Canadian visa page",
    imagePosition: "object-center",
  },
  {
    id: "chenn",
    author: "Chenn",
    location: "Philippines",
    year: "2022",
    pathway: "Study & Work",
    outcome: "Visa Approved",
    quote:
      "From my very first consultation to the day I picked up my visa, MVC treated me like family. They believed in my plan to study and work in Canada when I wasn't even sure it was possible.",
    imageUrl: "/testimonials/chenn.jpg",
    imageAlt:
      "Chenn holding her approved visa at the MVC office in front of the Canada banner",
    imagePosition: "object-top",
  },
  {
    id: "lloyd",
    author: "Lloyd",
    location: "Philippines → Vancouver, BC",
    year: "2024",
    pathway: "PR → Citizenship",
    outcome: "Now a Canadian Citizen",
    quote:
      "I came to MVC as a permanent resident and never imagined I'd one day be holding a Canadian passport. They guided me through the citizenship process from start to finish and made every step clear. This photo at Canada Place is the moment it all became real.",
    imageUrl: "/testimonials/lloyd.jpg",
    imageAlt:
      "Lloyd sitting outside Canada Place in Vancouver, holding his Canadian passport",
    imagePosition: "object-[70%_center]",
  },
];

// Verified Google reviews. PLACEHOLDER COPY — replace `text`/`author`/`date`
// with the client's real Google Business reviews before launch.
const GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: "g1",
    author: "Jenny R.",
    initial: "J",
    rating: 5,
    date: "2 months ago",
    text: "Honest, professional and genuinely caring. They answered every question and never made me feel rushed. Highly recommend MVC to anyone moving to Canada.",
  },
  {
    id: "g2",
    author: "Mark D.",
    initial: "M",
    rating: 5,
    date: "4 months ago",
    text: "After a previous refusal I almost gave up. MVC reviewed my file, found the problem, and we were approved on the next try. Forever grateful.",
  },
  {
    id: "g3",
    author: "Angela S.",
    initial: "A",
    rating: 5,
    date: "6 months ago",
    text: "The team is so organized and responsive. Every document was checked twice and I always knew exactly what was happening with my application.",
  },
  {
    id: "g4",
    author: "Rommel P.",
    initial: "R",
    rating: 5,
    date: "8 months ago",
    text: "They helped my whole family come to Canada together. Professional, transparent about fees, and truly invested in our outcome.",
  },
  {
    id: "g5",
    author: "Liza M.",
    initial: "L",
    rating: 5,
    date: "10 months ago",
    text: "Booked the free consultation not expecting much and walked away with a clear plan. Worth every step. Thank you MVC!",
  },
];

export async function getTestimonials(): Promise<TestimonialItem[]> {
  return TESTIMONIALS;
}

export async function getGoogleReviews(): Promise<GoogleReviewItem[]> {
  return GOOGLE_REVIEWS;
}
