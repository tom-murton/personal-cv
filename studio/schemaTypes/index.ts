import { portfolioArticle } from "./portfolioArticle";
import { portfolioCollections } from "./portfolioCollections";
import { portfolioExperience } from "./portfolioExperience";
import { portfolioHomepage } from "./portfolioHomepage";
import { portfolioProject } from "./portfolioProject";
import { portfolioSiteSettings } from "./portfolioSiteSettings";
import { portfolioTalk } from "./portfolioTalk";
import { portfolioAboutSection } from "./objects/portfolioAboutSection";
import { portfolioArticleSection } from "./objects/portfolioArticleSection";
import { portfolioLink } from "./objects/portfolioLink";
import { portfolioProjectPlacement } from "./objects/portfolioProjectPlacement";
import { portfolioProjectRow } from "./objects/portfolioProjectRow";
import { portfolioProjectSection } from "./objects/portfolioProjectSection";
import { portfolioProjectVisual } from "./objects/portfolioProjectVisual";
import { portfolioTalkSection } from "./objects/portfolioTalkSection";
import { portfolioTheme } from "./objects/portfolioTheme";

export const schemaTypes = [
  portfolioLink,
  portfolioTheme,
  portfolioProjectVisual,
  portfolioProjectPlacement,
  portfolioProjectRow,
  portfolioProjectSection,
  portfolioArticleSection,
  portfolioTalkSection,
  portfolioAboutSection,
  portfolioProject,
  portfolioArticle,
  portfolioTalk,
  portfolioExperience,
  portfolioSiteSettings,
  portfolioHomepage,
  portfolioCollections,
];
