import type { PortfolioCollections } from "@/content/types";
import { projects } from "@/content/projects";
import { talks, writing } from "@/content/writing";
import { experiences } from "@/data/workData";
import { aboutContent } from "@/data/navigationData";

export const collections: PortfolioCollections = {
  projects: {
    eyebrow: "Project index",
    title: "Things I have made — and things still taking shape.",
    description: "Products, games, internal tools and structured experiments. Status and current notes make unfinished work part of the record.",
    items: projects,
  },
  writing: {
    eyebrow: "Writing",
    title: "Stories from the things I build — and what the work changes.",
    description: "Project stories, product decisions and published articles about building software, leading teams and learning by making.",
    items: writing,
  },
  talks: {
    eyebrow: "Talks",
    title: "Ideas shared in rooms, not just documents.",
    description: "Conference appearances and presentations about engineering leadership, team systems and product practice.",
    items: talks,
  },
  cv: {
    eyebrow: "Curriculum vitae",
    title: "Product leadership, grounded in engineering.",
    description: aboutContent.paragraphs[0],
    items: experiences,
  },
};
