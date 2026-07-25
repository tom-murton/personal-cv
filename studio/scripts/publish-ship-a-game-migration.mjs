import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-01" });
const articleId = "portfolio-article-can-ai-ship-a-fun-ios-game";
const projectId = "portfolio-project-gaming-benchmark";

const article = await client.fetch(
  `*[_id == $articleId][0]{_id, body}`,
  { articleId },
);

if (!article?.body?.length) {
  throw new Error("The published Ship a Game article or its body is missing.");
}

const targetText = "The models can build the games.";
let updatedParagraph = false;
const body = article.body.map((block) => {
  const text = (block.children ?? []).map((child) => child.text ?? "").join("");
  if (!text.startsWith(targetText)) return block;
  updatedParagraph = true;
  return {
    ...block,
    children: [{
      ...block.children[0],
      text: "The models can build the games. Ringbloom, built through Codex, and Brinkball, started in Claude Code, are both live on the App Store. Brinkball reached its first submission with two nudges and no fixes or rescues; its later improvement round also exposed an important model-fallback complication that the full report documents. That is a much stronger—and messier—result than generating a playable web prototype in a browser tab.",
    }],
  };
});

if (!updatedParagraph) {
  throw new Error("The expected stale Ship a Game paragraph was not found; nothing was published.");
}

const links = [
  {
    _type: "portfolioLink",
    _key: "benchmark-home",
    label: "Explore the live benchmark",
    href: "https://shipagame.weevolve.app/",
  },
  {
    _type: "portfolioLink",
    _key: "brinkball-report",
    label: "Read the Brinkball report",
    href: "https://shipagame.weevolve.app/games/brinkball",
  },
  {
    _type: "portfolioLink",
    _key: "ringbloom-report",
    label: "Read the Ringbloom report",
    href: "https://shipagame.weevolve.app/games/ringbloom",
  },
];

await client
  .transaction()
  .patch(articleId, (patch) => patch.set({ body, links }))
  .patch(projectId, (patch) => patch.set({
    status: "Running",
    summary: "A public benchmark of whether frontier AI models can research, build, improve and ship real paid iOS games.",
    currentNote: "Ringbloom and Brinkball are live, with all three benchmark rounds published on the standalone benchmark site.",
    link: {
      _type: "portfolioLink",
      label: "See the benchmark",
      href: "https://shipagame.weevolve.app/",
    },
  }))
  .commit({ autoGenerateArrayKeys: true });

console.log("Published the canonical Ship a Game links and current live status to Sanity.");
