import assert from "node:assert/strict";
import { localPortfolioContent } from "../src/content/localPortfolioContent";
import { mapPortfolioContent, type RawPortfolioContent } from "../src/sanity/mapPortfolioContent";
import { buildPortfolioDocuments } from "./seed-sanity";

type SeedDocument = Record<string, any> & { _id: string; _type: string };

const documents = buildPortfolioDocuments() as SeedDocument[];
const one = (type: string) => documents.find((document) => document._type === type);
const all = (type: string) => documents.filter((document) => document._type === type);
const referenceIds = (items: Array<{ _ref: string }> | undefined) => (items ?? []).map((item) => item._ref);

const settings = one("portfolioSiteSettings");
const homepage = one("portfolioHomepage");
const collections = one("portfolioCollections");

assert(settings && homepage && collections, "Seed must contain all required singletons.");

const raw: RawPortfolioContent = {
  settings,
  homepage: {
    sections: homepage.sections.map((section: SeedDocument) => ({
      ...section,
      ...(section._type === "portfolioProjectSection" ? {
        projectRows: section.rows.map((row: SeedDocument) => ({
          _key: row._key,
          enabled: row.enabled,
          layout: row.layout,
          itemDocumentIds: referenceIds(row.items),
        })),
      } : {}),
      ...(["portfolioArticleSection", "portfolioTalkSection"].includes(section._type) ? {
        itemDocumentIds: referenceIds(section.items),
      } : {}),
    })),
  },
  collections: {
    projects: { ...collections.projects, itemDocumentIds: referenceIds(collections.projects.items) },
    writing: { ...collections.writing, itemDocumentIds: referenceIds(collections.writing.items) },
    talks: { ...collections.talks, itemDocumentIds: referenceIds(collections.talks.items) },
    cv: { ...collections.cv, itemDocumentIds: referenceIds(collections.cv.items) },
  },
  projects: all("portfolioProject").map((document) => ({
    ...document,
    slug: document.slug.current,
  })),
  articles: all("portfolioArticle").map((document) => ({
    ...document,
    slug: document.slug.current,
  })),
  talks: all("portfolioTalk").map((document) => ({
    ...document,
    slug: document.slug.current,
  })),
  experiences: all("portfolioExperience"),
};

const mapped = mapPortfolioContent(raw, localPortfolioContent);
assert(mapped, "A complete seed response must map to CMS content.");
assert.equal(mapped.source, "sanity");
assert.equal(mapped.projects.length, localPortfolioContent.projects.length);
assert.equal(mapped.writing.length, localPortfolioContent.writing.length);
assert.equal(mapped.talks.length, localPortfolioContent.talks.length);
assert.equal(mapped.experiences.length, localPortfolioContent.experiences.length);
assert.deepEqual(
  mapped.collections.projects.items.map((item) => item.id),
  localPortfolioContent.collections.projects.items.map((item) => item.id),
);
assert.deepEqual(
  mapped.homeSections.map((section) => section.kind),
  localPortfolioContent.homeSections.map((section) => section.kind),
);
assert.equal(mapPortfolioContent({ ...raw, homepage: undefined }, localPortfolioContent), null);

console.log(`CMS mapping verified with ${documents.length} seed documents and a complete fallback check.`);
