import type {
  Experience,
  FeaturedProjectRow,
  HomeSection,
  PortfolioCollections,
  PortfolioContent,
  Project,
  ProjectArtworkPreset,
  ProjectCardSize,
  ProjectRowLayout,
  ProjectStatus,
  SiteConfig,
  Talk,
  ArticleBlock,
  WritingItem,
} from "@/content/types";
import { projectRowSizes } from "@/content/projectRows";

interface SanityColor {
  hex?: string;
  alpha?: number;
}

interface RawSettings {
  name?: string;
  descriptor?: string;
  hero?: SiteConfig["hero"];
  navigation?: Array<{ label?: string; href?: string }>;
  socialLinks?: Array<{ label?: string; href?: string }>;
  theme?: {
    background?: SanityColor;
    surface?: SanityColor;
    foreground?: SanityColor;
    muted?: SanityColor;
    accent?: SanityColor;
    accentInk?: SanityColor;
    line?: SanityColor;
    motion?: SiteConfig["theme"]["motion"];
    typeScale?: SiteConfig["theme"]["typeScale"];
    density?: SiteConfig["theme"]["density"];
    cardHeight?: SiteConfig["theme"]["cardHeight"];
    cornerStyle?: SiteConfig["theme"]["cornerStyle"];
    gridGap?: SiteConfig["theme"]["gridGap"];
    heroBackdrop?: SiteConfig["theme"]["heroBackdrop"];
  };
}

interface RawProject {
  _id: string;
  title?: string;
  slug?: string;
  status?: ProjectStatus;
  kind?: string;
  year?: string;
  summary?: string;
  currentNote?: string;
  visual?: {
    kind?: "preset" | "image";
    preset?: ProjectArtworkPreset;
    alt?: string;
    imageUrl?: string;
    hotspot?: { x?: number; y?: number };
  };
  link?: { label?: string; href?: string };
}

interface RawArticle {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  dateLabel?: string;
  articleType?: WritingItem["articleType"];
  projectName?: string;
  projectId?: string;
  body?: ArticleBlock[];
  links?: Array<{ label?: string; href?: string }>;
  externalUrl?: string;
}

interface RawTalk {
  _id: string;
  title?: string;
  slug?: string;
  event?: string;
  description?: string;
  dateLabel?: string;
  externalUrl?: string;
}

interface RawExperience {
  _id: string;
  title?: string;
  company?: string;
  companyUrl?: string;
  period?: string;
  description?: string;
  achievements?: string[];
  skills?: string[];
}

interface RawSection {
  _key?: string;
  _type?: string;
  internalName?: string;
  enabled?: boolean;
  eyebrow?: string;
  title?: string;
  body?: string;
  projectItems?: Array<{ _key?: string; size?: ProjectCardSize; enabled?: boolean; documentId?: string }>;
  projectRows?: Array<{
    _key?: string;
    enabled?: boolean;
    layout?: ProjectRowLayout;
    itemDocumentIds?: string[];
  }>;
  itemDocumentIds?: string[];
}

interface RawCollection {
  eyebrow?: string;
  title?: string;
  description?: string;
  itemDocumentIds?: string[];
}

export interface RawPortfolioContent {
  settings?: RawSettings;
  homepage?: { sections?: RawSection[] };
  collections?: {
    projects?: RawCollection;
    writing?: RawCollection;
    talks?: RawCollection;
    cv?: RawCollection;
  };
  projects?: RawProject[];
  articles?: RawArticle[];
  talks?: RawTalk[];
  experiences?: RawExperience[];
}

function isPresent(value: string | undefined): value is string {
  return Boolean(value?.trim());
}

function mapLinks(items: Array<{ label?: string; href?: string }> | undefined) {
  return (items ?? []).flatMap((item) => (
    isPresent(item.label) && isPresent(item.href)
      ? [{ label: item.label, href: item.href }]
      : []
  ));
}

function mapHero(hero: RawSettings["hero"]) {
  if (
    !hero
    || !isPresent(hero.eyebrow)
    || !isPresent(hero.title)
    || !isPresent(hero.accentTitle)
    || !isPresent(hero.introduction)
  ) return null;

  return {
    eyebrow: hero.eyebrow,
    title: hero.title,
    accentTitle: hero.accentTitle,
    introduction: hero.introduction,
  };
}

