export type ProjectStatus =
  | "Shipped"
  | "Live"
  | "Launch-staged"
  | "Building"
  | "Testing"
  | "Running"
  | "Internal";

export type ProjectArtworkPreset =
  | "lightscout"
  | "level-best"
  | "warden"
  | "rest-rise"
  | "gaming-benchmark"
  | "marketing-engine";

export type ProjectArtwork =
  | { type: "preset"; preset: ProjectArtworkPreset }
  | { type: "image"; src: string; alt: string; position?: string };

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  kind: string;
  year: string;
  summary: string;
  update: string;
  artwork: ProjectArtwork;
  href?: string;
  hrefLabel?: string;
}

export type ProjectCardSize = "full" | "two-thirds" | "half" | "third";

export type ProjectRowLayout =
  | "single"
  | "two-equal"
  | "three-equal"
  | "feature-left"
  | "feature-right";

export interface FeaturedProject {
  projectId: Project["id"];
  size: ProjectCardSize;
  enabled: boolean;
}

export interface FeaturedProjectRow {
  id: string;
  layout: ProjectRowLayout;
  enabled: boolean;
  projectIds: Project["id"][];
}

export interface WritingItem {
  id: string;
  title: string;
  description: string;
  date: string;
  link?: string;
  articleType?: "project-story" | "external";
  projectName?: string;
  projectId?: Project["id"];
  body?: ArticleBlock[];
  links?: SiteLink[];
}

export interface ArticleSpan {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
}

export interface ArticleMarkDefinition {
  _type: "link";
  _key: string;
  href: string;
}

export interface ArticleBlock {
  _type: "block";
  _key: string;
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  children: ArticleSpan[];
  markDefs?: ArticleMarkDefinition[];
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  description: string;
  date: string;
  link: string;
}

export interface Experience {
  id: string | number;
  title: string;
  company: string;
  companyLink: string;
  period: string;
  description: string;
  achievements?: string[];
  skills: string[];
}

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteTheme {
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  accent: string;
  accentInk: string;
  line: string;
  motion: "quiet" | "standard" | "expressive";
  typeScale: "restrained" | "balanced" | "editorial";
  density: "compact" | "balanced" | "airy";
  cardHeight: "compact" | "balanced" | "cinematic";
  cornerStyle: "square" | "soft" | "rounded";
  gridGap: "hairline" | "balanced" | "wide";
  heroBackdrop: "rings" | "grid" | "minimal";
}

export interface SiteConfig {
  name: string;
  descriptor: string;
  hero: {
    eyebrow: string;
    title: string;
    accentTitle: string;
    introduction: string;
  };
  navigation: SiteLink[];
  socialLinks: SiteLink[];
  theme: SiteTheme;
}

export interface CollectionPage<T> {
  eyebrow: string;
  title: string;
  description: string;
  items: T[];
}

export interface PortfolioCollections {
  projects: CollectionPage<Project>;
  writing: CollectionPage<WritingItem>;
  talks: CollectionPage<Talk>;
  cv: CollectionPage<Experience>;
}

export interface PortfolioContent {
  source: "local" | "sanity";
  site: SiteConfig;
  homeSections: HomeSection[];
  projects: Project[];
  writing: WritingItem[];
  talks: Talk[];
  experiences: Experience[];
  collections: PortfolioCollections;
}

interface HomeSectionBase {
  id: string;
  enabled: boolean;
}

export interface HomeProjectsSection extends HomeSectionBase {
  kind: "projects";
  eyebrow: string;
  title: string;
  rows: FeaturedProjectRow[];
}

export interface HomeWritingSection extends HomeSectionBase {
  kind: "writing";
  eyebrow: string;
  title: string;
  itemIds: WritingItem["id"][];
}

export interface HomeTalksSection extends HomeSectionBase {
  kind: "talks";
  eyebrow: string;
  title: string;
  itemIds: Talk["id"][];
}

export interface HomeAboutSection extends HomeSectionBase {
  kind: "about";
  eyebrow: string;
  title: string;
  body: string;
}

export type HomeSection =
  | HomeProjectsSection
  | HomeWritingSection
  | HomeTalksSection
  | HomeAboutSection;
