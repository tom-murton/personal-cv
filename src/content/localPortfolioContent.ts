import { collections } from "@/content/collections";
import { homeSections } from "@/content/homepage";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import type { PortfolioContent } from "@/content/types";
import { talks, writing } from "@/content/writing";
import { experiences } from "@/data/workData";

export const localPortfolioContent: PortfolioContent = {
  source: "local",
  site,
  homeSections,
  projects,
  writing,
  talks,
  experiences,
  collections,
};
