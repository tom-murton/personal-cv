import assert from "node:assert/strict";
import { createClient } from "@sanity/client";
import { localPortfolioContent } from "../src/content/localPortfolioContent";
import { mapPortfolioContent, type RawPortfolioContent } from "../src/sanity/mapPortfolioContent";
import { portfolioContentQuery } from "../src/sanity/query";
import { worlds } from "../src/content/worlds";

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

// Worlds without a mapped CMS project fall back to their copy in src/content/worlds.ts. A world that
// has a CMS document which does not map (for example an image without alt text) is an error.
const mappedSlugs = new Set(mapped.projects.map((project) => project.id));
const documentSlugs = new Set((raw.projects ?? []).map((project) => project.slug));
const broken = worlds.filter((world) => documentSlugs.has(world.slug) && !mappedSlugs.has(world.slug)).map((world) => world.slug);
assert.deepEqual(broken, [], `CMS projects that exist but do not map: ${broken.join(", ")}`);
const fromRepository = worlds.filter((world) => !mappedSlugs.has(world.slug)).map((world) => world.slug);
const blank = worlds.filter((world) => !mappedSlugs.has(world.slug) && !world.fallback).map((world) => world.slug);
assert.deepEqual(blank, [], `Worlds with neither a mapped CMS project nor fallback copy: ${blank.join(", ")}`);
const listed = new Set(mapped.collections.projects.items.map((project) => project.id));
const unlisted = [...mappedSlugs].filter((slug) => !listed.has(slug));
assert.deepEqual(unlisted, [], `CMS projects missing from the Projects collection: ${unlisted.join(", ")}`);
console.log(fromRepository.length ? `Worlds still supplied by the repository copy: ${fromRepository.join(", ")}.` : "All worlds have a published CMS project.");
console.log(`Live CMS verified: ${mapped.projects.length} projects, ${mapped.writing.length} articles, ${mapped.talks.length} talk and ${mapped.experiences.length} CV entries from ${projectId}/${dataset}.`);
