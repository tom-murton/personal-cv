#!/usr/bin/env node
// Structural check of the built public site. Run after `npm run build`.
// Verifies, in dist/: every sitemap URL has a rendered page with a title and a self-referencing
// canonical; the sitemap, robots.txt and llms.txt exist; each page's internal links and stage
// assets resolve to files (or to a rule in _redirects); and the page count is not zero.
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const origin = "https://tommurton.com";
const problems = [];
const fail = (message) => problems.push(message);
const exists = (path) => access(path).then(() => true, () => false);

const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8").catch(() => "");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length === 0) fail("sitemap.xml is missing or lists no URLs");

for (const file of ["robots.txt", "llms.txt", "_redirects"]) {
  if (!(await exists(join(dist, file)))) fail(`dist/${file} is missing`);
}

const redirects = (await readFile(join(dist, "_redirects"), "utf8").catch(() => ""))
  .split("\n").map((line) => line.trim().split(/\s+/)[0]).filter((source) => source?.startsWith("/"));

const fileFor = (pathname) => {
  const clean = decodeURIComponent(pathname.replace(/\/$/, ""));
  return clean === "" ? "index.html" : `${clean.slice(1)}/index.html`;
};

for (const url of urls) {
  if (!url.startsWith(origin)) { fail(`${url}: not on ${origin}`); continue; }
  const pathname = new URL(url).pathname;
  const html = await readFile(join(dist, fileFor(pathname)), "utf8").catch(() => null);
  if (html === null) { fail(`${pathname}: no rendered page at dist/${fileFor(pathname)}`); continue; }
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!title) fail(`${pathname}: empty or missing <title>`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== url) fail(`${pathname}: canonical ${canonical ?? "(none)"} should be ${url}`);

  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    if (href.startsWith("//")) continue;
    const target = href.replace(/\/$/, "");
    const ok = (target !== "" && (await exists(join(dist, target)))) || (await exists(join(dist, fileFor(href)))) || redirects.includes(href) || redirects.includes(target);
    if (!ok) fail(`${pathname}: link to ${href} resolves to nothing in dist/`);
  }
}

if (problems.length) {
  console.error(`verify-site: ${problems.length} problem(s)\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`verify-site: ${urls.length} sitemap URLs rendered with titles, canonicals and resolving internal links.`);
