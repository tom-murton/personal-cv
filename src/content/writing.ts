import type { Talk, WritingItem } from "@/content/types";
import { projectArticles } from "@/content/projectArticles";

export const writing: WritingItem[] = [
  ...projectArticles,
  {
    id: "product-focused-engineering-leader",
    title: "The Case for Becoming a More Product-Focused Engineering Leader",
    description: "Explores the importance of engineering leaders adopting a product mindset to enhance team alignment, collaboration, and innovation, ultimately delivering greater value to the business.",
    date: "January 23, 2024",
    link: "https://www.linkedin.com/pulse/case-becoming-more-product-focused-engineering-leader-tom-murton",
  },
  {
    id: "bridging-product-and-engineering",
    title: "Bridging the Gap: How Engineering Leaders Can Foster Better Collaboration with Product",
    description: "Discusses strategies for engineering leaders to involve their teams early in the product discovery process, fostering better collaboration with product managers and designers to create more effective solutions.",
    date: "December 15, 2023",
    link: "https://www.linkedin.com/pulse/bridging-gap-how-engineering-leaders-can-foster-better-tom-murton",
  },
  {
    id: "in-defence-of-estimates",
    title: "In Defence of Estimates",
    description: "Provides a balanced perspective on the role of estimation in software development, highlighting its benefits for project planning and team morale, while offering practical approaches to improve estimation practices.",
    date: "November 30, 2023",
    link: "https://www.linkedin.com/pulse/defence-estimates-tom-murton",
  },
  {
    id: "frictionless-internal-movement",
    title: "Frictionless Internal Movement",
    description: "Advocates for reducing barriers to internal team transitions within organisations, emphasising how facilitating such movements can support individual growth, enhance job satisfaction, and retain talent.",
    date: "October 20, 2023",
    link: "https://www.linkedin.com/pulse/frictionless-internal-movement-tom-murton",
  },
];

export const talks: Talk[] = [
  {
    id: "frictionless-movement-leaddev",
    title: "Frictionless Movement",
    event: "LeadDev London",
    description: "A presentation on creating pathways for internal movement within organisations to improve retention and employee growth opportunities.",
    date: "June 2025",
    link: "https://leaddev.com/leaddev-london/agenda/",
  },
];

export const writingById = new Map(writing.map((item) => [item.id, item]));
export const talkById = new Map(talks.map((talk) => [talk.id, talk]));
