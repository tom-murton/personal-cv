import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-01" });

const projectUpdates = {
  "portfolio-project-level-best": {
    summary: "An offline bleep test trainer for police, fire and forces fitness tests, with the main UK test variants and published pass standards.",
  },
  "portfolio-project-warden": {
    status: "Launch-staged",
    currentNote: "Signed build, store material and support site are ready; Apple account steps and a final real-device TestFlight check remain.",
  },
  "portfolio-project-rest-rise": {
    status: "Live",
    currentNote: "Live on iOS and Android; the 1.2 redesign is in review on both stores.",
  },
  "portfolio-project-gaming-benchmark": {
    currentNote: "Ringbloom is live; Brinkball is in Apple review. Quality and reception scoring remain open.",
  },
};

const articleUpdates = {
  "portfolio-article-product-focused-engineering-leader": {
    description: "Engineering leaders create more value when they treat customer problems, product discovery and business outcomes as part of the engineering job.",
    dateLabel: "23 January 2025",
    externalUrl: "https://www.linkedin.com/pulse/case-becoming-more-product-focused-engineering-leader-tom-murton-9ga7f",
  },
  "portfolio-article-bridging-product-and-engineering": {
    description: "The product and engineering gap starts when engineers arrive after discovery. Involving them earlier produces better questions, options and decisions.",
    dateLabel: "1 October 2024",
    externalUrl: "https://www.linkedin.com/pulse/bridging-gap-how-engineering-leaders-can-foster-better-tom-murton-3dvke",
  },
  "portfolio-article-in-defence-of-estimates": {
    description: "Estimates are useful when teams treat them as a shared planning tool, not a promise or a weapon. The problem is usually how they are used.",
    dateLabel: "17 January 2024",
    externalUrl: "https://www.linkedin.com/pulse/defence-estimates-tom-murton-tqbwe",
  },
  "portfolio-article-frictionless-internal-movement": {
    description: "Many companies make it easier to resign than to change teams. A deliberate transfer process gives people room to grow without leaving.",
    dateLabel: "14 September 2021",
    externalUrl: "https://www.linkedin.com/pulse/frictionless-internal-movement-tom-murton",
  },
  "portfolio-article-making-ai-app-videos-without-the-slop": {
    projectName: "Marketing Engine",
  },
};

const experienceUpdates = {
  "portfolio-experience-1": {
    period: "SEPTEMBER 2025 — JUNE 2026",
    description: "Led product across Enablement — platform and mobile — and Player Data & Management. Turned company strategy into roadmaps for several tribes and worked across engineering, compliance and operations on platform foundations and player tooling.",
    achievements: [
      "Defined roadmaps across Enablement and Player Data & Management, aligning engineering, compliance and operations",
      "Built discovery and experimentation into roadmap decisions rather than treating delivery as the only measure",
      "Explored practical uses of AI in product work and the mobile app",
    ],
  },
  "portfolio-experience-2": {
    period: "MAY 2025 — SEPTEMBER 2025",
  },
  "portfolio-experience-3": {
    period: "DECEMBER 2024 — APRIL 2025",
  },
  "portfolio-experience-4": {
    description: "Led a department of approximately 55 employees, including Software Engineers, Engineering Managers, and QA professionals. My primary objective was to grow and modernise the engineering department while working closely with Product and Design leads on the product strategy and delivery. In September, the Head of Engineering role was removed as part of a restructuring.",
  },
  "portfolio-experience-6": {
    description: "As the Engineering Manager for retention, I led Team Leads overseeing full-stack engineering teams creating solutions across web and iOS. I shaped the environment and processes needed for greater autonomy and accountability.",
  },
  "portfolio-experience-8": {
    description: "Initially led delivery across the Money platform, covering roadmaps, story mapping and prioritisation. I then took on the services platform, overseeing two teams in London and one in Minsk.",
  },
};

