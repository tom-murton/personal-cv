import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { SanityDocumentStub } from "@sanity/client";
import { localPortfolioContent } from "../src/content/localPortfolioContent";
import type { HomeSection, ProjectArtwork, SiteLink } from "../src/content/types";

const projectId = process.env.SANITY_PROJECT_ID ?? "jbch6ec7";
const dataset = process.env.SANITY_DATASET ?? "production";
const apply = process.argv.includes("--apply");
const replace = process.argv.includes("--replace");

if (replace && !apply) {
  throw new Error("--replace must be used with --apply.");
}

const documentIds = {
  settings: "portfolio-site-settings",
  homepage: "portfolio-homepage",
  collections: "portfolio-collections",
  project: (id: string) => `portfolio-project-${id}`,
  article: (id: string) => `portfolio-article-${id}`,
  talk: (id: string) => `portfolio-talk-${id}`,
  experience: (id: string | number) => `portfolio-experience-${String(id)}`,
};

function key(value: string | number) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "-");
}

function reference(_ref: string, _key?: string) {
  return { _type: "reference", _ref, ...(_key ? { _key } : {}) };
}

function link(value: SiteLink, index: number) {
  return { _type: "portfolioLink", _key: key(`${index}-${value.label}`), ...value };
}

function projectVisual(artwork: ProjectArtwork) {
  if (artwork.type === "image") {
    throw new Error(`Local image artwork (${artwork.src}) must be uploaded in Studio before it can be migrated.`);
  }
  return { _type: "portfolioProjectVisual", kind: "preset", preset: artwork.preset };
}

function parseCssColour(value: string) {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    return {
      red: Number.parseInt(hex[1].slice(0, 2), 16),
      green: Number.parseInt(hex[1].slice(2, 4), 16),
      blue: Number.parseInt(hex[1].slice(4, 6), 16),
      alpha: 1,
    };
  }

  const rgba = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (rgba) {
    return {
      red: Number(rgba[1]),
      green: Number(rgba[2]),
      blue: Number(rgba[3]),
      alpha: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }

  throw new Error(`Unsupported theme colour: ${value}`);
}

function rgbToHsv(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }

  if (hue < 0) hue += 360;
  return { h: hue, s: max === 0 ? 0 : delta / max, v: max };
}

function rgbToHsl(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;

  if (delta) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }

  if (hue < 0) hue += 360;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return { h: hue, s: saturation, l: lightness };
}

