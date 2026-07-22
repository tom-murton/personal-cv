import assert from "node:assert/strict";
import { createClient } from "@sanity/client";
import { localPortfolioContent } from "../src/content/localPortfolioContent";
import { mapPortfolioContent, type RawPortfolioContent } from "../src/sanity/mapPortfolioContent";
import { portfolioContentQuery } from "../src/sanity/query";

const projectId = process.env.SANITY_PROJECT_ID ?? "jbch6ec7";
const dataset = process.env.SANITY_DATASET ?? "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-07-01",
  useCdn: false,
  perspective: "published",
});

const raw = await client.fetch<RawPortfolioContent>(portfolioContentQuery);
const mapped = mapPortfolioContent(raw, localPortfolioContent);

assert(raw.settings, "Live CMS response is missing public site settings.");
assert(raw.homepage?.sections, "Live CMS response is missing homepage sections.");
assert(raw.collections, "Live CMS response is missing collection settings.");
assert(mapped, `Live CMS response did not map successfully: ${JSON.stringify({
  projects: raw.projects?.length ?? 0,
  articles: raw.articles?.length ?? 0,
  talks: raw.talks?.length ?? 0,
  experiences: raw.experiences?.length ?? 0,
  sectionTypes: raw.homepage.sections.map((section) => section._type),
  projectRows: raw.homepage.sections
    .filter((section) => section._type === "portfolioProjectSection")
    .flatMap((section) => section.projectRows ?? []),
})}`);

assert.equal(mapped.source, "sanity");
console.log(`Live CMS verified: ${mapped.projects.length} projects, ${mapped.writing.length} articles, ${mapped.talks.length} talk and ${mapped.experiences.length} CV entries from ${projectId}/${dataset}.`);
