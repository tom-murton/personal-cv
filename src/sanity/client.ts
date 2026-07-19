import { createClient } from "@sanity/client";

export const sanityProjectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? "jbch6ec7";
export const sanityDataset = import.meta.env.VITE_SANITY_DATASET ?? "production";
export const sanityEnabled = import.meta.env.VITE_SANITY_ENABLED !== "false";

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: "2026-07-01",
  useCdn: true,
  perspective: "published",
});
