/*
 * Content for the static render: published Sanity content fetched at build time, falling back to the
 * checked-in copy under src/content/ when Sanity cannot be reached or returns a half-configured set.
 */
import { createClient } from "@sanity/client";
import { localPortfolioContent } from "../../src/content/localPortfolioContent";
import type { PortfolioContent } from "../../src/content/types";
import { mapPortfolioContent, type RawPortfolioContent } from "../../src/sanity/mapPortfolioContent";
import { portfolioContentQuery } from "../../src/sanity/query";
import { benchmarkGames, worlds } from "../../src/content/worlds";
import { merge } from "../../src/stage/merge.js";
import { fetchAppStore, type StoreFact } from "./fetch-app-store";

export const sanityProjectId = process.env.SANITY_PROJECT_ID ?? process.env.VITE_SANITY_PROJECT_ID ?? "jbch6ec7";
export const sanityDataset = process.env.SANITY_DATASET ?? process.env.VITE_SANITY_DATASET ?? "production";

async function fetchSanity(): Promise<PortfolioContent | null> {
  if (process.env.VITE_SANITY_ENABLED === "false" || process.env.SITE_OFFLINE === "1") return null;
  try {
    const client = createClient({ projectId: sanityProjectId, dataset: sanityDataset, apiVersion: "2026-07-01", useCdn: false, perspective: "published", timeout: 15000 });
    const raw = await client.fetch<RawPortfolioContent>(portfolioContentQuery);
    return mapPortfolioContent(raw, localPortfolioContent);
  } catch (error) {
    console.warn(`Sanity fetch failed, using the checked-in content: ${(error as Error).message}`);
    return null;
  }
}

export interface SiteContent {
  source: "sanity" | "local";
  content: PortfolioContent;
  merged: ReturnType<typeof merge>;
  store: Record<string, StoreFact>;
  writingTitle: string;
  talksTitle: string;
  about: { title: string; body: string };
}

export async function loadContent(): Promise<SiteContent> {
  const [sanity, store] = await Promise.all([fetchSanity(), fetchAppStore()]);
  const content = sanity ?? localPortfolioContent;
  console.log(`Content: ${sanity ? `Sanity ${sanityProjectId}/${sanityDataset}` : "checked-in fallback"}.`);
  const writingOrder = content.collections.writing.items;
  const merged = merge({ hero: content.site.hero, projects: content.collections.projects.items.concat(content.projects.filter((p) => !content.collections.projects.items.includes(p))), writing: writingOrder, talks: content.collections.talks.items }, worlds, store, benchmarkGames);
  const section = <K extends string>(kind: K) => content.homeSections.find((s) => s.kind === kind) as { title?: string; body?: string } | undefined;
  return {
    source: sanity ? "sanity" : "local",
    content,
    merged,
    store,
    writingTitle: section("writing")?.title ?? content.collections.writing.title,
    talksTitle: section("talks")?.title ?? content.collections.talks.title,
    about: { title: section("about")?.title ?? "About", body: section("about")?.body ?? "" },
  };
}
