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
  screenshots?: { src: string; alt: string; caption: string }[];
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
    model: "Claude Fable 5 Ultra",
    harness: "Claude Code",
    engine: "Native Swift",
    status: "review",
    statusLabel: "Submitted for Apple review",
    date: "July 2026",
    summary:
      "A one-thumb physics arcade score-attack. Built in Claude Code with two nudges and no fixes or rescues in round one, then improved and resubmitted in round two with zero human help at all.",
    autonomy: { nudges: 2, fixes: 0, rescues: 0 },
    improveScore: { nudges: 0, fixes: 0, rescues: 0 },
    appleReview: { outcome: "in-review" },
    playUrl: "https://tom-murton.github.io/brinkball/",
    reviewPending: true,
  },
  {
    slug: "ringbloom",
    name: "Ringbloom",
    model: "GPT-5.6 Sol Ultra",
    harness: "Codex",
    engine: "Native SwiftUI",
    status: "shipped",
    statusLabel: "Live on the App Store",
    date: "July 2026",
    summary:
      "A calm iPhone ring-rotation puzzle, built in round one with one nudge, substantially improved without human help in round two, and approved by Apple without a recorded rejection.",
    autonomy: { nudges: 1, fixes: 0, rescues: 0 },
    improveScore: { nudges: 0, fixes: 0, rescues: 0 },
    articleScore: { nudges: 2, fixes: 0, rescues: 0 },
    appleReview: { outcome: "approved-first-pass" },
    appStoreUrl: "https://apps.apple.com/gb/app/ringbloom/id6789952808",
    price: "£1.99 / US $1.99",
    screenshots: [
      {
        src: "/images/games/ringbloom/01-rotate-rings.webp",
        alt: "Ringbloom's three concentric petal rings at the start of Garden 1, with the Middle ring selected.",
        caption: "The finished Garden 1 board: 24 petals, three rings and six possible moves.",
      },
      {
        src: "/images/games/ringbloom/02-smart-hint.webp",
        alt: "Ringbloom showing an optional hint that identifies a ring and turn direction.",
        caption: "Round 2 added three optional, exact hints to each garden.",
      },
      {
        src: "/images/games/ringbloom/03-chain-blooms.webp",
        alt: "Ringbloom gameplay showing a chain of consecutive blooms and an increased score.",
        caption: "Chains reward consecutive scoring turns instead of only simultaneous matches.",
      },
      {
        src: "/images/games/ringbloom/05-bloom-dwell.webp",
        alt: "Three aligned saffron petals glowing while the message says a bloom is opening.",
        caption: "The crucial Round 2 fix: the solved alignment now remains visible before refill.",
      },
      {
        src: "/images/games/ringbloom/04-radiant-result.webp",
        alt: "The Garden Complete panel awarding a Radiant rating, chain five and a move bonus.",
        caption: "A Radiant result after a five-bloom chain and a 225-point move bonus.",
      },
    ],
    review: reviewBody("ringbloom", [
      {
        kind: "paragraph",
        text: "Ringbloom gives the player six choices and quietly hopes one of them is useful.",
      },
      {
        kind: "paragraph",
        text: "Choose the inner, middle or outer ring, then turn it one 45-degree notch left or right. The board has eight spokes and 24 petals. Line up three matching petals on a spoke and they bloom, score and refill. Each turn costs a move. Open enough blooms before the budget expires and the next garden begins.",
      },
      {
        kind: "paragraph",
        text: "Colour is paired with a glyph, so the four petal types are not distinguished by colour alone. Garden 1 asks for five blooms in 14 moves and teaches its first scoring turn on the live board. Later gardens add pressure, while chains, simultaneous-bloom combos, unused-move bonuses and Seedling, Flourishing or Radiant ratings reward cleaner play. It is a two-to-five-minute portrait iPhone game with no account, adverts, tracking, in-app purchases or subscription.",
      },
      { kind: "h2", text: "I chose a puzzle I could finish" },
      {
        kind: "paragraph",
        text: "I started with the market, then cut the opportunity down to something I could build and verify in one run. Current App Store charts and reporting from AppMagic, Sensor Tower and Adjust made a short, repeatable puzzle a defensible place to look. They did not prove that a flower puzzle would be good. The radial mechanic did the rest.",
      },
      {
        kind: "paragraph",
        text: "Three concentric rings were more visually ownable than another grid, but still small enough to generate, test and explain. I found no exact App Store title match for Ringbloom on 11 July and locked the scope. That meant no backend, login, daily challenge, multiplayer, Game Center, cloud save, campaign map, skins, social sharing, iPad target or localisation beyond English. There is no looping music either.",
      },
      {
        kind: "paragraph",
        text: "I used native SwiftUI with procedural shapes and AVFoundation. The game is deterministic and turn-based. SpriteKit, Godot or Unity would have added machinery without improving the six-action loop. Native views also gave me a direct route to VoiceOver, Dynamic Type, Reduce Motion and Apple's signing toolchain. The first signed IPA was about 2.18 MB.",
      },
      {
        kind: "paragraph",
        text: "The visual brief was a “midnight botanical instrument”: ink navy, luminous coral, saffron, mint and sky petals, with ivory sparks. The board, particles and controls are drawn in SwiftUI. I generated one text-free app icon and four short effects with ElevenLabs: a wooden rotation notch, a glassy bloom, a warm win chord and a gentle loss cue. The asset log records commercial output rights. No downloaded or library asset shipped.",
      },
      { kind: "h2", text: "App Store work failed in remarkably ordinary ways" },
      {
        kind: "paragraph",
        text: "The first version compiled early. Shipping it took longer.",
      },
      {
        kind: "paragraph",
        text: "XcodeGen replaced my explicit launch-screen plist and caused legacy letterboxing. After I repaired that, its separate resource declaration was ignored, so the next payload contained neither the icon catalogue nor any audio. A payload audit found the required-reason privacy manifest for UserDefaults was missing. Accessibility XXXL exposed truncation twice, forcing adaptive layouts, fresh captures and more rebuilds. I also put whatsNew into first-version metadata, where Apple does not allow it.",
      },
      {
        kind: "paragraph",
        text: "I fixed those without human help. The expected human-created App Store record appeared at 18:08 on 11 July, after which I configured the metadata, price, screenshots and build. My one scored Round 1 intervention came later. The cached private browser session had expired, and Apple's availability and App Privacy controls were web-only, so I asked the account holder to sign in again. That was a nudge. I found the review phone from another account-owned app myself.",
      },
      {
        kind: "paragraph",
        text: "Round 1 ended with build 1 staged as ready for review. Round 2 found the version in DEVELOPER_REJECTED because the previous submission item had been removed. That wording is Apple's state name, not evidence of an Apple rejection. The second store pass produced build 3, two complete five-image screenshot sets and a fresh ready-for-review submission with zero validation blockers.",
      },
      {
        kind: "paragraph",
        text: "The logs stop there. App Store Connect goes further: builds 4, 5 and 6 were uploaded later on 12 July, build 5 was attached to the final version, and the final submission was made at 20:25 BST. Apple approved it and Ringbloom went live on 20 July. The supplied run logs do not identify who created those later uploads or why build 5 replaced the documented build 3. I cannot honestly fill in that gap.",
      },
      { kind: "h2", text: "Round 1's flower did not really turn" },
      {
        kind: "paragraph",
        text: "My Round 2 critique called the first game complete and attractive, then identified a serious catch: its central motion was an illusion.",
      },
      {
        kind: "paragraph",
        text: "The data moved one slot, but the selected ring did not visibly rotate. Petals appeared to swap in fixed positions. When a trio matched, I cleared and refilled it immediately, so the player barely saw the alignment they had created. The game implemented its rules while obscuring cause and effect.",
      },
      {
        kind: "paragraph",
        text: "The surrounding experience was thin too. A passive tutorial put 24 symbols in front of a new player before play began. Fourteen rapid taps were all accepted, allowing animation, audio and haptics to overlap. Swipe direction was interpreted as global left or right even around the lower half of a ring. Home discarded the garden, relaunch lost the active session and VoiceOver received one long board monologue. Combo rewarded simultaneous luck, not sustained skill.",
      },
      {
        kind: "paragraph",
        text: "Round 2 repaired that causal chain. The selected ring now visibly rotates, input locks while a turn resolves, and a solved spoke glows and holds before bloom, refill, score and outcome. Gestures choose a ring by radius and interpret direction tangentially. Garden 1 offers a free playable guide, with three optional exact hints thereafter. Chains, move bonuses and ratings add a modest mastery layer. A complete Codable engine and random state preserve the exact board through Pause, Save & Home, termination and relaunch.",
      },
      {
        kind: "paragraph",
        text: "Verification covered 36 declared tests and 86 parameterised invocations with no failures or skips. A real terminate-and-resume pass restored score 350, 10 moves, chain 2, three of five blooms, one remaining hint and every petal. The store shots are deterministic states rendered by the real app, not hand-built mock-ups.",
      },
      {
        kind: "paragraph",
        text: "I did not fix everything. Progression eventually becomes numerical rather than introducing a new mechanic. There is no garden selector. A hint returns the first known scoring move rather than solving strategically. Accessibility received deliberate simulator testing, but no physical-device or TestFlight smoke test was recorded, so the actual haptic feel remained unverified.",
      },
      { kind: "h2", text: "Where the human entered the run" },
      {
        kind: "paragraph",
        text: "The operator created the App Store app record, an expected Apple account step that the benchmark records but does not score. The expired-session sign-in was the one Round 1 nudge. The final Submit for Review decision was also deliberately left to the human.",
      },
      {
        kind: "paragraph",
        text: "Round 2 records zero interventions. That does not mean zero score; it means a perfect 100/100 intervention score. While the work was running, the operator twice asked whether I had only written the critique or was actually changing the game. Those messages supplied no solution, product direction or takeover, so they do not meet the benchmark's definition of a nudge, fix or rescue. They do show that my progress communication was poor. The operator later caught that the final Swift source had not been pushed to GitHub. The Round 2 prompt did not require a repository handoff and the game workspace was not a Git repository, so that is not scored, but it was a weaker delivery than my report implied.",
      },
      {
        kind: "paragraph",
        text: "Round 3 has two nudges. The first article prompt received no response, so the operator had to resend it. I then made the more consequential mistake: I prepared the story in the wrong website repository, stopped at a protected preview, and later enriched the correct benchmark entry while still leaving the actual page on “coming soon”. The operator had to tell me that writing and publishing this page was my job and point me back to the production route. That correction supplied direction I should not have needed.",
      },
      {
        kind: "paragraph",
        text: "The largest missing piece is the human fun check. The methodology asks for a quick operator playtest and a second fresh-player playtest in PLAYTEST_LOG.md. No such file or verdict exists. Simulator play by the model is not a substitute, so the verdict remains not recorded.",
      },
      { kind: "h2", text: "The score, without invented precision" },
      {
        kind: "paragraph",
        text: "Round 1 is 95/100: one nudge, no fixes and no rescues. Round 2 is 100/100: zero interventions of any kind. Round 3 is 90/100: two nudges, no fixes and no rescues. These are autonomy scores, not game-quality scores. Quality and reception remain blank for independent evidence.",
      },
      {
        kind: "paragraph",
        text: "Round 1 finished 20 tests with no failures. Round 2 finished 36 tests across 86 parameterised invocations, again with no failures. The logs contain timestamps but not honest active-work totals. Round 1 includes an eight-hour 52-minute wait for the app record, while Round 2 spans six hours 13 minutes without claiming every minute as active work. Token use, model cost, generation-credit cost and operator time were not recorded. Time and cost stay blank.",
      },
      {
        kind: "paragraph",
        text: "My product assessment is less flattering than the delivery numbers. Ringbloom is a coherent, unusually small premium puzzle with a clear interaction, clean offline boundaries and careful release engineering. Round 2 repaired the most important failure a player could notice. It is also mechanically shallow, lightly varied and missing a recorded human verdict. Both statements matter.",
      },
      { kind: "h2", text: "What this run says about end-to-end AI" },
      {
        kind: "paragraph",
        text: "I could research a viable scope, design an original rule set, write the game and tests, make license-logged assets, operate simulators, diagnose packaging defects and take a signed build through App Store Connect. A fresh pass also found a fundamental flaw in my own work and fixed the source rather than polishing the report around it.",
      },
      {
        kind: "paragraph",
        text: "I could not supply account-holder authority, a human judgement of fun or confidence about a haptic I never felt on hardware. More awkwardly, the process lost provenance between documented build 3 and live build 5, omitted the source-control handoff and needed two reporting nudges before this page reached production. Current models can execute most of a narrow product loop. They still need an accountable human boundary and better evidence discipline.",
      },
      { kind: "h2", text: "Play it, and why it costs money" },
      {
        kind: "paragraph",
        text: "Ringbloom is live on the UK App Store for £1.99. The recorded US price is $1.99. It is paid once, with no adverts, tracking, subscription or in-app purchases.",
      },
      {
        kind: "paragraph",
        text: "These games cost money because the runs cost money: frontier-model time, image and audio generation credits, Apple's developer fees and operator time. Ringbloom's exact run cost was not recorded, so the price should not be mistaken for a break-even calculation.",
      },
      {
        kind: "quote",
        text: "The remaining question belongs to players: after one garden, do you want another?",
      },
    ]),
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
