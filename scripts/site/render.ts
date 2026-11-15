/*
 * Static HTML for every public URL. The finished page is the default state: a plain, readable list
 * with the headline, the index and all article text. /stage/stage.js upgrades the same markup into
 * the stage; nothing here depends on it running.
 */
import type { ArticleBlock, Experience, WritingItem } from "../../src/content/types";
import { benchmarkGames, madeLine, orbitTokens, worlds, xLink, type WorldTokens } from "../../src/content/worlds";
import { isoDate, shortDate } from "../../src/stage/merge.js";
import type { SiteContent } from "./content";

export const origin = "https://tommurton.com";
type Row = SiteContent["merged"]["rows"][number];

export function esc(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

/* ---------- Portable Text, as ArticleBody.tsx renders it ---------- */
function spans(block: ArticleBlock) {
  return block.children.map((span) => (span.marks ?? []).reduce((html, mark) => {
    if (mark === "strong") return `<strong>${html}</strong>`;
    if (mark === "em") return `<em>${html}</em>`;
    if (mark === "underline") return `<u>${html}</u>`;
    if (mark === "strike-through") return `<s>${html}</s>`;
    const def = (block.markDefs ?? []).find((d) => d._key === mark && d._type === "link");
    if (!def) return html;
    const external = /^https?:\/\//.test(def.href);
    return `<a href="${esc(def.href)}"${external ? ' rel="noreferrer"' : ""}>${html}</a>`;
  }, esc(span.text))).join("");
}
export function portableText(blocks: ArticleBlock[] = []) {
  const out: string[] = [];
  for (let i = 0; i < blocks.length;) {
    const b = blocks[i];
    if (b.listItem) {
      const type = b.listItem, items: string[] = [];
      while (blocks[i]?.listItem === type) { items.push(`<li>${spans(blocks[i])}</li>`); i += 1; }
      out.push(type === "number" ? `<ol class="prose-list">${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
      continue;
    }
    if (b.style === "h2" || b.style === "h3") out.push(`<h3>${spans(b)}</h3>`);
    else if (b.style === "blockquote") out.push(`<blockquote>${spans(b)}</blockquote>`);
    else out.push(`<p>${spans(b)}</p>`);
    i += 1;
  }
  return out.join("\n");
}
function firstParagraph(blocks: ArticleBlock[] = []) {
  const b = blocks.find((x) => !x.style || x.style === "normal");
  return b ? b.children.map((s) => s.text).join("") : "";
}

/* ---------- pieces ---------- */
export interface PageMeta { path: string; title: string; description: string; robots?: string; home?: boolean; jsonLd?: object[] }

function head(meta: PageMeta, css: string, tokens: WorldTokens, preloadFonts = true) {
  const canonical = new URL(meta.path, origin).toString();
  const title = meta.home ? meta.title : `${meta.title} — Tom Murton`;
  const desc = esc(meta.description);
  return `<!doctype html>
<html lang="en-GB" style="--w-bg:${tokens.bg};--w-fg:${tokens.fg};--w-dim:${tokens.dim};--w-accent:${tokens.accent}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${meta.robots ?? "index,follow"}">
<meta name="author" content="Tom Murton">
<meta name="theme-color" content="${tokens.bg}">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/favicon.png">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="${meta.path.startsWith("/writing/") ? "article" : "website"}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${origin}/favicon.png">
<meta property="og:image:alt" content="Tom Murton">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${origin}/favicon.png">
${preloadFonts ? `<link rel="preload" href="/stage/fonts/bricolage-grotesque-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/stage/fonts/ahm-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>` : ""}
${(meta.jsonLd ?? []).map((ld) => `<script type="application/ld+json">${JSON.stringify(ld).replaceAll("<", "\\u003c")}</script>`).join("\n")}
<style>${css}</style>
</head>`;
}

function bar(c: SiteContent) {
  const { shipped, wrote } = c.merged;
  return `<header class="bar">
  <a class="name" href="/" data-world="orbit">Tom Murton <span>Makes things</span></a>
  <p class="status mono">
    <span><b>London</b><time id="clock">GMT</time></span>
    ${shipped ? `<span title="From the App Store, read when this page was built (${new Date().toISOString().slice(0, 10)})"><b>Shipped</b><a href="${esc(shipped.href)}">${esc(shipped.name)} ${esc(shipped.version)}</a>, ${esc(shipped.date)}</span>` : ""}
    ${wrote ? `<span><b>Wrote</b><a href="/writing/${esc(wrote.slug)}" data-sheet="story-${esc(wrote.slug)}">${esc(wrote.title)}</a>, ${esc(wrote.date)}</span>` : ""}
  </p>
</header>`;
}

function phoneFacts(c: SiteContent) {
  const { shipped, wrote } = c.merged;
  return `<p class="facts mono phone-facts">${shipped ? `Shipped <a href="${esc(shipped.href)}">${esc(shipped.name)} ${esc(shipped.version)}</a>, ${esc(shipped.date)}` : ""}${shipped && wrote ? "<br>" : ""}${wrote ? `Wrote <a href="/writing/${esc(wrote.slug)}" data-sheet="story-${esc(wrote.slug)}">${esc(wrote.title)}</a>, ${esc(wrote.date)}` : ""}</p>`;
}

function homeTitle(c: SiteContent, opts: { sub?: boolean; heading?: string } = {}) {
  const h = c.merged.hero;
  const tag = opts.sub ? "p" : "h1";
  return `<section class="title" id="title"${opts.sub ? " data-sub" : ""}>
    <p class="eyebrow mono">${esc(h.eyebrow)}</p>
    <${tag} class="h1">${esc(h.title)} <em>${esc(h.accent)}</em></${tag}>
    <p class="lede">${esc(h.intro)}</p>
    ${phoneFacts(c)}
  </section>`;
}

export function worldTitle(row: Row) {
  const links = [
    row.site ? `<a href="${esc(row.site.href)}">${esc(row.site.label)} ↗</a>` : "",
    row.story ? `<a href="/writing/${esc(row.story)}" data-sheet="story-${esc(row.story)}">Read the story →</a>` : "",
  ].join("");
  const world = worlds.find((w) => w.slug === row.slug);
  return `<p class="eyebrow mono">${esc(row.no)} / ${esc(row.kind)} · ${esc(row.year)}</p><h1 class="h1"${row.tokens.titleStyle ? ` style="${esc(row.tokens.titleStyle)}"` : ""}>${esc(row.name)}</h1><p class="lede">${esc(row.line)}</p><p class="facts mono">${esc(row.fact)}</p>${row.note ? `<p class="note">${esc(row.note)}</p>` : ""}<p class="links">${links}</p>${world?.still ? `<figure class="still"><img src="${esc(world.still.src)}" width="96" height="96" alt="${esc(world.still.alt)}"></figure>` : ""}`;
}

function rowLink(r: Row) {
  return `<li><a class="row" href="/projects/${esc(r.slug)}" data-world="${esc(r.slug)}"><span class="n">${esc(r.no)}</span><span class="nm">${esc(r.name)}</span><span class="kd">${esc(r.kind)}</span><span class="yr">${esc(r.year)}</span><span class="st">${esc(r.status)}</span></a><p class="line">${esc(r.line)}</p></li>`;
}

function index(c: SiteContent, heading = "Index") {
  const m = c.merged;
  return `<nav class="index" id="index" aria-label="Index">
    <h2 class="mono">${esc(heading)}</h2>
    <div class="index-scroll">
    <ol>
      <li class="row-home"><a class="row" href="/" data-world="orbit"><span class="n">00</span><span class="nm">Home</span><span class="kd">Orbit</span><span class="yr"></span><span class="st">Home</span></a></li>
      ${m.rows.map(rowLink).join("\n      ")}
    </ol>
    <ul class="more">
      <li><a class="row" href="/writing" data-sheet="writing"><span class="n">W</span><span class="nm">Writing</span><span class="kd">${m.stories.length} build stories</span><span class="yr">${m.stories.length}</span><span class="st">Open</span></a></li>
      <li><a class="row" href="/talks" data-sheet="talks"><span class="n">T</span><span class="nm">Talks</span><span class="kd">${esc(m.talks[0]?.event ?? "")}</span><span class="yr">${m.talks.length}</span><span class="st">Open</span></a></li>
      <li><a class="row" href="/#about" data-sheet="about"><span class="n">A</span><span class="nm">About</span><span class="kd">Product lead</span><span class="yr"></span><span class="st">Open</span></a></li>
      <li><a class="row" href="/cv"><span class="n">CV</span><span class="nm">CV ↗</span><span class="kd">Plain and printable</span><span class="yr"></span><span class="st">Open</span></a></li>
    </ul>
    </div>
    <p class="hint mono" aria-hidden="true">← → · 1 to 0 · H home · drag the dot</p>
  </nav>`;
}

const close = `<button class="sheet-close mono" type="button">Close ✕</button>`;

function writingSheet(c: SiteContent, primary: boolean) {
  const m = c.merged, H = primary ? "h1" : "h2";
  const stories = m.stories.map((s) => `<li><time datetime="${esc(isoDate(s.date))}">${esc(shortDate(s.date))}</time><div><a href="/writing/${esc(s.slug)}" data-sheet="story-${esc(s.slug)}">${esc(s.title)}</a><span>${esc(s.description)}</span></div></li>`);
  const articles = m.articles.map((a) => `<li><time datetime="${esc(isoDate(a.date))}">${esc(shortDate(a.date))}</time><div><a href="${esc(a.href)}">${esc(a.title)} ↗</a></div></li>`);
  return `<section class="sheet" id="writing" aria-labelledby="writing-h" tabindex="-1">
    ${close}
    <p class="sheet-label mono">Field notes</p>
    <${H} id="writing-h">${esc(c.writingTitle)}</${H}>
    <ol class="stories" data-stories>
      ${stories.join("\n      ")}
      ${articles.join("\n      ")}
    </ol>
  </section>`;
}

function talksSheet(c: SiteContent, primary: boolean) {
  const H = primary ? "h1" : "h2";
  return `<section class="sheet" id="talks" aria-labelledby="talks-h" tabindex="-1">
    ${close}
    <p class="sheet-label mono">On stage</p>
    <${H} id="talks-h">${esc(c.talksTitle)}</${H}>
    <ol class="stories">
      ${c.merged.talks.map((t) => `<li><time datetime="${esc(isoDate(t.date))}">${esc(t.date)}</time><div><a href="${esc(t.href)}">${esc(t.title)} ↗</a><span>${esc(t.event)}. ${esc(t.description)}</span></div></li>`).join("\n      ")}
    </ol>
  </section>`;
}

function aboutSheet(c: SiteContent) {
  const social = c.content.site.socialLinks;
  const linkedIn = social.find((s) => /linkedin/i.test(s.href));
  const github = social.find((s) => /github/i.test(s.href));
  const links = [{ label: "Read the CV", href: "/cv" }, linkedIn, xLink, github].filter(Boolean) as { label: string; href: string }[];
  return `<section class="sheet" id="about" aria-labelledby="about-h" tabindex="-1">
    ${close}
    <p class="sheet-label mono">About</p>
    <h2 id="about-h">${esc(c.about.title)}</h2>
    <p>${esc(c.about.body)}</p>
    <p>${esc(madeLine)}</p>
    <p>${links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join(" · ")}</p>
  </section>`;
}

export function storySheet(c: SiteContent, story: WritingItem, primary: boolean) {
  const H = primary ? "h1" : "h2";
  const label = story.projectName ? `Project story / ${story.projectName} · ${shortDate(story.date)}` : `Project story · ${shortDate(story.date)}`;
  return `<article class="sheet" id="story-${esc(story.id)}" aria-labelledby="story-${esc(story.id)}-h" tabindex="-1" data-project="${esc(story.projectId ?? "")}">
    ${close}
    <p class="sheet-label mono">${esc(label)}</p>
    <${H} id="story-${esc(story.id)}-h">${esc(story.title)}</${H}>
    ${portableText(story.body)}
    ${(story.links ?? []).length ? `<p>${story.links!.map((l) => `<a href="${esc(l.href)}">${esc(l.label)} ↗</a>`).join(" · ")}</p>` : ""}
    <p class="back"><a href="/writing" data-sheet="writing">← All writing</a></p>
  </article>`;
}

/* The data the engine reads: colours and title faces per world. Content stays in the HTML. */
function stageData(c: SiteContent, page: { world: string; sheet?: string }) {
  const data = {
    world: page.world,
    sheet: page.sheet ?? "",
    tokens: Object.fromEntries([["orbit", orbitTokens], ...c.merged.rows.map((r) => [r.slug, r.tokens])]),
    store: c.store,
    wrote: c.merged.wrote?.slug ?? "",
    rows: Object.fromEntries(c.merged.rows.map((r) => [r.slug, { fact: r.fact, note: r.note, site: r.site, story: r.story }])),
    worlds: worlds.map(({ tokens: _t, still: _s, ...w }) => w),
    games: benchmarkGames,
    sanity: { projectId: "jbch6ec7", dataset: "production" },
  };
  return `<script type="application/json" id="stage-data">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
}

const boot = `<script>if('noModule' in HTMLScriptElement.prototype)document.documentElement.classList.add('js')</script>`;

export interface StagePage {
  meta: PageMeta;
  world: string;
  /** which sheet is this URL's own content */
  sheet?: "writing" | "talks" | "story";
  story?: WritingItem;
  title?: "home" | "projects" | "world";
}

export function renderStagePage(c: SiteContent, css: string, page: StagePage) {
  const row = c.merged.rows.find((r) => r.slug === page.world);
  const tokens = row?.tokens ?? orbitTokens;
  const own = page.sheet === "writing" ? writingSheet(c, true) : page.sheet === "talks" ? talksSheet(c, true) : page.sheet === "story" && page.story ? storySheet(c, page.story, true) : "";
  let title: string;
  if (page.title === "world" && row) title = `<section class="title" id="title">${worldTitle(row)}</section>`;
  else if (page.title === "projects") {
    const p = c.content.collections.projects;
    title = `<section class="title" id="title"><p class="eyebrow mono">${esc(p.eyebrow)}</p><h1 class="h1">${esc(p.title)}</h1><p class="lede">${esc(p.description)}</p>${phoneFacts(c)}</section>`;
  } else title = homeTitle(c, { sub: Boolean(page.sheet) });
  const others = [page.sheet === "writing" ? "" : writingSheet(c, false), page.sheet === "talks" ? "" : talksSheet(c, false), aboutSheet(c)].join("\n  ");
  return `${head(page.meta, css, tokens)}
<body${page.world !== "orbit" ? ` data-world="${esc(page.world)}"` : ""}>
${boot}
<a class="skip" href="${own ? "#main" : "#index"}">${own ? "Skip to the article" : "Skip to the index"}</a>
${bar(c)}
<main id="main">
  ${own}
  ${title}
  ${page.title === "home" && !page.sheet ? "" : `<template id="home-title">${homeTitle(c).replace(/^<section[^>]*>|<\/section>$/g, "")}</template>`}
  ${index(c)}
  <p class="made mono">${esc(madeLine)}</p>
  ${others}
  <div class="stage" aria-hidden="true" style="background:${tokens.bg}"></div>
  <div class="dot" id="dot" aria-hidden="true"></div>
  <p class="vh" id="announce" aria-live="polite"></p>
</main>
${stageData(c, { world: page.world, sheet: page.sheet === "story" && page.story ? `story-${page.story.id}` : page.sheet })}
<script type="module" src="/stage/stage.js"></script>
</body>
</html>
`;
}

export function storyDescription(story: WritingItem) {
  return story.description || firstParagraph(story.body);
}

/* ---------- the CV: plain, fast and printable, with no stage and no script ---------- */
export function renderCv(c: SiteContent, cvCss: string) {
  const cv = c.content.collections.cv;
  const items = cv.items as Experience[];
  const row = (e: Experience) => `<li class="role">
      <p class="period">${esc(e.period)}</p>
      <div>
        <h2>${esc(e.title)}</h2>
        <p class="co"><a href="${esc(e.companyLink)}">${esc(e.company)}</a><span class="print-url"> (${esc(e.companyLink.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))})</span></p>
        <p>${esc(e.description)}</p>
        ${e.achievements?.length ? `<ul>${e.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
        ${e.skills?.length ? `<p class="skills">${e.skills.map(esc).join(" · ")}</p>` : ""}
      </div>
    </li>`;
  const social = c.content.site.socialLinks.filter((s) => /linkedin|github/i.test(s.href));
  return `${head({ path: "/cv", title: "CV", description: cv.description }, cvCss, orbitTokens)}
<body class="cv">
<header class="cv-bar"><a class="name" href="/">Tom Murton <span>Makes things</span></a><nav aria-label="Site"><a href="/projects">Projects</a> <a href="/writing">Writing</a> <a href="/talks">Talks</a> <a href="/#about">About</a></nav></header>
<main class="cv-main">
  <p class="eyebrow">${esc(cv.eyebrow)}</p>
  <h1>${esc(cv.title)}</h1>
  <p class="lede">${esc(cv.description)}</p>
  <p class="contact">${social.map((s) => `<a href="${esc(s.href)}">${esc(s.label)}</a><span class="print-url"> (${esc(s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))})</span>`).join(" · ")}</p>
  <ol class="roles">
    ${items.map(row).join("\n    ")}
  </ol>
</main>
</body>
</html>
`;
}
