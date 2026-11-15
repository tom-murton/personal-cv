/*
 * The stage's own record of each world: order, colours, title face, caption, links and the
 * App Store listing that decides its status. Names, kinds, years and lines come from Sanity
 * for the six projects already published there; the four rows that are new to the site
 * (TachoClear, CutRoof, PAT Logbook, WeEvolve) carry their copy here until Tom publishes
 * Sanity records for them. Each new line is that product's own live site headline.
 */

export interface WorldTokens {
  bg: string;
  fg: string;
  dim: string;
  accent: string;
  font: string;
  titleStyle?: string;
}

export interface WorldRecord {
  slug: string;
  no: string;
  /** App Store id: when the lookup returns it, the row is Live with that version and date. */
  appStoreId?: string;
  /** Words before the version in the fact line, when the fact comes from the App Store. */
  factPrefix?: string;
  /** A fixed fact line, for worlds with no listing of their own. */
  fact?: string;
  note?: string;
  site?: { href: string; label: string };
  /** Copy for rows that are not yet in Sanity. Sanity wins when a record with this slug appears. */
  fallback?: { name: string; kind: string; year: string; line: string; status: string };
  /** Small image for the plain list and the no-script world page. */
  still?: { src: string; alt: string };
  tokens: WorldTokens;
}

export const orbitTokens: WorldTokens = {
  bg: "#0d0e12", fg: "#f3f4f0", dim: "#9ca6a8", accent: "#b8e7f0", font: '"Bricolage Grotesque"',
};

