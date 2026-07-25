import { talkById, writingById } from "@/content/writing";
import { projectById } from "@/content/projects";
import type { HomeSection } from "@/content/types";

// This array is the homepage layout. Move sections or project entries to reorder them.
// Set enabled to false to hide something without deleting its content.
export const homeSections: HomeSection[] = [
  {
    id: "selected-work",
    kind: "projects",
    enabled: true,
    eyebrow: "Selected work",
    title: "Products, games, tools and experiments.",
    rows: [
      { id: "lead-project", layout: "single", enabled: true, projectIds: ["lightscout"] },
      { id: "current-apps", layout: "two-equal", enabled: true, projectIds: ["level-best", "rest-rise"] },
      { id: "games-and-research", layout: "two-equal", enabled: true, projectIds: ["warden", "gaming-benchmark"] },
    ],
  },
  {
    id: "writing",
    kind: "writing",
    enabled: true,
    eyebrow: "Field notes",
    title: "Sometimes I write about the decision before I know whether it was right.",
    itemIds: [
      "building-lightscout-for-travellers",
      "can-ai-ship-a-fun-ios-game",
      "from-google-doc-to-rest-rise",
    ],
  },
  {
    id: "talks",
    kind: "talks",
    enabled: true,
    eyebrow: "On stage",
    title: "Talks about teams, systems and making better work possible.",
    itemIds: ["frictionless-movement-leaddev"],
  },
  {
    id: "about",
    kind: "about",
    enabled: true,
    eyebrow: "About",
    title: "A product lead with an engineering background, and a persistent need to make things.",
    body: "I have spent my career helping teams make better product decisions. Building native apps, games and small experiments gives me a direct view of what happens after the roadmap — when the idea meets the code, the store and a real user.",
  },
];

export function validateHomeSections(sections: HomeSection[]) {
  const sectionIds = new Set<string>();

  sections.forEach((section) => {
    if (sectionIds.has(section.id)) {
      throw new Error(`Homepage config contains duplicate section id: ${section.id}`);
    }
    sectionIds.add(section.id);

    if (section.kind === "projects") {
      const projectIds = new Set<string>();
      section.rows.forEach((row) => {
        row.projectIds.forEach((projectId) => {
          if (!projectById.has(projectId)) {
            throw new Error(`Homepage references unknown project: ${projectId}`);
          }
          if (projectIds.has(projectId)) {
            throw new Error(`Homepage repeats project: ${projectId}`);
          }
          projectIds.add(projectId);
        });
      });
    }

    if (section.kind === "writing") {
      section.itemIds.forEach((id) => {
        if (!writingById.has(id)) throw new Error(`Homepage references unknown writing item: ${id}`);
      });
    }

    if (section.kind === "talks") {
      section.itemIds.forEach((id) => {
        if (!talkById.has(id)) throw new Error(`Homepage references unknown talk: ${id}`);
      });
    }
  });
}
