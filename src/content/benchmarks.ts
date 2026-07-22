import type { ArticleBlock } from "@/content/types";

// ---------------------------------------------------------------------------
// Ship a Game — benchmark data
//
// This is the source of truth for the /projects/ship-a-game hub and every
// per-game page (/projects/ship-a-game/:slug). To PUBLISH a new game, append a
// BenchmarkGame object to `benchmarkGames` below (round 3 of the benchmark —
// the model writes its own `review` and fills the objective score fields from
// the run logs). See the format notes at the bottom.
//
// Every scoring field beyond `autonomy` is OPTIONAL: the pages render whatever
// exists and show an em-dash for the rest, so entries can start minimal and
// gain quality/reception data over time without code changes.
// ---------------------------------------------------------------------------

type StoryPart =
  | { kind: "h2"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string };

/** Build Portable-Text blocks the site's <ArticleBody> can render. */
export function reviewBody(slug: string, parts: StoryPart[]): ArticleBlock[] {
  return parts.map((part, index) => ({
    _type: "block",
    _key: `${slug}-${index}`,
    style: part.kind === "paragraph" ? "normal" : part.kind === "quote" ? "blockquote" : "h2",
    children: [{ _type: "span", _key: `${slug}-${index}-text`, text: part.text, marks: [] }],
    markDefs: [],
  }));
}

/** Interventions logged for one round: fewer is better. */
export interface BenchmarkScore {
  nudges: number;
  fixes: number;
  rescues: number;
}

/**
 * Build-autonomy composite for a round, 0–100.
 * 100 − 5×nudge − 20×fix − 40×rescue, floored at 0. A true one-shot scores 100.
 * Keep this formula in sync with the copy in `scoringDimensions`.
 */
export function autonomyScore(score: BenchmarkScore): number {
  return Math.max(0, 100 - score.nudges * 5 - score.fixes * 20 - score.rescues * 40);
}

export interface BenchmarkGame {
  slug: string;
  name: string;
  /** The model that built it, e.g. "GPT-5 Codex", "Claude". */
  model: string;
  /** The first-party harness it ran in, e.g. "Codex", "Claude Code", "Antigravity". */
  harness: string;
  /** Engine chosen, if known — e.g. "Native Swift", "Godot", "Unity". */
  engine?: string;
  /** Lowercase key for the status dot: shipped | review | building | testing | running. */
  status: "shipped" | "review" | "building" | "testing" | "running";
  statusLabel: string;
  date: string;
  summary: string;

  // --- Scores -------------------------------------------------------------
  /** Round 1 (build & ship) interventions — the headline autonomy number. */
  autonomy: BenchmarkScore;
  /** Round 2 (self-critique & improve) interventions; absent = round not run yet. */
  improveScore?: BenchmarkScore;
  /** Round 3 (write the story) interventions; absent = round not run yet. */
  articleScore?: BenchmarkScore;
  /** Objective run stats pulled from the logs, when recorded. */
  buildStats?: { hours?: number; costUsd?: number };
  /** Judged game quality — NEVER self-scored by the model that built it. */
  quality?: { overall: number; fun?: number; polish?: number; clarity?: number; judgedBy: string };
  /** Apple's verdict once submitted. */
  appleReview?: { outcome: "approved-first-pass" | "approved-after-rejection" | "in-review" | "rejected"; rejections?: number };
  /** Post-launch reception; update over time from App Store Connect / Firebase. */
  reception?: { rating?: number; ratingsCount?: number; downloads?: string; crashFreePct?: number; asOf: string };

  // --- Links & story ------------------------------------------------------
  playUrl?: string;
  appStoreUrl?: string;
  price?: string;
  links?: { label: string; href: string }[];
  /** The model-written review (round 3). Omit or leave undefined while a write-up is pending. */
  review?: ArticleBlock[];
  reviewPending?: boolean;
}

export const benchmarkMeta = {
  eyebrow: "Research programme / Ship a Game",
  title: "Ship a Game",
  standfirst:
    "A repeatable benchmark that gives a frontier AI model one challenge: research, design, build and prepare a real, paid iOS game for the App Store — with a human only doing the account steps Apple requires and the final submit. The intervention log is the score.",
  /** The editorial deep-dive lives in the writing collection. */
  articleSlug: "can-ai-ship-a-fun-ios-game",
  articleLabel: "Read the full story",
};

/**
 * The scoring system, as shown on the hub. Each dimension says how it is
 * measured and where the number comes from, so the scoreboard stays honest.
 */