function colorToCss(color: SanityColor | undefined, fallback: string) {
  if (!color?.hex) return fallback;
  if (typeof color.alpha !== "number" || color.alpha >= 1) return color.hex;
  const hex = color.hex.replace("#", "");
  if (hex.length !== 6) return color.hex;
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${color.alpha})`;
}

function mapProject(raw: RawProject): Project | null {
  if (!isPresent(raw.slug) || !isPresent(raw.title) || !raw.status || !isPresent(raw.kind) || !isPresent(raw.year) || !isPresent(raw.summary) || !isPresent(raw.currentNote)) return null;

  const visual = raw.visual?.kind === "image" && raw.visual.imageUrl && raw.visual.alt
    ? {
        type: "image" as const,
        src: raw.visual.imageUrl,
        alt: raw.visual.alt,
        position: `${(raw.visual.hotspot?.x ?? 0.5) * 100}% ${(raw.visual.hotspot?.y ?? 0.5) * 100}%`,
      }
    : raw.visual?.preset
      ? { type: "preset" as const, preset: raw.visual.preset }
      : null;

  if (!visual) return null;

  return {
    id: raw.slug,
    name: raw.title,
    status: raw.status,
    kind: raw.kind,
    year: raw.year,
    summary: raw.summary,
    update: raw.currentNote,
    artwork: visual,
    href: raw.link?.href,
    hrefLabel: raw.link?.label,
  };
}

function mapArticle(raw: RawArticle): WritingItem | null {
  if (!isPresent(raw.slug) || !isPresent(raw.title) || !isPresent(raw.description) || !isPresent(raw.dateLabel)) return null;
  const hasBody = Boolean(raw.body?.length);
  if (!hasBody && !isPresent(raw.externalUrl)) return null;

  return {
    id: raw.slug,
    title: raw.title,
    description: raw.description,
    date: raw.dateLabel,
    articleType: raw.articleType ?? (hasBody ? "project-story" : "external"),
    projectName: raw.projectName,
    projectId: raw.projectId,
    body: raw.body,
    links: mapLinks(raw.links),
    link: raw.externalUrl,
  };
}

function mapTalk(raw: RawTalk): Talk | null {
  if (!isPresent(raw.slug) || !isPresent(raw.title) || !isPresent(raw.event) || !isPresent(raw.description) || !isPresent(raw.dateLabel) || !isPresent(raw.externalUrl)) return null;
  return { id: raw.slug, title: raw.title, event: raw.event, description: raw.description, date: raw.dateLabel, link: raw.externalUrl };
}

function mapExperience(raw: RawExperience): Experience | null {
  if (!isPresent(raw.title) || !isPresent(raw.company) || !isPresent(raw.companyUrl) || !isPresent(raw.period) || !isPresent(raw.description)) return null;
  return {
    id: raw._id,
    title: raw.title,
    company: raw.company,
    companyLink: raw.companyUrl,
    period: raw.period,
    description: raw.description,
    achievements: raw.achievements,
    skills: raw.skills ?? [],
  };
}

function orderedItems<T>(documentIds: string[] | undefined, byDocumentId: Map<string, T>) {
  return (documentIds ?? []).flatMap((id) => {
    const item = byDocumentId.get(id);
    return item ? [item] : [];
  });
}

function collectionPage<T>(raw: RawCollection | undefined, items: T[]) {
  if (!raw || !isPresent(raw.eyebrow) || !isPresent(raw.title) || !isPresent(raw.description)) return null;
  return { eyebrow: raw.eyebrow, title: raw.title, description: raw.description, items };
}

export function mapPortfolioContent(raw: RawPortfolioContent, fallback: PortfolioContent): PortfolioContent | null {
  if (!raw.settings || !raw.homepage?.sections || !raw.collections) return null;

  const projectPairs = (raw.projects ?? []).flatMap((item) => {
    const mapped = mapProject(item);
    return mapped ? [[item._id, mapped] as const] : [];
  });
  const articlePairs = (raw.articles ?? []).flatMap((item) => {
    const mapped = mapArticle(item);
    return mapped ? [[item._id, mapped] as const] : [];
  });
  const talkPairs = (raw.talks ?? []).flatMap((item) => {
    const mapped = mapTalk(item);
    return mapped ? [[item._id, mapped] as const] : [];
  });
  const experiencePairs = (raw.experiences ?? []).flatMap((item) => {
    const mapped = mapExperience(item);
    return mapped ? [[item._id, mapped] as const] : [];
  });

  const projectsByDocumentId = new Map(projectPairs);
  const articlesByDocumentId = new Map(articlePairs);
  const talksByDocumentId = new Map(talkPairs);
  const experiencesByDocumentId = new Map(experiencePairs);
  const projectsBySlug = new Map(projectPairs.map(([, project]) => [project.id, project]));
  const articlesBySlug = new Map(articlePairs.map(([, article]) => [article.id, article]));
  const talksBySlug = new Map(talkPairs.map(([, talk]) => [talk.id, talk]));

  const settings = raw.settings;
  const hero = mapHero(settings.hero);
  const navigation = mapLinks(settings.navigation);
  if (!isPresent(settings.name) || !isPresent(settings.descriptor) || !hero || !navigation.length || !settings.theme) return null;

  const site: SiteConfig = {
    name: settings.name,
    descriptor: settings.descriptor,
    hero,
    navigation,
    socialLinks: mapLinks(settings.socialLinks),
    theme: {
      background: colorToCss(settings.theme.background, fallback.site.theme.background),
      surface: colorToCss(settings.theme.surface, fallback.site.theme.surface),
      foreground: colorToCss(settings.theme.foreground, fallback.site.theme.foreground),
      muted: colorToCss(settings.theme.muted, fallback.site.theme.muted),
      accent: colorToCss(settings.theme.accent, fallback.site.theme.accent),
      accentInk: colorToCss(settings.theme.accentInk, fallback.site.theme.accentInk),
      line: colorToCss(settings.theme.line, fallback.site.theme.line),
      motion: settings.theme.motion ?? "standard",
      typeScale: settings.theme.typeScale ?? "balanced",
      density: settings.theme.density ?? "balanced",
      cardHeight: settings.theme.cardHeight ?? "balanced",
      cornerStyle: settings.theme.cornerStyle ?? "square",
      gridGap: settings.theme.gridGap ?? "hairline",
      heroBackdrop: settings.theme.heroBackdrop ?? "rings",
    },
  };

  let invalidHomepage = false;
  const homeSections = raw.homepage.sections.flatMap<HomeSection>((section) => {
    if (!section._key || !section._type || !isPresent(section.eyebrow) || !isPresent(section.title)) return [];
    const base = { id: section._key, enabled: section.enabled !== false, eyebrow: section.eyebrow, title: section.title };

    if (section._type === "portfolioProjectSection") {
      const rows = (section.projectRows ?? []).flatMap<FeaturedProjectRow>((row) => {
        if (!row._key || !row.layout || !projectRowSizes[row.layout]) {
          invalidHomepage = true;
          return [];
        }
        const projectIds = orderedItems(row.itemDocumentIds, projectsByDocumentId).map((project) => project.id);
        if (projectIds.length !== projectRowSizes[row.layout].length) {
          invalidHomepage = true;
          return [];
        }
        return projectIds.length ? [{ id: row._key, layout: row.layout, enabled: row.enabled !== false, projectIds }] : [];
      });
      if (!rows.length) invalidHomepage = true;
      return [{ ...base, kind: "projects", rows }];
    }
    if (section._type === "portfolioArticleSection") {
      const itemIds = orderedItems(section.itemDocumentIds, articlesByDocumentId).map((item) => item.id);
      return [{ ...base, kind: "writing", itemIds }];
    }
    if (section._type === "portfolioTalkSection") {
      const itemIds = orderedItems(section.itemDocumentIds, talksByDocumentId).map((item) => item.id);
      return [{ ...base, kind: "talks", itemIds }];
    }
    if (section._type === "portfolioAboutSection" && isPresent(section.body)) {
      return [{ ...base, kind: "about", body: section.body }];
    }
    return [];
  });

  if (!homeSections.length || invalidHomepage) return null;

  const projectsCollection = collectionPage(raw.collections.projects, orderedItems(raw.collections.projects?.itemDocumentIds, projectsByDocumentId));
  const writingCollection = collectionPage(raw.collections.writing, orderedItems(raw.collections.writing?.itemDocumentIds, articlesByDocumentId));
  const talksCollection = collectionPage(raw.collections.talks, orderedItems(raw.collections.talks?.itemDocumentIds, talksByDocumentId));
  const cvCollection = collectionPage(raw.collections.cv, orderedItems(raw.collections.cv?.itemDocumentIds, experiencesByDocumentId));

  // Never switch to a half-configured CMS response. The public site keeps the
  // complete local version until all required singleton documents are valid.
  if (!projectsCollection || !writingCollection || !talksCollection || !cvCollection) return null;

  const collections: PortfolioCollections = {
    projects: projectsCollection,
    writing: writingCollection,
    talks: talksCollection,
    cv: cvCollection,
  };

  return {
    source: "sanity",
    site,
    homeSections,
    projects: Array.from(projectsBySlug.values()),
    writing: Array.from(articlesBySlug.values()),
    talks: Array.from(talksBySlug.values()),
    experiences: Array.from(experiencesByDocumentId.values()),
    collections,
  };
}
