/*
 * One set of rules for turning published content into what the stage shows. The build runs it on
 * the Sanity response (or the checked-in fallback); the browser runs it again on a fresh Sanity
 * response after load, so an edit published in the Studio appears without a deploy and is never
 * undone by stale CMS fields.
 *
 *   merge(content, worlds, store) -> { hero, rows, stories, articles, talks, shipped, wrote }
 *
 * content: { hero, projects[], writing[], talks[] } in the shape of src/content/types.ts
 * worlds:  the records in src/content/worlds.ts (order, notes, links, fallbacks, App Store ids)
 * store:   { [appStoreId]: { version, versionDate, firstReleased } } from the build's App Store lookup
 *
 * Rules:
 * - The index order and the ten rows come from the world records; a row missing from Sanity uses
 *   its record's fallback copy, so the four new rows survive until Tom publishes them.
 * - A project whose App Store listing the lookup returned is Live with that version and date,
 *   whatever the CMS says.
 * - The headline keeps its comma and a typographic apostrophe.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/** "2026-11-09" or "9 November 2026" -> "9 Nov 2026"; anything else is returned as given. */
export function shortDate(value) {
  if (!value) return "";
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) return `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}`;
  m = /^(\d{1,2}) ([A-Za-z]+) (\d{4})$/.exec(value.trim());
  if (m) { const i = LONG.indexOf(m[2].toLowerCase()); if (i >= 0) return `${+m[1]} ${MONTHS[i]} ${m[3]}`; }
  return value;
}

/** "19 July 2026" -> "2026-07-19" for <time datetime>; "" when it cannot be read. */
export function isoDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  let m = /^(\d{1,2}) ([A-Za-z]+) (\d{4})$/.exec(value.trim());
  if (m) { const i = LONG.indexOf(m[2].toLowerCase()); if (i >= 0) return `${m[3]}-${String(i + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`; }
  m = /^([A-Za-z]+) (\d{4})$/.exec(value.trim());
  if (m) { const i = LONG.indexOf(m[1].toLowerCase()); if (i >= 0) return `${m[2]}-${String(i + 1).padStart(2, "0")}`; }
  return "";
}

function headline(title) {
  let t = String(title || "").trim().replace(/'/g, "’");
  if (t && !/[,.;:!?]$/.test(t)) t += ",";
  return t;
}

export function merge(content, worlds, store, games) {
  const bySlug = new Map((content.projects || []).map((p) => [p.id, p]));
  const stories = (content.writing || []).filter((w) => w.articleType === "project-story" || (w.body && w.body.length));
  const storyFor = new Map();
  for (const s of stories) if (s.projectId && !storyFor.has(s.projectId)) storyFor.set(s.projectId, s.id);

  const rows = worlds.map((w) => {
    const p = bySlug.get(w.slug);
    const f = w.fallback || {};
    const listing = w.appStoreId && store[w.appStoreId];
    let status = (p && p.status) || f.status || "";
    let fact = w.fact || "";
    if (listing) {
      status = "Live";
      fact = `${w.factPrefix || "Live on the App Store"} · v${listing.version} · first released ${shortDate(listing.firstReleased)}`;
    }
    if (w.slug === "gaming-benchmark" && games) {
      const live = games.filter((g) => store[g.appStoreId]).map((g) => `${g.name} ${store[g.appStoreId].version}`);
      fact = live.length ? `${status || "Running"} · ${live.join(" and ")} ${live.length > 1 ? "are" : "is"} live on the App Store` : fact;
    }
    // A Sanity link to this site's own retired Level Best pages is replaced by the record's live product link.
    const sanityLink = p && p.href && /^https?:\/\//.test(p.href) ? { href: p.href, label: p.hrefLabel || w.site?.label } : null;
    const site = w.site || sanityLink;
    return {
      slug: w.slug,
      no: w.no,
      name: (p && p.name) || f.name || w.slug,
      kind: (p && p.kind) || f.kind || "",
      year: (p && p.year) || f.year || "",
      status,
      line: (p && p.summary) || f.line || "",
      fact,
      note: w.note || "",
      site: site ? { href: site.href, label: site.label } : null,
      story: storyFor.get(w.slug) || "",
      tokens: w.tokens,
    };
  });

  const external = (content.writing || []).filter((w) => !stories.includes(w));
  const listings = worlds.filter((w) => w.appStoreId && store[w.appStoreId]);
  const latest = listings.sort((a, b) => (store[b.appStoreId].versionDate || "").localeCompare(store[a.appStoreId].versionDate || ""))[0];
  const latestRow = latest && rows.find((r) => r.slug === latest.slug);

  return {
    hero: {
      eyebrow: content.hero?.eyebrow || "",
      title: headline(content.hero?.title),
      accent: content.hero?.accentTitle || "",
      intro: content.hero?.introduction || "",
    },
    rows,
    stories: stories.map((s) => ({ slug: s.id, title: s.title, description: s.description, date: s.date, project: s.projectId || "", projectName: s.projectName || "" })),
    articles: external.map((a) => ({ title: a.title, description: a.description, date: a.date, href: a.link || "" })),
    talks: (content.talks || []).map((t) => ({ title: t.title, event: t.event, description: t.description, date: t.date, href: t.link })),
    shipped: latestRow ? { name: latestRow.name, version: store[latest.appStoreId].version, date: shortDate(store[latest.appStoreId].versionDate), href: latestRow.site?.href || "" } : null,
    wrote: stories[0] ? { title: stories[0].title, date: shortDate(stories[0].date), slug: stories[0].id } : null,
  };
}
