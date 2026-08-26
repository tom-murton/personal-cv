import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { collections } from "../src/content/collections";
import { projectArticles } from "../src/content/projectArticles";

interface RouteMetadata {
  path: string;
  title: string;
  description: string;
  robots?: "index,follow" | "noindex,nofollow";
}

const origin = "https://tommurton.com";
const outputDirectory = join(process.cwd(), "dist");
const sourceHtml = await readFile(join(outputDirectory, "index.html"), "utf8");

const legacyRedirects = [
  "/home / 308",
  "/about /#about 308",
  "/work /cv 308",
  "/experience /cv 308",
  "/articles /writing 308",
  "/instagram https://www.instagram.com/tom.murton 307",
  "/projects/ship-a-game https://shipagame.weevolve.app/ 308",
];

const parameterisedRedirects = [
  "/projects/ship-a-game/:game https://shipagame.weevolve.app/games/:game 308",
];

const publicRoutes: RouteMetadata[] = [
  {
    path: "/projects",
    title: "Projects",
    description: collections.projects.description,
  },
  {
    path: "/writing",
    title: "Writing",
    description: collections.writing.description,
  },
  ...projectArticles.map((article) => ({
    path: `/writing/${article.id}`,
    title: article.title,
    description: article.description,
  })),
  {
    path: "/talks",
    title: "Talks",
    description: collections.talks.description,
  },
  {
    path: "/cv",
    title: "CV",
    description: collections.cv.description,
  },
];

const archivedDesignPaths = [
  "/admin",
  "/designs",
  "/designs/workbench",
  "/designs/log",
  "/designs/magazine",
  "/designs/gallery",
  "/designs/index",
  "/designs/universe",
  "/designs/reel",
  "/designs/desk",
  "/designs/claude-aurora",
  "/designs/claude-kinetic",
  "/designs/claude-terminal",
  "/designs/claude-afterglow",
  "/designs/claude-workbench",
  "/designs/claude-journal",
  "/designs/claude-index",
  "/designs/claude-playground",
  "/designs/claude-poster",
];

const privateRoutes: RouteMetadata[] = archivedDesignPaths.map((path) => ({
  path,
  title: path === "/admin" ? "Admin" : "Archived design study",
  description: path === "/admin"
    ? "Private portfolio administration."
    : "An archived design study from the development of Tom Murton's portfolio.",
  robots: "noindex,nofollow",
}));

function escapeAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceMeta(html: string, route: RouteMetadata) {
  const documentTitle = `${route.title} — Tom Murton`;
  const canonical = new URL(route.path, origin).toString();
  const description = escapeAttribute(route.description);
  const title = escapeAttribute(documentTitle);
  const robots = route.robots ?? "index,follow";

  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`);
}

for (const route of [...publicRoutes, ...privateRoutes]) {
  const routeDirectory = join(outputDirectory, route.path.slice(1));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(join(routeDirectory, "index.html"), replaceMeta(sourceHtml, route));
}

const routeRewrites = [...publicRoutes, ...privateRoutes].flatMap((route) => [
  `${route.path} ${route.path}/index.html 200`,
  `${route.path}/ ${route.path}/index.html 200`,
]);

await writeFile(
  join(outputDirectory, "_redirects"),
  `${[...legacyRedirects, "/ /index.html 200", ...routeRewrites, ...parameterisedRedirects].join("\n")}\n`,
);

console.log(`Generated route metadata for ${publicRoutes.length} public and ${privateRoutes.length} private routes.`);