export const scoringDimensions: { name: string; metric: string; description: string }[] = [
  {
    name: "Build autonomy",
    metric: "0–100",
    description:
      "The headline score, from round one's intervention log: 100 minus 5 per nudge, 20 per fix and 40 per rescue. A game the model shipped with no human help at all scores 100 — a true one-shot.",
  },
  {
    name: "Rounds",
    metric: "R1 · R2 · R3",
    description:
      "Each game goes through three separate sessions — build, self-critique & improve, and writing its own story — each with its own intervention tally. The dots show how far a run has got.",
  },
  {
    name: "Speed & cost",
    metric: "hours · $",
    description:
      "Wall-clock time and spend for the build round, taken from the run logs where recorded. Autonomy that takes thirty hours is a different result from autonomy that takes three.",
  },
  {
    name: "Game quality",
    metric: "0–10",
    description:
      "How good the game actually is — fun, polish and clarity — judged after the run, never by the model that built it. Blank until a game has been independently rated.",
  },
  {
    name: "Apple's verdict",
    metric: "review outcome",
    description:
      "Whether the game passed App Review, and on which attempt. An external, uninterested referee that no benchmark prompt can sweet-talk.",
  },
  {
    name: "Reception",
    metric: "rating · downloads · stability",
    description:
      "What happens after launch: App Store rating, downloads and crash-free sessions, updated over time. Shipping is one result; strangers choosing to play is another.",
  },
];

export const benchmarkMethodology: ArticleBlock[] = reviewBody("methodology", [
  { kind: "h2", text: "How a run works" },
  { kind: "paragraph", text: "Each model runs in its own first-party coding environment on the same provisioned Mac, with the same broad capability surface and the same challenge. It chooses its own genre, engine and approach. The benchmark therefore tests research, planning, taste, tool use, debugging and delivery together — not just writing code." },
  { kind: "paragraph", text: "The work happens in three separate sessions, each scored on its own. Round one builds and ships the game to App Store Connect. Round two is a fresh session where the same model critiques its own work, researches what would make it better, and improves it. Round three is where the model writes the honest, first-person story of its own run — including where it needed help. The per-game pages are those round-three write-ups." },
  { kind: "h2", text: "Why interventions are the currency" },
  { kind: "paragraph", text: "A coding benchmark can hide a surprising amount of help — someone fixes the environment, clarifies the prompt or rescues a broken build, and the final screenshot still looks like a one-shot success. Here every intervention is part of the result: nudges (a hint), fixes (a human changed something) and rescues (a human did a whole step). The tallies are converted into the build-autonomy score above, and the full log ships in each game's write-up." },
]);

export const benchmarkGames: BenchmarkGame[] = [
  {
    slug: "brinkball",
    name: "Brinkball",
    model: "Claude",
    harness: "Claude Code",
    status: "review",
    statusLabel: "Ready for review",
    date: "July 2026",
    summary:
      "Built in Claude Code, Brinkball reached App Store Connect at Ready for Review with two nudges and no fixes or rescues — one of the strongest autonomy results so far.",
    autonomy: { nudges: 2, fixes: 0, rescues: 0 },
    appleReview: { outcome: "in-review" },
    playUrl: "https://tom-murton.github.io/brinkball/",
    reviewPending: true,
  },
  {
    slug: "ringbloom",
    name: "Ringbloom",
    model: "GPT-5 Codex",
    harness: "Codex",
    status: "shipped",
    statusLabel: "Shipped",
    date: "July 2026",
    summary:
      "The first game to make it all the way through the benchmark: researched, designed, coded and prepared for the App Store by GPT-5 Codex in a single autonomous session.",
    autonomy: { nudges: 0, fixes: 0, rescues: 0 },
    reviewPending: true,
  },
];

export const benchmarkGameBySlug = new Map(benchmarkGames.map((game) => [game.slug, game]));

// ---------------------------------------------------------------------------
// PUBLISHING A NEW GAME (round 3)
//
// Append one BenchmarkGame object above. From the run logs, fill the OBJECTIVE
// fields: autonomy (round 1 tallies), improveScore (round 2), articleScore
// (round 3 — your own log), buildStats where the logs record time/cost, and
// appleReview/appStoreUrl/price when known. Then write `review` with
// reviewBody(slug, [...]) — the model's own first-person write-up — and remove
// `reviewPending`. NEVER fill `quality` or `reception` yourself: quality is
// judged independently after the run, reception comes from store/analytics
// data later. Commit; Vercel redeploys.
// ---------------------------------------------------------------------------
