import type { Talk, WritingItem } from "@/content/types";
import { projectArticles } from "@/content/projectArticles";

export const writing: WritingItem[] = [
  ...projectArticles,
  {
    id: "product-focused-engineering-leader",
    title: "The Case for Becoming a More Product-Focused Engineering Leader",
    description: "Engineering leaders create more value when they treat customer problems, product discovery and business outcomes as part of the engineering job.",
    date: "23 January 2025",
    link: "https://www.linkedin.com/pulse/case-becoming-more-product-focused-engineering-leader-tom-murton-9ga7f",
  },
  {
    id: "bridging-product-and-engineering",
    title: "Bridging the Gap: How Engineering Leaders Can Foster Better Collaboration with Product",
    description: "The product and engineering gap starts when engineers arrive after discovery. Involving them earlier produces better questions, options and decisions.",
    date: "1 October 2024",
    link: "https://www.linkedin.com/pulse/bridging-gap-how-engineering-leaders-can-foster-better-tom-murton-3dvke",
  },
  {
    id: "in-defence-of-estimates",
    title: "In Defence of Estimates",
    description: "Estimates are useful when teams treat them as a shared planning tool, not a promise or a weapon. The problem is usually how they are used.",
    date: "17 January 2024",
    link: "https://www.linkedin.com/pulse/defence-estimates-tom-murton-tqbwe",
  },
  {
    id: "frictionless-internal-movement",
    title: "Frictionless Internal Movement",
    description: "Many companies make it easier to resign than to change teams. A deliberate transfer process gives people room to grow without leaving.",
    date: "14 September 2021",
    link: "https://www.linkedin.com/pulse/frictionless-internal-movement-tom-murton",
  },
];

export const talks: Talk[] = [
  {
    id: "frictionless-movement-leaddev",
    title: "Frictionless Movement",
    event: "LeadDev London",
    description: "Companies often make it easier to resign than to change teams. This talk makes the case for frictionless internal movement and shows how a Transfer Window can work in practice.",
    date: "June 2025",
    link: "https://leaddev.com/culture/frictionless-movement-how-internal-mobility-transforms-engineering-culture",
  },
];

export const writingById = new Map(writing.map((item) => [item.id, item]));
export const talkById = new Map(talks.map((talk) => [talk.id, talk]));
