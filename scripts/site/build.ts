/*
 * Writes the public site into dist/: one complete HTML document per URL, the stage engine and its
 * worlds under /stage/, the sitemap and llms.txt. Called by scripts/generate-route-html.ts after the
 * Vite build, which keeps serving /admin and /designs only.
 */
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { minify } from "terser";
import { loadContent } from "./content";
import { esc, origin, renderCv, renderStagePage, storyDescription, type StagePage } from "./render";

const root = process.cwd();

function minifyCss(css: string) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
}

async function copyStage(out: string) {
  const src = join(root, "src/stage"), dest = join(out, "stage");
  const walk = async (dir: string): Promise<string[]> => (await Promise.all((await readdir(dir, { withFileTypes: true })).map((e) => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))).flat();
  for (const file of await walk(src)) {
    const rel = relative(src, file), target = join(dest, rel);
    await mkdir(dirname(target), { recursive: true });
    if (file.endsWith(".js")) {
      const code = await readFile(file, "utf8");
      const result = await minify(code, { module: true, compress: { passes: 2 }, mangle: true, format: { comments: false } });
      await writeFile(target, result.code ?? code);
    } else if (!file.endsWith(".css")) await cp(file, target);
  }
  // Sibling sites' loop modules, vendored byte for byte with their source commits (src/worlds/vendor/README.md).
  await cp(join(root, "src/worlds/vendor"), join(dest, "vendor"), { recursive: true, filter: (p) => !p.endsWith(".md") });
}

async function writePage(out: string, path: string, html: string) {
  const dir = join(out, path === "/" ? "" : path.slice(1));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), html);
}

export async function renderPublicSite(out: string): Promise<string[]> {
  const c = await loadContent();
  const css = minifyCss(await readFile(join(root, "src/stage/site.css"), "utf8"));
  const cvCss = minifyCss(await readFile(join(root, "src/stage/cv.css"), "utf8"));
  const homeDescription = "Projects, writing and talks from product lead and solo builder Tom Murton.";
  const person = { "@context": "https://schema.org", "@type": "Person", name: "Tom Murton", url: `${origin}/`, jobTitle: "Product lead", sameAs: c.content.site.socialLinks.map((l) => l.href) };
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: "Tom Murton", url: `${origin}/` };

  const pages: StagePage[] = [
    { meta: { path: "/", title: "Tom Murton — Products, tools and experiments", description: homeDescription, home: true, jsonLd: [person, website] }, world: "orbit", title: "home" },
    { meta: { path: "/projects", title: "Projects", description: c.content.collections.projects.description }, world: "orbit", title: "projects" },
    ...c.merged.rows.map((r) => ({ meta: { path: `/projects/${r.slug}`, title: r.name, description: r.line }, world: r.slug, title: "world" as const })),
    { meta: { path: "/writing", title: "Writing", description: c.content.collections.writing.description }, world: "orbit", sheet: "writing" as const },
    { meta: { path: "/talks", title: "Talks", description: c.content.collections.talks.description }, world: "orbit", sheet: "talks" as const },
  ];
  for (const s of c.merged.stories) {
    const story = c.content.writing.find((w) => w.id === s.slug);
    if (!story?.body?.length) continue;
    const ld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: story.title, description: storyDescription(story), author: { "@type": "Person", name: "Tom Murton", url: `${origin}/` }, url: `${origin}/writing/${story.id}`, mainEntityOfPage: `${origin}/writing/${story.id}` };
    pages.push({ meta: { path: `/writing/${story.id}`, title: story.title, description: storyDescription(story), jsonLd: [ld] }, world: story.projectId && c.merged.rows.some((r) => r.slug === story.projectId) ? story.projectId : "orbit", sheet: "story", story });
  }

  for (const page of pages) await writePage(out, page.meta.path, renderStagePage(c, css, page));
  await writePage(out, "/cv", renderCv(c, cvCss));
  await copyStage(out);

  const paths = [...pages.map((p) => p.meta.path), "/cv"];
  const sitemapOrder = ["/", "/projects", "/writing", ...paths.filter((p) => p.startsWith("/writing/")), "/talks", "/cv", ...paths.filter((p) => p.startsWith("/projects/"))];
  await writeFile(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapOrder.map((p) => `  <url><loc>${origin}${p === "/" ? "/" : p}</loc></url>`).join("\n")}\n</urlset>\n`);

  const llms = [
    "# Tom Murton", "",
    `> ${c.merged.hero.intro}`, "",
    "Product lead with an engineering background. Builds native apps, games and tools with AI agents.", "",
    "## Projects", "",
    ...c.merged.rows.map((r) => `- [${r.name}](${origin}/projects/${r.slug}): ${r.line} ${r.fact}.`), "",
    "## Writing", "",
    ...c.merged.stories.map((s) => `- [${s.title}](${origin}/writing/${s.slug}): ${s.description}`),
    ...c.merged.articles.map((a) => `- [${a.title}](${a.href})`), "",
    "## More", "",
    `- [Talks](${origin}/talks)`, `- [CV](${origin}/cv)`, "",
  ].join("\n");
  await writeFile(join(out, "llms.txt"), llms);
  console.log(`Public site: ${paths.length} pages from ${c.source} content; ${esc(c.merged.rows.length)} worlds.`);
  return paths;
}
