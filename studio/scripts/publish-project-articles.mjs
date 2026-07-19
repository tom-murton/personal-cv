import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-01" });

const articleSlugs = [
  "building-lightscout-for-travellers",
  "from-google-doc-to-rest-rise",
  "can-ai-ship-a-fun-ios-game",
  "warden-from-brainstorm-to-game",
  "somewhere-day-trip-planner",
  "making-ai-app-videos-without-the-slop",
  "product-focused-engineering-leader",
  "bridging-product-and-engineering",
  "in-defence-of-estimates",
  "frictionless-internal-movement",
];

const homepageSlugs = [
  "building-lightscout-for-travellers",
  "can-ai-ship-a-fun-ios-game",
  "from-google-doc-to-rest-rise",
];

function references(slugs) {
  return slugs.map((slug, index) => ({
    _type: "reference",
    _key: `${index}-${slug}`,
    _ref: `portfolio-article-${slug}`,
  }));
}

const homepage = await client.fetch(`*[_id == "portfolio-homepage"][0]{sections}`);
if (!homepage?.sections) throw new Error("The homepage singleton is missing.");

const sections = homepage.sections.map((section) => (
  section._type === "portfolioArticleSection"
    ? { ...section, items: references(homepageSlugs) }
    : section
));

await client
  .transaction()
  .patch("portfolio-collections", (patch) => patch.set({ "writing.items": references(articleSlugs) }))
  .patch("portfolio-homepage", (patch) => patch.set({ sections }))
  .commit({ autoGenerateArrayKeys: true });

console.log(`Published ${articleSlugs.length} writing references and ${homepageSlugs.length} homepage features.`);