const newExperience = {
  _id: "drafts.portfolio-experience-engine-by-starling",
  _type: "portfolioExperience",
  title: "Portals Platform Owner",
  company: "Engine by Starling",
  companyUrl: "https://www.enginebystarling.com/",
  period: "JUNE 2026 — PRESENT",
  description: "Owns the web portals platform across Engine by Starling, working with product engineering and client experience teams to make the product consistent, useful and secure for banks around the world.",
  achievements: [],
  skills: ["Product Leadership", "Platform Products", "Fintech"],
};

function rewriteCvCopy(value) {
  if (typeof value === "string") {
    return value
      .replaceAll("modernize", "modernise")
      .replaceAll("prioritize", "prioritise")
      .replaceAll("prioritization", "prioritisation")
      .replaceAll("engineering organization", "engineering organisation")
      .replaceAll("organizational", "organisational")
      .replaceAll("utilizing", "using")
      .replaceAll("revitalized", "revitalised")
      .replaceAll("totaling", "totalling")
      .replaceAll("Lead and executed", "Led and executed")
      .replaceAll("by Implementing", "by implementing")
      .replaceAll("devops", "DevOps")
      .replaceAll("Agile Delivery managers", "Agile Delivery Managers")
      .replaceAll("back and front end", "back-end and front-end development")
      .replaceAll("Introduced innovative initiatives such as", "Introduced");
  }
  if (Array.isArray(value)) return value.map(rewriteCvCopy);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewriteCvCopy(item)]),
    );
  }
  return value;
}

function draftId(id) {
  return id.startsWith("drafts.") ? id : `drafts.${id}`;
}

function stripSystemFields(document) {
  const { _rev, _createdAt, _updatedAt, ...content } = document;
  return content;
}

async function currentDocument(id) {
  return client.fetch(
    `coalesce(*[_id == $draftId][0], *[_id == $id][0])`,
    { id, draftId: draftId(id) },
  );
}

async function updatedDraft(id, updates) {
  const current = await currentDocument(id);
  if (!current) throw new Error(`Missing Sanity document: ${id}`);
  return {
    ...stripSystemFields(current),
    ...updates,
    _id: draftId(id),
  };
}

function replaceBodyText(body, before, after) {
  let changed = false;
  const nextBody = (body ?? []).map((block) => ({
    ...block,
    children: (block.children ?? []).map((child) => {
      if (child._type !== "span" || !child.text?.includes(before)) return child;
      changed = true;
      return { ...child, text: child.text.replace(before, after) };
    }),
  }));
  if (!changed) throw new Error(`Could not find article text: ${before}`);
  return nextBody;
}

const drafts = [];

for (const [id, updates] of Object.entries(projectUpdates)) {
  drafts.push(await updatedDraft(id, updates));
}

for (const [id, updates] of Object.entries(articleUpdates)) {
  drafts.push(await updatedDraft(id, updates));
}

const somewhereId = "portfolio-article-somewhere-day-trip-planner";
const somewhere = await currentDocument(somewhereId);
if (!somewhere) throw new Error(`Missing Sanity document: ${somewhereId}`);
drafts.push({
  ...stripSystemFields(somewhere),
  _id: draftId(somewhereId),
  body: replaceBodyText(
    somewhere.body,
    "That is why it remains on the list rather than in an archive.",
    "That is why it remains active rather than moving into an archive.",
  ),
});

const talkId = "portfolio-talk-frictionless-movement-leaddev";
drafts.push(await updatedDraft(talkId, {
  description: "Companies often make it easier to resign than to change teams. This talk makes the case for frictionless internal movement and shows how a Transfer Window can work in practice.",
  externalUrl: "https://leaddev.com/culture/frictionless-movement-how-internal-mobility-transforms-engineering-culture",
}));

const experienceIds = await client.fetch(
  `*[_type == "portfolioExperience" && !(_id in path("drafts.**"))]._id`,
);
for (const id of experienceIds) {
  const current = await currentDocument(id);
  drafts.push({
    ...rewriteCvCopy(stripSystemFields(current)),
    ...(experienceUpdates[id] ?? {}),
    _id: draftId(id),
  });
}

drafts.push(newExperience);

const settingsId = "portfolio-site-settings";
drafts.push(await updatedDraft(settingsId, {
  descriptor: "Product lead · Engineering background · Solo builder",
}));