function sanityColour(value: string) {
  const { red, green, blue, alpha } = parseCssColour(value);
  const hsv = rgbToHsv(red, green, blue);
  const hsl = rgbToHsl(red, green, blue);
  const hex = `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;

  return {
    _type: "color",
    hex,
    alpha,
    rgb: { _type: "rgbaColor", r: red, g: green, b: blue, a: alpha },
    hsv: { _type: "hsvaColor", ...hsv, a: alpha },
    hsl: { _type: "hslaColor", ...hsl, a: alpha },
  };
}

function homepageSection(section: HomeSection) {
  const base = {
    _key: key(section.id),
    internalName: section.eyebrow,
    enabled: section.enabled,
    eyebrow: section.eyebrow,
    title: section.title,
  };

  if (section.kind === "projects") {
    return {
      ...base,
      _type: "portfolioProjectSection",
      rows: section.rows.map((row, rowIndex) => ({
        _type: "portfolioProjectRow",
        _key: key(row.id),
        internalName: `Row ${rowIndex + 1}`,
        enabled: row.enabled,
        layout: row.layout,
        items: row.projectIds.map((projectId, itemIndex) => (
          reference(documentIds.project(projectId), key(`${itemIndex}-${projectId}`))
        )),
      })),
    };
  }

  if (section.kind === "writing") {
    return {
      ...base,
      _type: "portfolioArticleSection",
      items: section.itemIds.map((id, index) => reference(documentIds.article(id), key(`${index}-${id}`))),
    };
  }

  if (section.kind === "talks") {
    return {
      ...base,
      _type: "portfolioTalkSection",
      items: section.itemIds.map((id, index) => reference(documentIds.talk(id), key(`${index}-${id}`))),
    };
  }

  return { ...base, _type: "portfolioAboutSection", body: section.body };
}

function collection<T extends { id: string | number }>(
  source: { eyebrow: string; title: string; description: string; items: T[] },
  type: string,
  idFor: (id: T["id"]) => string,
) {
  return {
    _type: type,
    eyebrow: source.eyebrow,
    title: source.title,
    description: source.description,
    items: source.items.map((item, index) => reference(idFor(item.id), key(`${index}-${item.id}`))),
  };
}

export function buildPortfolioDocuments(): SanityDocumentStub[] {
  const { site, homeSections, projects, writing, talks, experiences, collections } = localPortfolioContent;

  const contentDocuments: SanityDocumentStub[] = [
    ...projects.map((project) => ({
      _id: documentIds.project(project.id),
      _type: "portfolioProject",
      title: project.name,
      slug: { _type: "slug", current: project.id },
      status: project.status,
      kind: project.kind,
      year: project.year,
      summary: project.summary,
      currentNote: project.update,
      visual: projectVisual(project.artwork),
      ...(project.href ? {
        link: {
          _type: "portfolioLink",
          label: project.hrefLabel ?? "View project",
          href: project.href,
        },
      } : {}),
      archived: false,
    })),
    ...writing.map((article) => ({
      _id: documentIds.article(article.id),
      _type: "portfolioArticle",
      title: article.title,
      slug: { _type: "slug", current: article.id },
      description: article.description,
      dateLabel: article.date,
      articleType: article.articleType ?? (article.body?.length ? "project-story" : "external"),
      ...(article.projectName ? { projectName: article.projectName } : {}),
      ...(article.projectId ? { relatedProject: reference(documentIds.project(article.projectId), key(`project-${article.projectId}`)) } : {}),
      ...(article.body?.length ? { body: article.body } : {}),
      ...(article.links?.length ? { links: article.links.map(link) } : {}),
      ...(article.link ? { externalUrl: article.link } : {}),
      visible: true,
    })),
    ...talks.map((talk) => ({
      _id: documentIds.talk(talk.id),
      _type: "portfolioTalk",
      title: talk.title,
      slug: { _type: "slug", current: talk.id },
      event: talk.event,
      description: talk.description,
      dateLabel: talk.date,
      externalUrl: talk.link,
      visible: true,
    })),
    ...experiences.map((experience) => ({
      _id: documentIds.experience(experience.id),
      _type: "portfolioExperience",
      title: experience.title,
      company: experience.company,
      companyUrl: experience.companyLink,
      period: experience.period,
      description: experience.description,
      achievements: experience.achievements ?? [],
      skills: experience.skills,
    })),
  ];

  const singletonDocuments: SanityDocumentStub[] = [
    {
      _id: documentIds.settings,
      _type: "portfolioSiteSettings",
      name: site.name,
      descriptor: site.descriptor,
      hero: { _type: "hero", ...site.hero },
      navigation: site.navigation.map(link),
      socialLinks: site.socialLinks.map(link),
      theme: {
        _type: "portfolioTheme",
        background: sanityColour(site.theme.background),
        surface: sanityColour(site.theme.surface),
        foreground: sanityColour(site.theme.foreground),
        muted: sanityColour(site.theme.muted),
        accent: sanityColour(site.theme.accent),
        accentInk: sanityColour(site.theme.accentInk),
        line: sanityColour(site.theme.line),
        motion: site.theme.motion,
        typeScale: site.theme.typeScale,
        density: site.theme.density,
        cardHeight: site.theme.cardHeight,
        cornerStyle: site.theme.cornerStyle,
        gridGap: site.theme.gridGap,
        heroBackdrop: site.theme.heroBackdrop,
      },
    },
    {
      _id: documentIds.homepage,
      _type: "portfolioHomepage",
      sections: homeSections.map(homepageSection),
    },
    {
      _id: documentIds.collections,
      _type: "portfolioCollections",
      projects: collection(collections.projects, "projects", documentIds.project),
      writing: collection(collections.writing, "writing", documentIds.article),
      talks: collection(collections.talks, "talks", documentIds.talk),
      cv: collection(collections.cv, "cv", documentIds.experience),
    },
  ];

  return [...contentDocuments, ...singletonDocuments];
}

async function main() {
  const documents = buildPortfolioDocuments();
  const counts = documents.reduce<Record<string, number>>((result, document) => {
    result[document._type] = (result[document._type] ?? 0) + 1;
    return result;
  }, {});

  if (!apply) {
    console.log("Dry run only — no Sanity data changed.");
    console.table(counts);
    console.log(`Prepared ${documents.length} documents for ${projectId}/${dataset}.`);
    console.log("Run npm run cms:login once, then npm run cms:seed:apply.");
    return;
  }

  const temporaryDirectory = await mkdtemp(join(tmpdir(), "portfolio-sanity-"));
  const seedFile = join(temporaryDirectory, "portfolio.ndjson");

  try {
    await writeFile(seedFile, `${documents.map((document) => JSON.stringify(document)).join("\n")}\n`, "utf8");

    const result = spawnSync(
      "npm",
      [
        "--prefix", "studio", "exec", "sanity", "--",
        "dataset", "import", seedFile,
        "--dataset", dataset,
        "--project-id", projectId,
        replace ? "--replace" : "--missing",
      ],
      { cwd: process.cwd(), stdio: "inherit" },
    );

    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error("Sanity import failed. Run npm run cms:login and try again.");
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
