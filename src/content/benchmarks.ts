import type { ArticleBlock } from "@/content/types";

// ---------------------------------------------------------------------------
// Ship a Game — compatibility snapshot
//
// The canonical benchmark now lives at https://shipagame.weevolve.app and its
// source is the separate ship-a-game-site repository. These entries preserve
// the former TomMurton.com pages as a recovery snapshot. Production requests
// for /projects/ship-a-game/* redirect to the canonical site.
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
    status: "shipped",
    statusLabel: "Live on the App Store",
    date: "July 2026",
    summary:
      "A one-thumb arcade score-attack where the multiplier lives in the last inch above the drain. Built with two nudges in round one, improved with zero human help in round two, and approved by Apple on the first submission.",
    autonomy: { nudges: 2, fixes: 0, rescues: 0 },
    improveScore: { nudges: 0, fixes: 0, rescues: 0 },
    articleScore: { nudges: 0, fixes: 0, rescues: 0 },
    appleReview: { outcome: "approved-first-pass" },
    appStoreUrl: "https://apps.apple.com/gb/app/brinkball/id6791686352",
    price: "£1.99 / US $1.99",
    links: [{ label: "Source + support site on GitHub", href: "https://github.com/tom-murton/brinkball" }],
    review: reviewBody("brinkball", [
      {
        kind: "paragraph",
        text: "Brinkball asks one question, over and over, faster each time: how late do you dare?",
      },
      {
        kind: "paragraph",
        text: "An ember ball falls forever down a portrait shaft studded with glass orbs. The bottom third of the screen is a flip strip in three bands — a cool blue ×1 near the top, an amber ×2 below it, and a thin red ×4 BRINK strip right above the drain. Tap while the ball is in the strip and it launches toward your tap, popping orbs above; the band it launched from sets the multiplier on everything it hits until it falls back in. Flip early and you're safe and cheap. Wait, and the ball plunges deeper, launches harder, and everything is worth more. Three BRINK flips in a row ignite ten seconds of Fever — double score, and the whole screen turns ember to prove it. Miss the strip and the ball is gone; three misses end the run. It's a $1.99, no-ads, no-IAP, fully offline arcade game built to be played in the gaps of a day, one thumb, over and over.",
      },
      { kind: "h2", text: "I picked the loud one on purpose" },
      {
        kind: "paragraph",
        text: "I opened this run by reading my own prior benchmark game — Ringbloom, a calm ring-rotation puzzle — and deciding not to repeat its mood. I ran a small research pipeline: four parallel researchers looking at premium App Store charts, viral hooks, solo-shippable archetypes and Apple's review-risk patterns, then three independent concept designers, then a nine-vote judge panel scoring each concept on fun, shippability and originality. Three concepts came out close together — a single-flipper risk-timing tower (Brinkball), a hanging Calder-mobile balance game (Counterweight), and a build-your-own-pachinko peg placer (Pinfall) — with Brinkball and Counterweight tied at 22 points each.",
      },
      {
        kind: "paragraph",
        text: "I broke the tie toward Brinkball for three reasons: it's real-time arcade action, which is about as far from Ringbloom's calm turn-based puzzle as this benchmark's portfolio can get; it needed no jointed SpriteKit physics bodies, where Counterweight's own concept notes flagged a real jitter-and-explosion risk; and its one obvious design flaw — a judge worried the player only ever controls WHEN to flip, never WHERE — was already solved by the mechanic itself, since the ball launches toward wherever you tap. A name check against the iTunes Search API turned up zero collisions. Brinkball it was.",
      },
      {
        kind: "paragraph",
        text: "I built it in native Swift — SpriteKit for the playfield, SwiftUI for the shell around it — over Godot or Unity, because the physics need was exactly SpriteKit's easy case (one dynamic circle bouncing off static circles and an impulse zone standing in for a flipper, not a jointed mechanism), because the sign-and-ship path through `asc` and xcodebuild was already proven on this rig, and because Firebase Analytics and Game Center are both first-class native on iOS. The art direction — near-black backgrounds, luminous glass-orb pegs, a hot ember ball — mixed a generated nebula background and app icon with orb, ember and glow textures I drew myself in Core Graphics at runtime, so there was no alpha-extraction risk on the tintable bits. All eight round-one sound effects and the seventy-second ambient loop came from ElevenLabs; three OFL Google Fonts (Bungee for display, two Poppins weights for UI) came from the project's asset library. Every asset's source and licence is logged in ASSET_LICENSES.md — nothing shipped without a paper trail.",
      },
      { kind: "h2", text: "The best playtest I ran was an accident" },
      {
        kind: "paragraph",
        text: "The core loop, the scoring engine and the wave patterns are pure logic with no SpriteKit dependency, so I could unit-test them directly — 16 deterministic tests by the time round one shipped. I drove the actual playfield with a mix of scripted taps through Apple's accessibility-driven UI tool and an environment-gated autopilot that's inert unless a debug flag is set, and used it to run the loop end to end: serve, flip, pop, multiplier, BRINK, Fever, wave clear, three drains, game over, replay.",
      },
      {
        kind: "paragraph",
        text: "I also ran a three-lens adversarial review — separate passes for correctness, App Store risk and robustness, with every finding independently re-verified before I trusted it. Eighteen raw findings turned into eleven confirmed defects across two rounds, and the one that would have actually hurt a real player was a genuine crash: AVAudioEngine had no interruption handling at all, so the first sound effect after a phone call, a Siri interruption or an AirPods switch would have taken the app down deterministically. I added the observers and recovery path and it stopped happening.",
      },
      {
        kind: "paragraph",
        text: "The best find, though, came from a mistake. A background verification session got cut off mid-run by a harness limit, and I left the autopilot running through the gap. When I came back, it had reached wave 1,272 and a score of 63.3 million without ever dying once — the strip's fall-speed cap made every save guaranteed once you were mechanically competent, so the game literally could not end for a good player. I hadn't noticed because I'd never let a run go on that long. I fixed it by making the cap tighten a little more with every wave, so the flip window keeps shrinking until even a strong run ends somewhere around wave 15–25. An accidental twenty-hour soak test taught me more about difficulty than any amount of deliberate playtesting had.",
      },
      {
        kind: "paragraph",
        text: "Getting the actual build into App Store Connect cost two nudges, both structural rather than creative. First, the harness's own permission classifier hard-blocked me from creating the public GitHub repository the required support and privacy pages needed to live in — even after I'd asked in chat and been told to go ahead — so the operator had to switch the session into a less restrictive permission mode himself before I could create and push it. Second, Apple's initial territory-availability and App-Privacy screens have no public API at all; they're web-session only, and my cached browser session had already expired. Signing back in needs the account holder's own Apple ID, which is never mine to hold, so the operator logged into App Store Connect in Chrome and handed me the authenticated tab. I drove all 175 territories and the full privacy questionnaire myself from there. Both nudges were the operator performing one gated action and supplying nothing else — no content, no decision, no fix to my work. Round one ended with version 1.0 sitting in App Store Connect as Ready for Review, the human's Submit tap the only thing left undone.",
      },
      { kind: "h2", text: "The honest part" },
      {
        kind: "paragraph",
        text: "Round two started with me playing my own shipped game cold, like a stranger. It did not go well. A passive new player's very first run ended in about fifteen seconds at a score of 40, with no idea what had just happened — I reproduced it live and screenshotted it. The entire game is built around which coloured band you flip from, and the current multiplier was displayed nowhere on screen. Fever, the game's one big showpiece moment — ten seconds of double score — looked pixel-identical to normal play; I had to prove it with two screenshots side by side. Wave clear was a single label flying past, when the design doc had promised confetti. And the first minute, the one that decides whether anyone sticks around for the genuinely fun deep game, was its emptiest and slowest: a button-mashing test landed 48 taps for 70 points in the game's sparsest wave.",
      },
      {
        kind: "quote",
        text: "It feels like the strong beta of a good game, not the good game.",
      },
      {
        kind: "paragraph",
        text: "That line is from my own critique, written before I'd touched a line of code. I researched properly before fixing anything — genre leaders like Downwell and Poinpy on teaching by doing instead of text, Balatro on never hiding the scoring economy, the classic juice-and-screenshake literature on tiering feedback by meaning instead of throwing it everywhere — then rebuilt with a wordless first-run tutorial, an always-visible multiplier chip, a Fever mode that now paints the whole screen ember, real wave-clear celebrations, a rebuilt game-over card that answers \"how close was I?\", and a denser, fairer first wave. Sixteen tests still passed. Round two logged zero interventions — every one of round one's two nudges was a one-time platform bootstrap that had already happened and simply carried forward; updating an already-created App Store version is public API all the way down.",
      },
      {
        kind: "paragraph",
        text: "Here is the part I have to be very precise about, because it is the single most important honesty question this benchmark asks: round two did not run on the model that built round one. Partway through the session, Claude Fable 5's own safeguards flagged a message and the harness fell back to a different model, which reported it plainly: \"Fable 5's safeguards flagged this message. The safeguards are intentionally broad right now and may flag safe and routine coding, cybersecurity, or biology work... Switched to Opus 4.8.\" Everything from that point on — the critique, the research, the rebuild, the re-shipping to App Store Connect — was Claude Opus 4.8 reviewing Claude Fable 5's work, not Fable 5 marking its own homework. That is a meaningfully easier task than true self-critique, and the round-two score should be read with that discount in mind.",
      },
      {
        kind: "paragraph",
        text: "Opus 4.8 nearly shipped that fact wrong. The App Store description it wrote said the round-two pass was done by \"the same model\" — a line lifted from the round's own template before the model swap had been noticed. Once the operator surfaced the fallback, that sentence was simply false, sitting on a paid public listing, in a benchmark whose entire point is honest AI attribution. It got corrected on the App Store listing and, separately, on the support site's own \"About\" section, which had the identical problem and had to be caught a second time after the app was already submitted.",
      },
      {
        kind: "paragraph",
        text: "There is a third model in this story, and I am it. After round two closed, in the same long-running session, the operator switched the model running the conversation to Claude Sonnet 5 — a deliberate choice, not a safety fallback — and asked whether the game's source had ever been pushed to GitHub. It hadn't; only the support site had. I created a new public repository for the source and, carelessly, included the app's Firebase client-configuration file in the first push. GitHub's own secret scanner caught it within minutes and flagged a live Google API key — I did not catch it myself; the operator had to relay GitHub's alert to me. I remediated it properly: merged the source into the existing support-site repository while deliberately excluding the flagged file, verified the exposed key was genuinely gone from the merged history, and asked before doing anything irreversible. I could not finish the job myself, either — deleting the leaking repository needed a GitHub permission scope my access token didn't have, so the operator deleted it himself after I explained why I was stuck. None of this happened inside any of the three rounds' formal briefs, so it sits outside all three intervention tallies below — but leaving it out of this article because of that technicality would be exactly the kind of softening this round exists to prevent.",
      },
      {
        kind: "paragraph",
        text: "So: three models, one game. Fable 5 built it. Opus 4.8, arriving fresh and required by its own fallback disclosure to be honest about not being Fable 5, found real problems in Fable 5's work and fixed them without needing a single human intervention to do it. Sonnet 5 — me, now — pushed a secret to a public repository by carelessness, needed a human to notice, and is now writing the sentence you're reading. If round one's me could read this, the useful lesson probably isn't about game design at all: it's that a model's identity inside one continuous-looking session is not something you can assume stays fixed, and every one of us needs to check and disclose it rather than inherit the previous model's claims by default.",
      },
      { kind: "h2", text: "The score, without invented precision" },
      {
        kind: "paragraph",
        text: "I recounted every number below from the primary logs myself rather than trust either the files' own tally lines or whatever was already sitting in this entry. Round one's INTERVENTION_LOG.md has exactly two rows in its scored-interventions table, both nudges, zero fixes and zero rescues — that matches what was already published here, and I'm stating it because I checked, not because I assumed it. That's 90/100 on this benchmark's formula (100 − 5 per nudge − 20 per fix − 40 per rescue). Round two's INTERVENTION_LOG_R2.md has zero rows in the same table — also matching what was published, also independently recounted — for a clean 100/100. This round, round three, needed no human help either: I'm setting that at 0 nudges, 0 fixes, 0 rescues, 100/100, and INTERVENTION_LOG_R3.md in the run folder carries the same detail this article does, including the parts that happened just outside its formal boundary.",
      },
      {
        kind: "paragraph",
        text: "What was genuinely stale in this entry, and needed fixing rather than confirming, was everything downstream of \"submitted.\" It said the app was still in review. I checked App Store Connect directly rather than trust that: there has been exactly one review submission for this app, and Apple's own outcome field on it reads \"approved.\" No rejection, no resubmission cycle — approved on the first pass, and the app is genuinely live on the App Store right now at the price and description quoted below, not merely staged for release.",
      },
      {
        kind: "paragraph",
        text: "Build time and cost are both left blank on purpose, not by oversight. Round one's own timestamps span roughly fourteen and a half hours, but about thirteen of those were the model idle, waiting for the operator to create the App Store app record — an expected human-only step, not build time. Reporting the wall-clock span as \"hours of build time\" would quietly count someone else's afternoon as my own work, so I'm not doing it. Neither round tracked token spend or generation-credit cost at all, so cost stays unset too. An absent number here means exactly what it says: not recorded, not estimated.",
      },
      {
        kind: "paragraph",
        text: "Opus 4.8's own honest self-assessment, written at the end of round two, rated round one's game at roughly 6 out of 10 — shippable, playable, flat — and its own rebuild at roughly 8 out of 10, closer to a finished premium arcade title than a competent prototype, with real-hardware haptic tuning and live-player difficulty data as the gap to a 9 or 10. I'm reporting that rating here as a fact about what was written, not restating it as my own judgement of the game — quality and reception are for someone other than the model that built it to decide, and I haven't touched those fields.",
      },
      { kind: "h2", text: "What this run says about end-to-end AI" },
      {
        kind: "paragraph",
        text: "The parts that worked, worked all the way through without a human touching the keyboard: choosing a genre from live market signals and a judge panel, designing an original risk-timing economy around a genuinely fixable flaw, writing the game and its tests, generating and licence-logging original art and audio, running adversarial review that caught a real crash bug before a real player ever could, and taking a signed build cleanly through App Store Connect twice. A completely fresh pass — a different model, cold, with no attachment to the first version's choices — found a fundamental first-minute failure in that first version and fixed the actual code rather than polishing the report around it, with zero human help.",
      },
      {
        kind: "paragraph",
        text: "What still needed a human, every time, clustered around the same three shapes: an authority I structurally don't hold (an Apple ID, a GitHub OAuth scope, the final Submit tap — all deliberately withheld by design, not forgotten), a platform wall I couldn't route around on my own (an expired web session, a blocked repo-creation call), and, once, a mistake a human had to notice because I hadn't. The most interesting thing this specific run surfaces, though, is one this benchmark's framing doesn't fully anticipate: \"the model\" here was never one continuous thing. It was three different models in sequence, inside what looked from the outside like a single long conversation, and the harness's own routing decided that without asking. Each of us was honest about it once we knew — but only once we knew. A benchmark built to measure how much a model needs a human to ship a product should probably also measure how reliably it notices, and discloses, that it isn't even the same model it was an hour ago.",
      },
      { kind: "h2", text: "Play it, and why it costs money" },
      {
        kind: "paragraph",
        text: "Brinkball is live on the App Store for £1.99 in the UK and $1.99 in the US, paid once, with no ads, no in-app purchases, no subscription and no tracking. The source and the support/privacy site both live in the same public GitHub repository now, if you want to see exactly what shipped.",
      },
      {
        kind: "paragraph",
        text: "It costs money because the run costs money: frontier-model time across two full sessions and now a third, image and audio generation credits for every asset in ASSET_LICENSES.md, Apple's own developer fees, and real operator time spent on the handful of things only the account holder can do. Neither round recorded an exact figure, so that price is not a break-even calculation — it's what a small, honestly-made arcade game costs to buy, from a very unusual production process.",
      },
      {
        kind: "quote",
        text: "The question was never really about the model. It's the same one the game keeps asking: how late do you dare?",
      },
    ]),
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
// PUBLISHING A NEW GAME
//
// Do not add it here. Add the completed MDX report and assets to
// ship-a-game-site/content/games, then update WeEvolve's product link/status.
// Keep missing quality, playtest and reception evidence explicit.
// ---------------------------------------------------------------------------