const homepageId = "portfolio-homepage";
const homepage = await currentDocument(homepageId);
if (!homepage) throw new Error(`Missing Sanity document: ${homepageId}`);
drafts.push({
  ...stripSystemFields(homepage),
  _id: draftId(homepageId),
  sections: homepage.sections.map((section) => (
    section._type === "portfolioAboutSection"
      ? {
          ...section,
          body: "I have spent my career helping teams make better product decisions. Building native apps, games and small experiments gives me a direct view of what happens after the roadmap — when the idea meets the code, the store and a real user.",
        }
      : section
  )),
});

const collectionsId = "portfolio-collections";
const collections = await currentDocument(collectionsId);
if (!collections) throw new Error(`Missing Sanity document: ${collectionsId}`);
const experienceReference = {
  _type: "reference",
  _key: "0-engine-by-starling",
  _ref: "portfolio-experience-engine-by-starling",
  _weak: true,
  _strengthenOnPublish: { type: "portfolioExperience" },
};
const cvItems = (collections.cv?.items ?? []).filter(
  (item) => item._ref !== experienceReference._ref,
);
drafts.push({
  ...stripSystemFields(collections),
  _id: draftId(collectionsId),
  cv: {
    ...collections.cv,
    items: [experienceReference, ...cvItems],
  },
});

let transaction = client.transaction();
for (const draft of drafts) transaction = transaction.createOrReplace(draft);
await transaction.commit({ autoGenerateArrayKeys: true });

const writtenIds = drafts.map((draft) => draft._id);
const verified = await client.fetch(
  `count(*[_id in $ids])`,
  { ids: writtenIds },
  { perspective: "raw" },
);

if (verified !== writtenIds.length) {
  throw new Error(`Expected ${writtenIds.length} drafts but verified ${verified}.`);
}

const verification = await client.fetch(`{
  "descriptor": *[_id == "drafts.portfolio-site-settings"][0].descriptor,
  "warden": *[_id == "drafts.portfolio-project-warden"][0]{status, currentNote},
  "restRise": *[_id == "drafts.portfolio-project-rest-rise"][0]{status, currentNote},
  "linkedinUrl": *[_id == "drafts.portfolio-article-product-focused-engineering-leader"][0].externalUrl,
  "talkUrl": *[_id == "drafts.portfolio-talk-frictionless-movement-leaddev"][0].externalUrl,
  "currentRole": *[_id == "drafts.portfolio-experience-engine-by-starling"][0]{title, company, period},
  "cvFirstRef": *[_id == "drafts.portfolio-collections"][0].cv.items[0]._ref,
  "about": *[_id == "drafts.portfolio-homepage"][0].sections[_type == "portfolioAboutSection"][0].body
}`, {}, { perspective: "raw" });

const expectedValues = [
  [verification.descriptor, "Product lead · Engineering background · Solo builder"],
  [verification.warden?.status, "Launch-staged"],
  [verification.restRise?.status, "Live"],
  [verification.linkedinUrl, "https://www.linkedin.com/pulse/case-becoming-more-product-focused-engineering-leader-tom-murton-9ga7f"],
  [verification.talkUrl, "https://leaddev.com/culture/frictionless-movement-how-internal-mobility-transforms-engineering-culture"],
  [verification.currentRole?.title, "Portals Platform Owner"],
  [verification.currentRole?.company, "Engine by Starling"],
  [verification.currentRole?.period, "JUNE 2026 — PRESENT"],
  [verification.cvFirstRef, "portfolio-experience-engine-by-starling"],
  [verification.about, "I have spent my career helping teams make better product decisions. Building native apps, games and small experiments gives me a direct view of what happens after the roadmap — when the idea meets the code, the store and a real user."],
];

for (const [actual, expected] of expectedValues) {
  if (actual !== expected) throw new Error(`Sanity verification mismatch: expected "${expected}", received "${actual}".`);
}

console.log(`Prepared and content-verified ${verified} Sanity drafts. Nothing was published.`);
