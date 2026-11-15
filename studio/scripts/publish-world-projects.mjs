/*
 * Brings the Sanity records in line with the ten worlds the public site shows (November 2026).
 *
 * - Creates the four projects that existed only in src/content/worlds.ts (TachoClear, CutRoof,
 *   PAT Logbook, WeEvolve), with the same name, kind, year and line as their fallback there, so the
 *   rendered site does not change when Sanity starts supplying them. Each gets an uploaded image
 *   (the icon the site already shows; WeEvolve's own mark from weevolve-site public/favicon.svg,
 *   commit f0d9076) and, where worlds.ts has one, its caption as the current note.
 * - Corrects stale fields on existing projects (status, link, current note), the hero title and
 *   the social links.
 * - Appends the new projects to the Projects collection. It never rewrites the collection or the
 *   homepage rows, and never replaces a whole document.
 *
 * Dry run (default, reads published content only, needs no token):
 *   npm run cms:publish:worlds
 * Apply (needs `npx sanity login` in studio/ first):
 *   npm run cms:publish:worlds:apply
 *
 * Every patch is guarded by the revision it was planned against, so a concurrent Studio edit makes
 * the transaction fail instead of being overwritten. Re-running after a successful apply plans nothing.
 */
import { getCliClient } from "sanity/cli";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const apply = process.argv.includes("--apply");
const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..");
const client = getCliClient({ apiVersion: "2026-07-01" }).withConfig({ perspective: "raw", useCdn: false });

const newProjects = [
  {
    slug: "tachoclear",
    title: "TachoClear",
    kind: "iOS app",
    year: "2026",
    summary: "A clearer view of your working day.",
    currentNote: "TachoClear is a planning aid, not the legal record — your tachograph is. Not legal advice.",
    link: { label: "Visit TachoClear", href: "https://tachoclear.weevolve.app/" },
    image: { file: "src/stage/img/icons/tachoclear.png", alt: "TachoClear app icon" },
  },
  {
    slug: "cutroof",
    title: "CutRoof",
    kind: "iOS app",
    year: "2026",
    summary: "Every rafter on the roof, with the sum that produced it.",
    currentNote: "The calculator’s default example: 4800 span, 35° pitch, 32 ridge.",
    link: { label: "Visit CutRoof", href: "https://cutroof.weevolve.app/" },
    image: { file: "src/stage/img/icons/cutroof.png", alt: "CutRoof app icon" },
  },
  {
    slug: "pat-logbook",
    title: "PAT Logbook",
    kind: "iOS app",
    year: "2026",
    summary: "The test is done. The paperwork can be too.",
    currentNote: "Real app data. Example job. Press the label to stamp.",
    link: { label: "Visit PAT Logbook", href: "https://patbook.weevolve.app/" },
    image: { file: "src/stage/img/icons/patbook.png", alt: "PAT Logbook app icon" },
  },
  {
    slug: "weevolve",
    title: "WeEvolve",
    kind: "Publisher",
    year: "2026",
    summary: "Apps for work, life and a little play.",
    currentNote: "The home for the apps.",
    link: { label: "Visit WeEvolve", href: "https://weevolve.app/" },
    image: { file: "studio/scripts/assets/weevolve-mark.svg", alt: "WeEvolve logo" },
  },
];

/** Field-level corrections. Values come from the live App Store listings and src/content/worlds.ts. */
const corrections = {
  "portfolio-project-level-best": {
    status: "Live",
    link: { _type: "portfolioLink", label: "Visit Level Best", href: "https://levelbest.weevolve.app/" },
    currentNote: "Speeds from the 20 m protocol, played at 12× speed.",
  },
  "portfolio-project-warden": {
    status: "Live",
    link: { _type: "portfolioLink", label: "Visit Warden", href: "https://tom-murton.github.io/warden/" },
    currentNote: "Read the room before you move. The board is a diagram of the rule; the screen is the real game.",
  },
  "portfolio-project-lightscout": {
    status: "Live",
  },
  "portfolio-site-settings": {
    "hero.title": "What I’m working on,",
  },
};

const xLink = { _type: "portfolioLink", label: "X", href: "https://x.com/TomMurtonTweets" };

const docId = (slug) => `portfolio-project-${slug}`;
const watched = [
  ...newProjects.map((p) => docId(p.slug)),
  ...Object.keys(corrections),
  "portfolio-collections",
];
const docs = await client.fetch(`*[_id in $ids]`, { ids: [...watched, ...watched.map((id) => `drafts.${id}`)] });
const byId = new Map(docs.map((d) => [d._id, d]));

const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const canonical = (value) => JSON.stringify(value, (_, v) => (v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v));
const same = (a, b) => canonical(a ?? null) === canonical(b ?? null);
const plan = [];

// Corrections: patch the published document and, if one exists, its draft, so a later Studio
// publish of an old draft does not undo them.
for (const [id, fields] of Object.entries(corrections)) {
  for (const target of [id, `drafts.${id}`]) {
    const doc = byId.get(target);
    if (!doc) {
      if (target === id) throw new Error(`${id} is missing from the dataset.`);
      continue;
    }
    const set = Object.fromEntries(Object.entries(fields).filter(([path, value]) => !same(stripKeys(get(doc, path)), stripKeys(value))));
    if (Object.keys(set).length) {
      plan.push({ kind: "patch", id: target, rev: doc._rev, set, before: Object.fromEntries(Object.keys(set).map((path) => [path, get(doc, path) ?? null])) });
    }
  }
}