export const worlds: WorldRecord[] = [
  {
    slug: "lightscout", no: "01", appStoreId: "6748341779", factPrefix: "Live on the App Store",
    note: "Golden hour is the sun between 4° below the horizon and 6° above it, as the LightScout app defines it, worked out for each guide’s coordinates. Photographs are never graded.",
    site: { href: "https://www.lightscout.app", label: "Visit LightScout" },
    still: { src: "/stage/img/icons/lightscout.png", alt: "LightScout app icon" },
    tokens: { bg: "#0c0a08", fg: "#f3f4ec", dim: "#b9b4a8", accent: "#f59e0b", font: '"Instrument Serif"', titleStyle: "font-style:italic;font-weight:400;letter-spacing:-.02em" },
  },
  {
    slug: "level-best", no: "02", appStoreId: "6793469335", factPrefix: "Live on the App Store",
    note: "Speeds from the 20 m protocol, played at 12× speed.",
    site: { href: "https://levelbest.weevolve.app/", label: "Visit Level Best" },
    still: { src: "/stage/img/icons/level-best.png", alt: "Level Best app icon" },
    tokens: { bg: "#0b0c0e", fg: "#f4f5f0", dim: "#a8aba3", accent: "#d7ff00", font: '"Big Shoulders"', titleStyle: "text-transform:uppercase;font-weight:800;letter-spacing:-.01em" },
  },
  {
    slug: "warden", no: "03", appStoreId: "6789813322", factPrefix: "Live on the App Store",
    note: "Read the room before you move. The board is a diagram of the rule; the screen is the real game.",
    site: { href: "https://tom-murton.github.io/warden/", label: "Visit Warden" },
    still: { src: "/stage/img/icons/warden.png", alt: "Warden app icon" },
    tokens: { bg: "#0b1c1e", fg: "#f1e6c8", dim: "#9db3b0", accent: "#e3bd72", font: '"Bricolage Grotesque"', titleStyle: "text-transform:uppercase;letter-spacing:.03em;font-weight:500" },
  },
  {
    slug: "rest-rise", no: "04", appStoreId: "6757304704", factPrefix: "Live on iOS and Android",
    note: "Drag the orb to move the night on.",
    site: { href: "https://restrise.health/", label: "Visit Rest + Rise" },
    still: { src: "/stage/img/icons/rest-rise.png", alt: "Rest + Rise app icon" },
    tokens: { bg: "#1b2240", fg: "#f6f1e7", dim: "#c9c3d6", accent: "#f2d9a0", font: '"Fraunces"', titleStyle: "font-weight:300;letter-spacing:-.03em" },
  },
  {
    slug: "gaming-benchmark", no: "05",
    note: "Scores as published on shipagame.weevolve.app, read 15 Nov 2026.",
    site: { href: "https://shipagame.weevolve.app/", label: "See the benchmark" },
    still: { src: "/stage/img/icons/ringbloom.png", alt: "Ringbloom, one of the two benchmark games" },
    tokens: { bg: "#071933", fg: "#eef2f6", dim: "#8ea4b8", accent: "#e2b566", font: '"Bricolage Grotesque"', titleStyle: "font-weight:600" },
  },
  {
    slug: "marketing-engine", no: "06", fact: "Internal tool · no public build",
    tokens: { bg: "#14161a", fg: "#f3f4f0", dim: "#9ca6a8", accent: "#b8e7f0", font: '"Bricolage Grotesque"', titleStyle: "font-weight:600" },
  },
  {
    slug: "tachoclear", no: "07", appStoreId: "6794922343", factPrefix: "Live on the App Store",
    note: "TachoClear is a planning aid, not the legal record — your tachograph is. Not legal advice.",
    site: { href: "https://tachoclear.weevolve.app/", label: "Visit TachoClear" },
    fallback: { name: "TachoClear", kind: "iOS app", year: "2026", status: "Live", line: "A clearer view of your working day." },
    still: { src: "/stage/img/icons/tachoclear.png", alt: "TachoClear app icon" },
    tokens: { bg: "#0b1b2b", fg: "#f4f7fa", dim: "#a9b8c6", accent: "#38bdf8", font: '"Overpass"', titleStyle: "font-weight:800;letter-spacing:-.04em" },
  },
  {
    slug: "cutroof", no: "08", appStoreId: "6809116588", factPrefix: "Live on the App Store",
    note: "The calculator’s default example: 4800 span, 35° pitch, 32 ridge.",
    site: { href: "https://cutroof.weevolve.app/", label: "Visit CutRoof" },
    fallback: { name: "CutRoof", kind: "iOS app", year: "2026", status: "Live", line: "Every rafter on the roof, with the sum that produced it." },
    still: { src: "/stage/img/icons/cutroof.png", alt: "CutRoof app icon" },
    tokens: { bg: "#f5f0e5", fg: "#2a251e", dim: "#6b6256", accent: "#9a4408", font: '"Routed Gothic"', titleStyle: "text-transform:uppercase;letter-spacing:.01em;font-weight:400" },
  },
  {
    slug: "pat-logbook", no: "09", appStoreId: "6807410738", factPrefix: "Live on the App Store",
    note: "Real app data. Example job. Press the label to stamp.",
    site: { href: "https://patbook.weevolve.app/", label: "Visit PAT Logbook" },
    fallback: { name: "PAT Logbook", kind: "iOS app", year: "2026", status: "Live", line: "The test is done. The paperwork can be too." },
    still: { src: "/stage/img/icons/patbook.png", alt: "PAT Logbook app icon" },
    tokens: { bg: "#ffffff", fg: "#0c0d0c", dim: "#55585a", accent: "#157347", font: '"Archivo"', titleStyle: "font-weight:800;font-stretch:120%;letter-spacing:-.045em" },
  },
  {
    slug: "weevolve", no: "10", fact: "The home for the apps · weevolve.app",
    site: { href: "https://weevolve.app/", label: "Visit WeEvolve" },
    fallback: { name: "WeEvolve", kind: "Publisher", year: "2026", status: "Live", line: "Apps for work, life and a little play." },
    tokens: { bg: "#f6f2e9", fg: "#17332b", dim: "#55695f", accent: "#17332b", font: '"Bricolage Grotesque"', titleStyle: "font-weight:600" },
  },
];

/** The two benchmark games: their store versions make the benchmark's fact line. */
export const benchmarkGames = [
  { name: "Ringbloom", appStoreId: "6789952808" },
  { name: "Brinkball", appStoreId: "6791686352" },
];

/** Every App Store id the build looks up. */
export const appStoreIds = [
  ...worlds.flatMap((world) => (world.appStoreId ? [world.appStoreId] : [])),
  ...benchmarkGames.map((game) => game.appStoreId),
];

/** The "how it is made" line. Drafted for Tom to edit. */
export const madeLine = "Made with AI agents. Claude Code, Codex and Gemini write the code. I decide what gets built and review what comes back.";

export const xLink = { label: "Build notes on X", href: "https://x.com/TomMurtonTweets" };
