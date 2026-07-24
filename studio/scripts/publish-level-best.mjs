import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-01" });

const projectId = "portfolio-project-level-best";

function reference(slug, index) {
  return {
    _type: "reference",
    _key: `${index}-${slug}`,
    _ref: `portfolio-project-${slug}`,
  };
}

const project = {
  _id: projectId,
  _type: "portfolioProject",
  title: "Level Best",
  slug: { _type: "slug", current: "level-best" },
  status: "Testing",
  kind: "iOS app",
  year: "2026",
  summary: "An offline bleep test trainer for police, fire and forces fitness tests, with every official variant and real published pass standards.",
  currentNote: "Submitted to the App Store and in review. Free level charts and pass standards now live.",
  visual: {
    _type: "portfolioProjectVisual",
    kind: "preset",
    preset: "level-best",
  },
  link: {
    _type: "portfolioLink",
    label: "Bleep test charts",
    href: "/apps/level-best/",
  },
  archived: false,
};

const projectOrder = [
  "lightscout",
  "level-best",
  "warden",
  "rest-rise",
  "gaming-benchmark",
  "marketing-engine",
];

const projectRows = [
  {
    _type: "portfolioProjectRow",
    _key: "lead-project",
    internalName: "Lead project",
    enabled: true,
    layout: "single",
    items: [reference("lightscout", 0)],
  },
  {
    _type: "portfolioProjectRow",
    _key: "current-apps",
    internalName: "Current apps",
    enabled: true,
    layout: "two-equal",
    items: [reference("level-best", 0), reference("rest-rise", 1)],
  },
  {
    _type: "portfolioProjectRow",
    _key: "games-and-research",
    internalName: "Games and research",
    enabled: true,
    layout: "two-equal",
    items: [reference("warden", 0), reference("gaming-benchmark", 1)],
  },
];

const homepage = await client.fetch(`*[_id == "portfolio-homepage"][0]{sections}`);
if (!homepage?.sections) throw new Error("The homepage singleton is missing.");

let foundProjectSection = false;
const sections = homepage.sections.map((section) => {
  if (section._type !== "portfolioProjectSection") return section;
  foundProjectSection = true;
  return { ...section, rows: projectRows };
});

if (!foundProjectSection) throw new Error("The homepage project section is missing.");

await client
  .transaction()
  .createOrReplace(project)
  .patch("portfolio-collections", (patch) => patch.set({
    "projects.items": projectOrder.map(reference),
  }))
  .patch("portfolio-homepage", (patch) => patch.set({ sections }))
  .commit({ autoGenerateArrayKeys: true });

console.log("Published Level Best and updated the project collection and homepage rows.");