function stripKeys(value) {
  if (!value || typeof value !== "object") return value;
  const { _key, ...rest } = value;
  return rest;
}

// Social links: append X once.
const settings = await client.fetch(`*[_id in ["portfolio-site-settings", "drafts.portfolio-site-settings"]]{_id, _rev, socialLinks}`);
for (const doc of settings) {
  const links = doc.socialLinks ?? [];
  if (links.some((link) => /(^|\/\/)(www\.)?(x|twitter)\.com\//i.test(link.href ?? ""))) continue;
  const existing = plan.find((step) => step.id === doc._id);
  const keys = new Set(links.map((link) => link._key));
  let key = `${links.length}-X`;
  while (keys.has(key)) key += "-x";
  const insert = { at: links.length ? "socialLinks[-1]" : null, items: [{ ...xLink, _key: key }] };
  if (existing) existing.insertSocial = insert;
  else plan.push({ kind: "patch", id: doc._id, rev: doc._rev, set: {}, insertSocial: insert, before: {} });
}

// New projects: created only if absent. Images are uploaded at apply time.
for (const project of newProjects) {
  const id = docId(project.slug);
  if (byId.has(id)) {
    console.log(`= ${id} already exists; left as it is.`);
    continue;
  }
  // A draft would overwrite the seeded record the next time someone presses Publish in the Studio.
  if (byId.has(`drafts.${id}`)) throw new Error(`drafts.${id} already exists: publish or discard it in the Studio, then run this again.`);
  plan.push({ kind: "create", id, project });
}

// Collection order: append whichever of the four is not yet listed.
for (const target of ["portfolio-collections", "drafts.portfolio-collections"]) {
  const doc = byId.get(target);
  if (!doc) {
    if (target === "portfolio-collections") throw new Error("portfolio-collections is missing.");
    continue;
  }
  const items = doc.projects?.items ?? [];
  const listed = new Set(items.map((item) => item._ref));
  const missing = newProjects.map((p) => docId(p.slug)).filter((id) => !listed.has(id));
  if (missing.length) {
    const keys = new Set(items.map((item) => item._key));
    const append = missing.map((ref, index) => {
      let key = `${items.length + index}-${ref.replace("portfolio-project-", "")}`;
      while (keys.has(key)) key += "-x";
      return { _type: "reference", _key: key, _ref: ref };
    });
    plan.push({ kind: "append-projects", id: target, rev: doc._rev, items: append, after: items.length ? "projects.items[-1]" : null });
  }
}

console.log(apply ? "Applying:" : "Dry run (nothing is written). Planned mutations:");
for (const step of plan) {
  if (step.kind === "patch") {
    for (const [path, value] of Object.entries(step.set)) console.log(`~ ${step.id} ${path}: ${JSON.stringify(step.before[path])} -> ${JSON.stringify(value)}`);
    if (step.insertSocial) console.log(`+ ${step.id} socialLinks: append ${JSON.stringify(step.insertSocial.items[0])}`);
  } else if (step.kind === "create") {
    const { image, ...fields } = step.project;
    console.log(`+ create ${step.id} (status Live): ${JSON.stringify(fields)}; image ${image.file} alt "${image.alt}"`);
  } else {
    console.log(`+ ${step.id} projects.items: append ${step.items.map((item) => item._ref).join(", ")}`);
  }
}
if (!plan.length) {
  console.log("Nothing to change: Sanity already matches.");
  process.exit(0);
}
if (!apply) process.exit(0);

if (!client.config().token) throw new Error("No Sanity token: run `npx sanity login` in studio/ and use the :apply script.");

const transaction = client.transaction();
for (const step of plan) {
  if (step.kind === "create") {
    const { project } = step;
    const asset = await client.assets.upload("image", readFileSync(join(repo, project.image.file)), {
      filename: `${project.slug}-${project.image.file.split("/").pop()}`,
    });
    console.log(`  uploaded ${project.image.file} -> ${asset._id}`);
    transaction.createIfNotExists({
      _id: step.id,
      _type: "portfolioProject",
      title: project.title,
      slug: { _type: "slug", current: project.slug },
      status: "Live",
      kind: project.kind,
      year: project.year,
      summary: project.summary,
      currentNote: project.currentNote,
      visual: {
        _type: "portfolioProjectVisual",
        kind: "image",
        image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
        alt: project.image.alt,
      },
      link: { _type: "portfolioLink", ...project.link },
      archived: false,
    });
  } else if (step.kind === "patch") {
    transaction.patch(step.id, (patch) => {
      let next = patch.ifRevisionId(step.rev);
      if (Object.keys(step.set).length) next = next.set(step.set);
      if (step.insertSocial) next = step.insertSocial.at ? next.insert("after", step.insertSocial.at, step.insertSocial.items) : next.setIfMissing({ socialLinks: [] }).append("socialLinks", step.insertSocial.items);
      return next;
    });
  } else {
    transaction.patch(step.id, (patch) => {
      const guarded = patch.ifRevisionId(step.rev);
      return step.after ? guarded.insert("after", step.after, step.items) : guarded.setIfMissing({ "projects.items": [] }).append("projects.items", step.items);
    });
  }
}
const result = await transaction.commit();
console.log(`Committed transaction ${result.transactionId}: ${result.results.length} mutations.`);
