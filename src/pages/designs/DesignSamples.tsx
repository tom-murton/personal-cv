import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Move, Pause, Play, Search, Sparkles } from "lucide-react";
import "./DesignSamples.css";

type ProjectStatus = "Shipped" | "Building" | "Testing" | "Running" | "Internal";

interface Project {
  id: "lightscout" | "warden" | "rest-rise" | "gaming-benchmark" | "marketing-engine";
  name: string;
  status: ProjectStatus;
  kind: string;
  year: string;
  summary: string;
  update: string;
}

const projects: Project[] = [
  {
    id: "lightscout",
    name: "LightScout",
    status: "Shipped",
    kind: "iOS product",
    year: "2025",
    summary: "AI-assisted location intelligence for photographers planning their next shoot.",
    update: "Live on the App Store and evolving through real-world use.",
  },
  {
    id: "warden",
    name: "Warden",
    status: "Building",
    kind: "iOS game",
    year: "2026",
    summary: "A zero-RNG tactics roguelite where every enemy move is visible before it happens.",
    update: "Reworking the core loop around a tense defend-the-wards mechanic.",
  },
  {
    id: "rest-rise",
    name: "Rest + Rise",
    status: "Testing",
    kind: "Wellbeing app",
    year: "2026",
    summary: "Time-bounded morning and evening rituals designed around the first and last hour of the day.",
    update: "Core routines are built; device testing and launch preparation come next.",
  },
  {
    id: "gaming-benchmark",
    name: "Gaming Benchmark",
    status: "Running",
    kind: "Research programme",
    year: "2026",
    summary: "A repeatable test of whether frontier AI models can research, build and ship a real iOS game.",
    update: "The first model run is moving through build, critique and release rounds.",
  },
  {
    id: "marketing-engine",
    name: "Marketing Engine",
    status: "Internal",
    kind: "Maker tool",
    year: "2026",
    summary: "A review-led system for producing and scheduling visual campaigns across several apps.",
    update: "One workflow now handles both LightScout and Rest + Rise campaigns.",
  },
];

const sampleRoutes = [
  { number: "1", name: "Living Workbench", slug: "workbench", creator: "Codex" },
  { number: "2", name: "Builder’s Log", slug: "log", creator: "Codex" },
  { number: "3", name: "Personal Magazine", slug: "magazine", creator: "Codex" },
  { number: "4", name: "Project Gallery", slug: "gallery", creator: "Codex" },
  { number: "5", name: "Maker Index", slug: "index", creator: "Codex" },
  { number: "6", name: "Project Universe", slug: "universe", creator: "Codex" },
  { number: "7", name: "Kinetic Reel", slug: "reel", creator: "Codex" },
  { number: "8", name: "Maker’s Desk", slug: "desk", creator: "Codex" },
  { number: "1", name: "Aurora OS", slug: "claude-aurora", creator: "Claude" },
  { number: "2", name: "Kinetic", slug: "claude-kinetic", creator: "Claude" },
  { number: "3", name: "Terminal", slug: "claude-terminal", creator: "Claude" },
  { number: "4", name: "Afterglow", slug: "claude-afterglow", creator: "Claude" },
  { number: "5", name: "Workbench", slug: "claude-workbench", creator: "Claude" },
  { number: "6", name: "Journal", slug: "claude-journal", creator: "Claude" },
  { number: "7", name: "Index", slug: "claude-index", creator: "Claude" },
  { number: "8", name: "Playground", slug: "claude-playground", creator: "Claude" },
  { number: "9", name: "Poster", slug: "claude-poster", creator: "Claude" },
];

const statusClass = (status: ProjectStatus) => status.toLowerCase().replace(" ", "-");

function useArchivedDesignMetadata(title: string) {
  useEffect(() => {
    document.title = `${title} — archived design study`;
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex,nofollow";
  }, [title]);
}

const PrototypeNav = ({ inverse = false }: { inverse?: boolean }) => (
  <nav className={`prototype-nav${inverse ? " prototype-nav--inverse" : ""}`} aria-label="Prototype navigation">
    <a href="#sample-projects">Projects</a>
    <a href="#sample-notes">Writing &amp; talks</a>
    <a href="#sample-about">About</a>
    <a href="#sample-cv">CV</a>
  </nav>
);

const DesignSwitcher = ({ active }: { active?: string }) => {
  const activeIndex = Math.max(0, sampleRoutes.findIndex((route) => route.slug === active));
  const activeRoute = sampleRoutes[activeIndex];
  const previousRoute = sampleRoutes[(activeIndex - 1 + sampleRoutes.length) % sampleRoutes.length];
  const nextRoute = sampleRoutes[(activeIndex + 1) % sampleRoutes.length];
  const creatorCount = sampleRoutes.filter((route) => route.creator === activeRoute.creator).length;
  useArchivedDesignMetadata(activeRoute.name);

  return (
    <nav className="design-switcher" aria-label="Switch homepage design">
      <Link className="design-switcher__compare" to="/designs">All 17</Link>
      <Link className="design-switcher__step" to={`/designs/${previousRoute.slug}`} aria-label={`Previous: ${previousRoute.name}`}>←</Link>
      <span className="design-switcher__position"><b>{activeRoute.creator}</b> {activeRoute.number}/{creatorCount}<small>{activeRoute.name}</small></span>
      <Link className="design-switcher__step" to={`/designs/${nextRoute.slug}`} aria-label={`Next: ${nextRoute.name}`}>→</Link>
    </nav>
  );
};

const Status = ({ status }: { status: ProjectStatus }) => (
  <span className={`sample-status sample-status--${statusClass(status)}`}>{status}</span>
);

const ProjectArtwork = ({ projectId, compact = false }: { projectId: Project["id"]; compact?: boolean }) => {
  if (projectId === "lightscout") {
    return (
      <div className={`project-art project-art--lightscout${compact ? " project-art--compact" : ""}`}>
        <div className="project-art__sky" aria-hidden="true" />
        <img src="/lightscout-home-screenshot.webp" alt="LightScout app home screen" />
        <span className="project-art__caption">Find the shot before the light changes</span>
      </div>
    );
  }

  if (projectId === "warden") {
    return (
      <div className={`project-art project-art--warden${compact ? " project-art--compact" : ""}`} aria-label="Abstract Warden game-board illustration">
        <div className="warden-board" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i /><i /><i />
          <b className="warden-piece warden-piece--hero" />
          <b className="warden-piece warden-piece--enemy" />
          <b className="warden-piece warden-piece--ward" />
        </div>
        <span className="project-art__wordmark">WARDEN</span>
      </div>
    );
  }

  if (projectId === "rest-rise") {
    return (
      <div className={`project-art project-art--rest${compact ? " project-art--compact" : ""}`} aria-label="Rest and Rise morning and evening illustration">
        <div className="rest-orbit" aria-hidden="true"><span /></div>
        <div className="rest-times" aria-hidden="true">
          <span><small>RISE</small> 06:45</span>
          <span><small>REST</small> 22:10</span>
        </div>
      </div>
    );
  }

  if (projectId === "gaming-benchmark") {
    return (
      <div className={`project-art project-art--benchmark${compact ? " project-art--compact" : ""}`} aria-label="Gaming Benchmark model scorecard illustration">
        <span className="benchmark-title">SHIP A GAME</span>
        <div className="benchmark-models" aria-hidden="true">
          <b>GPT</b><b>CLAUDE</b><b>GEMINI</b>
        </div>
        <div className="benchmark-score" aria-hidden="true">AUTONOMY / 01</div>
      </div>
    );
  }

  return (
    <div className={`project-art project-art--marketing${compact ? " project-art--compact" : ""}`} aria-label="Marketing workflow illustration">
      <div className="marketing-stack" aria-hidden="true">
        <span>BRIEF</span><span>CREATE</span><span>REVIEW</span><span>SHIP</span>
      </div>
      <b>Marketing<br />Engine</b>
    </div>
  );
};

const SampleFooter = ({ inverse = false }: { inverse?: boolean }) => (
  <footer className={`sample-footer${inverse ? " sample-footer--inverse" : ""}`} id="sample-cv">
    <span>Tom Murton</span>
    <span>Product lead · Engineering background · Solo builder</span>
    <a href="mailto:hello@tommurton.com">Start a conversation <ArrowUpRight size={15} /></a>
  </footer>
);

export function DesignSampleIndex() {
  useArchivedDesignMetadata("Homepage design study");

  return (
    <main className="design-samples-index">
      <header className="design-samples-index__header">
        <Link to="/" className="design-samples-index__home">tm</Link>
        <span>Homepage design study · July 2026</span>
      </header>

      <section className="design-samples-index__intro">
        <p className="design-kicker">Seventeen directions. Two design passes.</p>
        <h1>Choose the way the work should feel.</h1>
        <p>
          Eight directions from Codex and nine from Claude, all using the same body of work. Open each one at full size and decide which makes you most curious to explore a project.
        </p>
      </section>

      {(["Codex", "Claude"] as const).map((creator) => (
        <section className="design-samples-group" aria-labelledby={`${creator.toLowerCase()}-directions`} key={creator}>
          <header className="design-samples-group__header">
            <h2 id={`${creator.toLowerCase()}-directions`}>{creator} directions</h2>
            <span>{sampleRoutes.filter((route) => route.creator === creator).length} prototypes</span>
          </header>
          <div className="design-samples-grid">
            {sampleRoutes.filter((route) => route.creator === creator).map((route) => (
              <Link className={`design-option-card design-option-card--${route.slug}`} to={`/designs/${route.slug}`} key={route.slug}>
                <div className="design-option-card__preview" aria-hidden="true">
                  <span className="design-option-card__number">{creator === "Claude" ? "CL" : "CX"} · {route.number}</span>
                  <strong>{route.name}</strong>
                  <i /><i /><i />
                </div>
                <div className="design-option-card__meta">
                  <div>
                    <span>{creator} direction {route.number}</span>
                    <h2>{route.name}</h2>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="design-samples-index__footer">
        The current homepage remains unchanged. These routes exist only for comparison.
      </footer>
    </main>
  );
}

export function LivingWorkbench() {
  const featured = projects.slice(0, 4);

  return (
    <main className="design-sample workbench-sample">
      <header className="workbench-header">
        <a className="workbench-logo" href="#sample-top" aria-label="Tom Murton home">TM<span>×</span>WORKS</a>
        <PrototypeNav />
      </header>

      <section className="workbench-hero" id="sample-top">
        <div>
          <p className="workbench-eyebrow">Product lead · Engineering background · Building in public</p>
          <h1>I turn ideas into<br /><em>working things.</em></h1>
          <p className="workbench-deck">Products, tools and experiments. Some are shipped, some are still teaching me what they should become.</p>
          <a className="workbench-button" href="#sample-projects">See selected work <ArrowRight size={18} /></a>
        </div>
        <aside className="workbench-now">
          <span className="workbench-now__label">On the workbench now</span>
          <strong>Making Warden genuinely fun before making it pretty.</strong>
          <p>A deterministic tactics game for iPhone.</p>
          <div className="workbench-now__meter"><span /></div>
          <small>Core loop · active build</small>
        </aside>
      </section>

      <section className="workbench-projects" id="sample-projects">
        <header className="workbench-section-heading">
          <div><span>Selected work</span><h2>Things worth opening</h2></div>
          <a href="#all-work">Browse all projects <ArrowUpRight size={17} /></a>
        </header>

        <div className="workbench-grid">
          {featured.map((project, index) => (
            <article className={`workbench-card workbench-card--${project.id} workbench-card--${index + 1}`} key={project.id}>
              <ProjectArtwork projectId={project.id} compact={index > 1} />
              <div className="workbench-card__copy">
                <div><Status status={project.status} /><span>{project.kind}</span></div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <a href={`#${project.id}`} aria-label={`Read about ${project.name}`}><ArrowUpRight /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workbench-notes" id="sample-notes">
        <div>
          <span className="workbench-notes__label">Latest note</span>
          <h2>The intervention log is the score.</h2>
          <p>What I learned designing a fair benchmark for AI models that claim they can ship software.</p>
        </div>
        <div className="workbench-talk">
          <span>Talk</span>
          <strong>Frictionless Movement</strong>
          <small>LeadDev London · 2025</small>
        </div>
      </section>

      <section className="workbench-about" id="sample-about">
        <p>I’m Tom. I’ve spent my career connecting product decisions to technical reality. The projects here are where I test that judgement for myself.</p>
        <a href="#sample-cv">About and CV <ArrowRight size={17} /></a>
      </section>

      <SampleFooter />
      <DesignSwitcher active="workbench" />
    </main>
  );
}

const logEntries = [
  { date: "18 Jul", project: projects[3], title: "The first benchmark run reaches the build stage", detail: "Claude, Codex and Gemini get the same goal, machine and definition of done. Human interventions are recorded rather than edited out." },
  { date: "10 Jul", project: projects[1], title: "Warden’s first loop was fair, but it was not fun", detail: "Free kiting removed every interesting decision. The replacement loop now asks the player to defend wards while the dungeon closes in." },
  { date: "24 Jun", project: projects[0], title: "LightScout moves from prototype to product", detail: "The hard part was not generating location advice. It was turning several uncertain signals into something a photographer could trust." },
  { date: "09 Apr", project: projects[2], title: "A smaller promise for morning routines", detail: "Rest + Rise now focuses on the first and last 60 minutes of the day instead of trying to become another general habit tracker." },
];

export function BuildersLog() {
  return (
    <main className="design-sample log-sample">
      <header className="log-header">
        <a href="#sample-top" className="log-logo">tom/murton</a>
        <PrototypeNav />
      </header>

      <div className="log-layout" id="sample-top">
        <aside className="log-intro">
          <p className="log-prompt">~/now</p>
          <h1>Building, testing and writing things down.</h1>
          <p>I’m a product lead with an engineering background. This is the running record, including the unfinished parts.</p>
          <dl>
            <div><dt>Now</dt><dd>Warden</dd></div>
            <div><dt>Recently shipped</dt><dd>LightScout</dd></div>
            <div><dt>Based</dt><dd>London, UK</dd></div>
          </dl>
        </aside>

        <section className="log-stream" id="sample-projects">
          <header className="log-stream__header">
            <div><span className="log-live-dot" /> Live work log</div>
            <span>Updated 18 July 2026</span>
          </header>

          {logEntries.map((entry, index) => (
            <article className="log-entry" key={entry.title}>
              <time dateTime={`2026-${index + 4}-18`}>{entry.date}<small>2026</small></time>
              <div className="log-entry__body">
                <div><Status status={entry.project.status} /><span>{entry.project.name}</span></div>
                <h2>{entry.title}</h2>
                <p>{entry.detail}</p>
                <a href={`#${entry.project.id}`}>Read the update <ArrowRight size={16} /></a>
              </div>
              <ProjectArtwork projectId={entry.project.id} compact />
            </article>
          ))}

          <button className="log-load" type="button">Show earlier entries</button>
        </section>

        <aside className="log-pinned" id="sample-notes">
          <span>Pinned</span>
          <ProjectArtwork projectId="lightscout" compact />
          <h2>LightScout</h2>
          <p>From product instinct to a live native iOS app.</p>
          <a href="#lightscout">Open project <ArrowUpRight size={16} /></a>
          <hr />
          <span>Next talk</span>
          <strong>Nothing booked</strong>
          <small>The archive includes LeadDev London 2025.</small>
        </aside>
      </div>

      <section className="log-about" id="sample-about">
        <span>About this log</span>
        <p>Results matter, but decisions are often more useful. Each project records what changed, what failed and what I would do differently.</p>
      </section>

      <SampleFooter />
      <DesignSwitcher active="log" />
    </main>
  );
}

export function PersonalMagazine() {
  return (
    <main className="design-sample magazine-sample">
      <header className="magazine-header">
        <div className="magazine-issue">No. 01<br /><span>July 2026</span></div>
        <a className="magazine-masthead" href="#sample-top">MURTON / WORKS</a>
        <button type="button" className="magazine-menu">Index +</button>
      </header>

      <PrototypeNav />

      <section className="magazine-cover" id="sample-top">
        <div className="magazine-cover__type">
          <span>Cover story · Product in the open</span>
          <h1>Make the<br />thing.<br /><em>Then learn.</em></h1>
          <p>Tom Murton works where product strategy meets technical execution. The work ranges from photography intelligence to one-thumb tactics games.</p>
          <a href="#sample-projects">Read the cover story <ArrowRight /></a>
        </div>
        <div className="magazine-cover__visual">
          <ProjectArtwork projectId="warden" />
          <div className="magazine-cover__sticker">CURRENT<br />OBSESSION</div>
        </div>
        <div className="magazine-cover__sideword" aria-hidden="true">BUILD</div>
      </section>

      <section className="magazine-features" id="sample-projects">
        <article className="magazine-feature magazine-feature--lead">
          <span className="magazine-feature__number">01</span>
          <ProjectArtwork projectId="lightscout" />
          <div>
            <small>Shipped product</small>
            <h2>Finding the photograph before taking it</h2>
            <p>LightScout turns weather, light, geography and AI analysis into practical location advice.</p>
          </div>
        </article>
        <article className="magazine-feature magazine-feature--rest">
          <span className="magazine-feature__number">02</span>
          <ProjectArtwork projectId="rest-rise" />
          <div>
            <small>In testing</small>
            <h2>The first and last hour</h2>
          </div>
        </article>
        <article className="magazine-feature magazine-feature--benchmark">
          <span className="magazine-feature__number">03</span>
          <ProjectArtwork projectId="gaming-benchmark" />
          <div>
            <small>Field experiment</small>
            <h2>Can an AI actually ship the game?</h2>
          </div>
        </article>
      </section>

      <section className="magazine-notes" id="sample-notes">
        <div className="magazine-notes__title"><span>Essays &amp; talks</span><strong>Ideas with the rough edges left on.</strong></div>
        <ol>
          <li><span>Essay</span><h3>In defence of estimates</h3><time>Nov 2023</time></li>
          <li><span>Essay</span><h3>Bridging product and engineering</h3><time>Dec 2023</time></li>
          <li><span>Talk</span><h3>Frictionless Movement</h3><time>Jun 2025</time></li>
        </ol>
      </section>

      <section className="magazine-about" id="sample-about">
        <span>Editor’s note</span>
        <p>I have spent my career helping teams make better product decisions. Building my own products is how I keep those instincts honest.</p>
      </section>

      <SampleFooter />
      <DesignSwitcher active="magazine" />
    </main>
  );
}

export function ProjectGallery() {
  return (
    <main className="design-sample gallery-sample">
      <header className="gallery-header">
        <a href="#sample-top" className="gallery-logo">TOM MURTON<span>MAKES THINGS</span></a>
        <PrototypeNav inverse />
      </header>

      <section className="gallery-hero" id="sample-top">
        <p>Product lead / engineering background / solo builder</p>
        <h1>Selected work,<br /><span>still in motion.</span></h1>
        <div className="gallery-scroll-cue"><i /> Scroll through the work</div>
      </section>

      <section className="gallery-projects" id="sample-projects">
        {projects.slice(0, 4).map((project, index) => (
          <article className={`gallery-project gallery-project--${project.id}`} key={project.id}>
            <ProjectArtwork projectId={project.id} />
            <div className="gallery-project__shade" />
            <div className="gallery-project__index">0{index + 1}</div>
            <div className="gallery-project__copy">
              <div><Status status={project.status} /><span>{project.kind}</span></div>
              <h2>{project.name}</h2>
              <p>{project.summary}</p>
              <a href={`#${project.id}`}>View project <ArrowUpRight /></a>
            </div>
          </article>
        ))}
      </section>

      <section className="gallery-interlude" id="sample-notes">
        <p>Sometimes I write about the decision before I know whether it was right.</p>
        <a href="#writing">Read the field notes <ArrowRight /></a>
      </section>

      <section className="gallery-about" id="sample-about">
        <span>Not a showcase of perfect outcomes.</span>
        <p>A record of products, experiments and the judgement behind them.</p>
      </section>

      <SampleFooter inverse />
      <DesignSwitcher active="gallery" />
    </main>
  );
}

export function MakerIndex() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Project>(projects[0]);
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Product", "Game", "Research", "Tool"];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery = `${project.name} ${project.kind} ${project.summary}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = activeFilter === "All" || project.kind.toLowerCase().includes(activeFilter.toLowerCase());
      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, query]);

  return (
    <main className="design-sample index-sample">
      <header className="index-header" id="sample-top">
        <a href="#sample-top" className="index-logo">TM<sup>®</sup></a>
        <div className="index-header__descriptor">Product work<br />and useful experiments</div>
        <PrototypeNav />
      </header>

      <section className="index-intro" id="sample-about">
        <h1>Tom Murton makes products, tools and experiments.</h1>
        <p>Use the index to see what shipped, what is active and what each project taught me.</p>
        <div className="index-stamp">LONDON<br />2026</div>
      </section>

      <section className="index-browser" id="sample-projects">
        <div className="index-tools">
          <label>
            <Search size={19} aria-hidden="true" />
            <span className="sr-only">Search projects</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the work" />
          </label>
          <div className="index-filters" aria-label="Filter projects">
            {filters.map((filter) => (
              <button type="button" className={activeFilter === filter ? "is-active" : ""} onClick={() => setActiveFilter(filter)} key={filter}>{filter}</button>
            ))}
          </div>
          <span>{filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}</span>
        </div>

        <div className="index-browser__body">
          <div className="index-table" role="table" aria-label="Project index">
            <div className="index-row index-row--head" role="row">
              <span role="columnheader">Project</span><span role="columnheader">Type</span><span role="columnheader">Status</span><span role="columnheader">Year</span>
            </div>
            {filteredProjects.length > 0 ? filteredProjects.map((project) => (
              <button
                type="button"
                role="row"
                className={`index-row${selected.id === project.id ? " is-selected" : ""}`}
                onMouseEnter={() => setSelected(project)}
                onFocus={() => setSelected(project)}
                onClick={() => setSelected(project)}
                key={project.id}
              >
                <strong role="cell">{project.name}</strong>
                <span role="cell">{project.kind}</span>
                <span role="cell"><Status status={project.status} /></span>
                <span role="cell">{project.year}</span>
              </button>
            )) : (
              <div className="index-empty">No projects match “{query}”. Try a project name or choose All.</div>
            )}
          </div>

          <aside className="index-preview" aria-live="polite">
            <ProjectArtwork projectId={selected.id} />
            <div>
              <span>Selected project</span>
              <h2>{selected.name}</h2>
              <p>{selected.summary}</p>
              <small>{selected.update}</small>
              <a href={`#${selected.id}`}>Open project <ArrowUpRight size={17} /></a>
            </div>
          </aside>
        </div>
      </section>

      <section className="index-notes" id="sample-notes">
        <h2>Writing &amp; talks</h2>
        <a href="#essay"><span>Essay</span> In defence of estimates <time>2023</time></a>
        <a href="#talk"><span>Talk</span> Frictionless Movement <time>2025</time></a>
      </section>

      <SampleFooter />
      <DesignSwitcher active="index" />
    </main>
  );
}

const setPointerVariables = (event: ReactPointerEvent<HTMLElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  event.currentTarget.style.setProperty("--pointer-x", `${x * 100}%`);
  event.currentTarget.style.setProperty("--pointer-y", `${y * 100}%`);
  event.currentTarget.style.setProperty("--parallax-x", `${(x - 0.5) * 26}px`);
  event.currentTarget.style.setProperty("--parallax-y", `${(y - 0.5) * 20}px`);
  event.currentTarget.style.setProperty("--parallax-far-x", `${(x - 0.5) * -13}px`);
  event.currentTarget.style.setProperty("--parallax-far-y", `${(y - 0.5) * -10}px`);
};

export function ProjectUniverse() {
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <main className={`design-sample universe-sample${paused || reduceMotion ? " is-paused" : ""}`}>
      <header className="universe-header">
        <a href="#sample-top" className="universe-logo">TM<span>∞</span></a>
        <PrototypeNav inverse />
        <button type="button" className="universe-motion-toggle" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
          {paused ? <Play size={14} /> : <Pause size={14} />}
          {paused ? "Play motion" : "Pause motion"}
        </button>
      </header>

      <section className="universe-stage" id="sample-top" onPointerMove={setPointerVariables}>
        <div className="universe-stars universe-stars--near" aria-hidden="true" />
        <div className="universe-stars universe-stars--far" aria-hidden="true" />

        <div className="universe-rings" id="sample-projects">
          <div className="universe-orbit universe-orbit--outer">
            <a href="#lightscout" className="universe-node universe-node--top"><span><Status status="Shipped" /><strong>LightScout</strong><small>Photography intelligence</small></span></a>
            <a href="#benchmark" className="universe-node universe-node--bottom"><span><Status status="Running" /><strong>Gaming Benchmark</strong><small>AI autonomy, tested</small></span></a>
          </div>
          <div className="universe-orbit universe-orbit--inner">
            <a href="#warden" className="universe-node universe-node--right"><span><Status status="Building" /><strong>Warden</strong><small>Tactics without dice</small></span></a>
            <a href="#rest-rise" className="universe-node universe-node--left"><span><Status status="Testing" /><strong>Rest + Rise</strong><small>The first and last hour</small></span></a>
          </div>
        </div>

        <motion.div
          className="universe-core"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>Tom Murton · Product lead + builder</span>
          <h1>Ideas<br />become<br /><em>real here.</em></h1>
          <p>Explore the products, games and experiments in orbit.</p>
        </motion.div>

        <div className="universe-coordinate" aria-hidden="true">51.5072° N<br />0.1276° W</div>
        <div className="universe-scroll"><span /> Enter the field</div>
      </section>

      <section className="universe-manifesto" id="sample-about">
        <span className="universe-manifesto__label">The centre of gravity</span>
        <p>Product judgement gets stronger when it has to survive contact with the thing being built.</p>
        <div className="universe-manifesto__trail" aria-hidden="true"><i /><i /><i /><i /></div>
      </section>

      <section className="universe-signals" id="sample-notes">
        <div><span>Latest signal</span><strong>Warden’s first loop was fair. It was not fun.</strong><a href="#note">Read the build note <ArrowUpRight /></a></div>
        <div><span>From the archive</span><strong>Frictionless Movement</strong><small>LeadDev London · 2025</small></div>
      </section>

      <SampleFooter inverse />
      <DesignSwitcher active="universe" />
    </main>
  );
}

export function KineticReel() {
  const [selectedId, setSelectedId] = useState<Project["id"]>("lightscout");
  const reduceMotion = useReducedMotion();
  const selectedProject = projects.find((project) => project.id === selectedId) ?? projects[0];
  const reelProjects = projects.slice(0, 4);

  return (
    <main className="design-sample reel-sample">
      <header className="reel-header">
        <a href="#sample-top" className="reel-logo">TOM<br />MURTON</a>
        <div className="reel-header__ticker"><span>Product direction</span><span>Software</span><span>Games</span><span>Experiments</span></div>
        <PrototypeNav />
      </header>

      <section className="reel-hero" id="sample-top" onPointerMove={setPointerVariables}>
        <div className="reel-pointer-glow" aria-hidden="true" />
        <motion.p initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Product lead by trade. Builder by compulsion.</motion.p>
        <h1 aria-label="Think it. Make it. Test it.">
          <motion.span initial={reduceMotion ? false : { x: "-110%" }} animate={{ x: 0 }} transition={{ duration: .8, ease: [0.16,1,.3,1] }}>THINK IT.</motion.span>
          <motion.span initial={reduceMotion ? false : { x: "110%" }} animate={{ x: 0 }} transition={{ duration: .8, delay: .08, ease: [0.16,1,.3,1] }}>MAKE IT.</motion.span>
          <motion.span initial={reduceMotion ? false : { x: "-110%" }} animate={{ x: 0 }} transition={{ duration: .8, delay: .16, ease: [0.16,1,.3,1] }}>TEST IT.</motion.span>
        </h1>
        <motion.div className="reel-hero__stamp" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
          <span>WORK IN PUBLIC · WORK IN PUBLIC ·</span><Sparkles />
        </motion.div>
      </section>

      <div className="reel-marquee" aria-hidden="true">
        <div>
          {[...projects, ...projects].map((project, index) => <span key={`${project.id}-${index}`}>{project.name}<i>↗</i></span>)}
        </div>
      </div>

      <section className="reel-stage" id="sample-projects">
        <div className="reel-selector" role="tablist" aria-label="Choose a project">
          <span>Selected work / 2025—26</span>
          {reelProjects.map((project, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={selectedId === project.id}
              className={selectedId === project.id ? "is-active" : ""}
              onClick={() => setSelectedId(project.id)}
              key={project.id}
            >
              <small>0{index + 1}</small><strong>{project.name}</strong><ArrowUpRight />
            </button>
          ))}
        </div>

        <div className="reel-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProject.id}
              initial={reduceMotion ? false : { opacity: 0, scale: .94, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 1.04, rotate: 2 }}
              transition={{ duration: .48, ease: [0.16,1,.3,1] }}
            >
              <ProjectArtwork projectId={selectedProject.id} />
            </motion.div>
          </AnimatePresence>
          <div className="reel-screen__copy">
            <div><Status status={selectedProject.status} /><span>{selectedProject.kind}</span></div>
            <h2>{selectedProject.name}</h2>
            <p>{selectedProject.summary}</p>
            <a href={`#${selectedProject.id}`}>Open the project <ArrowRight /></a>
          </div>
        </div>
      </section>

      <section className="reel-quote" id="sample-about">
        <motion.p initial={reduceMotion ? false : { opacity: .2, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .45 }}>“Building my own products is how I keep my product instincts honest.”</motion.p>
      </section>

      <section className="reel-notes" id="sample-notes"><span>Writing &amp; talks</span><a href="#notes">Ideas, decisions and occasional corrections <ArrowUpRight /></a></section>
      <SampleFooter />
      <DesignSwitcher active="reel" />
    </main>
  );
}

const deskPlacements = ["lightscout", "warden", "rest-rise", "gaming-benchmark"] as const;

export function MakersDesk() {
  const deskRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  return (
    <main className="design-sample desk-sample">
      <header className="desk-header">
        <a href="#sample-top" className="desk-logo">Tom’s<br />work table</a>
        <p>Products, prototypes and field notes<br />London · July 2026</p>
        <PrototypeNav />
      </header>

      <section className="desk-hero" id="sample-top">
        <motion.div initial={reduceMotion ? false : { opacity: 0, rotate: -8, scale: .8 }} animate={{ opacity: 1, rotate: -3, scale: 1 }} className="desk-intro-note">
          <span>START HERE</span>
          <h1>I make things to find out what I think.</h1>
          <p>Move the work around. Open whatever catches your eye.</p>
          <i aria-hidden="true" />
        </motion.div>
        <div className="desk-pencil" aria-hidden="true"><span /></div>
        <div className="desk-coffee" aria-hidden="true"><i /></div>
      </section>

      <section className="desk-workspace" id="sample-projects">
        <div className="desk-workspace__instructions"><Move size={15} /> Drag the project cards</div>
        <div className="desk-canvas" ref={deskRef} onPointerMove={setPointerVariables}>
          <div className="desk-grid-shadow" aria-hidden="true" />
          {deskPlacements.map((projectId, index) => {
            const project = projects.find((item) => item.id === projectId)!;
            return (
              <motion.article
                className={`desk-card desk-card--${index + 1}`}
                drag={!reduceMotion}
                dragConstraints={deskRef}
                dragMomentum={false}
                initial={reduceMotion ? false : { opacity: 0, y: 80, rotate: index % 2 ? 5 : -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 2.5 : -2.5 }}
                whileHover={reduceMotion ? undefined : { scale: 1.025, rotate: 0, zIndex: 8 }}
                whileDrag={reduceMotion ? undefined : { scale: 1.045, rotate: 0, zIndex: 12, cursor: "grabbing" }}
                viewport={{ once: true }}
                transition={{ duration: .55, delay: index * .07, ease: [0.16,1,.3,1] }}
                tabIndex={0}
                key={project.id}
              >
                <div className="desk-tape" aria-hidden="true" />
                <ProjectArtwork projectId={project.id} compact />
                <div className="desk-card__copy">
                  <div><Status status={project.status} /><span>{project.year}</span></div>
                  <h2>{project.name}</h2>
                  <p>{project.summary}</p>
                  <a href={`#${project.id}`}>Open <ArrowUpRight /></a>
                </div>
              </motion.article>
            );
          })}
          <motion.div className="desk-scrap desk-scrap--one" animate={reduceMotion ? undefined : { y: [0,-8,0], rotate: [-4,-2,-4] }} transition={{ duration: 5, repeat: Infinity }}>GOOD<br />QUESTIONS<br />BEAT<br />FAST ANSWERS</motion.div>
          <motion.div className="desk-scrap desk-scrap--two" animate={reduceMotion ? undefined : { y: [0,7,0], rotate: [5,3,5] }} transition={{ duration: 4.4, repeat: Infinity }}>SHIP<br />LEARN<br />REPEAT</motion.div>
        </div>
      </section>

      <section className="desk-notebook" id="sample-notes">
        <div><span>Field note / 18 July</span><h2>The intervention log is the score.</h2></div>
        <p>When a benchmark hides the human fixes, it measures the story rather than the capability.</p>
        <a href="#field-note">Read the note <ArrowRight /></a>
      </section>

      <section className="desk-about" id="sample-about"><span>About Tom</span><p>Product lead, former engineering leader and persistent builder of things that might be useful.</p></section>
      <SampleFooter />
      <DesignSwitcher active="desk" />
    </main>
  );
}

const ClaudeNav = ({ inverse = false }: { inverse?: boolean }) => (
  <nav className={`claude-nav${inverse ? " claude-nav--inverse" : ""}`} aria-label="Prototype navigation">
    <a href="#sample-projects">Projects</a><a href="#sample-notes">Words</a><a href="#sample-cv">CV</a>
  </nav>
);

export function ClaudeAurora() {
  return (
    <main className="design-sample claude-aurora">
      <div className="claude-aurora__mesh" aria-hidden="true"><i /><i /><i /></div>
      <header className="claude-aurora__header"><a href="#sample-top">Tom Murton</a><ClaudeNav inverse /></header>
      <section className="claude-aurora__hero" id="sample-top">
        <span className="claude-aurora__live"><i /> Currently building</span>
        <h1>Build. Ship.<br />Repeat.</h1>
        <p>Product lead by trade, solo builder by compulsion. A living index of the products, tools and experiments I make.</p>
      </section>
      <section className="claude-aurora__projects" id="sample-projects">
        <article className="claude-aurora__spotlight">
          <div><span>Featured · shipped</span><h2>LightScout</h2><p>{projects[0].summary}</p><a href="#lightscout">Open project <ArrowUpRight /></a></div>
          <img src="/lightscout-home-screenshot.webp" alt="LightScout app home screen" />
        </article>
        <div className="claude-aurora__stack">
          {projects.slice(1, 4).map((project, index) => <article key={project.id}><div><strong>{project.name}</strong><Status status={project.status} /></div><p>{project.update}</p><i><span style={{ width: `${68 - index * 14}%` }} /></i></article>)}
        </div>
      </section>
      <section className="claude-aurora__footer" id="sample-notes"><span>Projects · writing · talks</span><a href="#sample-projects">Explore the work <ArrowRight /></a></section>
      <SampleFooter inverse /><DesignSwitcher active="claude-aurora" />
    </main>
  );
}

export function ClaudeKinetic() {
  const marqueeProjects = [...projects, ...projects];
  return (
    <main className="design-sample claude-kinetic">
      <header className="claude-kinetic__header"><a href="#sample-top">TOM MURTON</a><ClaudeNav inverse /></header>
      <section className="claude-kinetic__hero" id="sample-top">
        <div className="claude-kinetic__marquee"><div><span>ALWAYS BUILDING —</span><span>ALWAYS SHIPPING —</span><span>ALWAYS BUILDING —</span><span>ALWAYS SHIPPING —</span></div></div>
        <div className="claude-kinetic__marquee claude-kinetic__marquee--reverse"><div><span>PRODUCTS · TOOLS · GAMES · EXPERIMENTS ·</span><span>PRODUCTS · TOOLS · GAMES · EXPERIMENTS ·</span></div></div>
      </section>
      <section className="claude-kinetic__projects" id="sample-projects">
        {projects.slice(0, 4).map((project) => <a href={`#${project.id}`} key={project.id}><Status status={project.status} /><strong>{project.name}</strong><small>{project.kind} · {project.year}</small></a>)}
      </section>
      <div className="claude-kinetic__ticker" id="sample-notes"><div>{marqueeProjects.map((project, index) => <span key={`${project.id}-${index}`}>NOW: {project.name} ●</span>)}</div></div>
      <SampleFooter inverse /><DesignSwitcher active="claude-kinetic" />
    </main>
  );
}

export function ClaudeTerminal() {
  return (
    <main className="design-sample claude-terminal">
      <header className="claude-terminal__bar"><div><i /><i /><i /><span>tom@murton: ~/work</span></div><ClaudeNav inverse /></header>
      <section className="claude-terminal__intro" id="sample-top">
        <code>$ whoami --verbose</code><h1>Tom Murton</h1><p>→ Product lead · engineer at heart · ships products solo<span className="claude-terminal__cursor" /></p><code>$ ls ./projects --status --sort=recent</code>
      </section>
      <section className="claude-terminal__list" id="sample-projects">
        {projects.map((project, index) => <a href={`#${project.id}`} style={{ animationDelay: `${.5 + index * .16}s` }} key={project.id}><div><strong>{project.name.toLowerCase()}</strong><span>{project.kind.toLowerCase()}</span></div><Status status={project.status} />{index > 0 && index < 4 ? <i><span style={{ width: `${78 - index * 12}%` }} /></i> : null}</a>)}
      </section>
      <section className="claude-terminal__command" id="sample-notes">$ <span>cat ./words/*.md</span> → essays and talks · <a href="#sample-cv">./cv --open</a><i /></section>
      <SampleFooter inverse /><DesignSwitcher active="claude-terminal" />
    </main>
  );
}

export function ClaudeAfterglow() {
  return (
    <main className="design-sample claude-afterglow">
      <header className="claude-afterglow__header"><a href="#sample-top">Tom Murton</a><ClaudeNav inverse /></header>
      <section className="claude-afterglow__hero" id="sample-top"><span>Product lead · builder of many things</span><h1>I build products for work —<br />and <em>for the joy of it.</em></h1></section>
      <section className="claude-afterglow__feature" id="sample-projects">
        <div><span><i /> Featured — live on the App Store</span><h2>LightScout</h2><p>{projects[0].summary} Designed, built and shipped solo.</p><div><a href="#lightscout">Read the story</a><a href="#lightscout">App Store ↗</a></div></div>
        <div className="claude-afterglow__phones"><img src="/lightscout-home-screenshot.webp" alt="LightScout app screen" /><img src="/lightscout-home-screenshot.webp" alt="LightScout app detail" /></div>
      </section>
      <section className="claude-afterglow__next" id="sample-notes"><span>Next: Gaming Benchmark</span><span>Rest + Rise — in build</span><a href="#sample-projects">All projects →</a></section>
      <SampleFooter inverse /><DesignSwitcher active="claude-afterglow" />
    </main>
  );
}

export function ClaudeWorkbench() {
  return (
    <main className="design-sample claude-workbench">
      <div className="claude-workbench__ticker"><div>{[...projects, ...projects].map((project, index) => <span key={`${project.id}-${index}`}>● {project.status}: {project.name}</span>)}</div></div>
      <header className="claude-workbench__header"><a href="#sample-top"><b>TM</b> Tom Murton’s Workshop</a><ClaudeNav /></header>
      <section className="claude-workbench__hero" id="sample-top"><h1>Always building something.<br /><em>Usually three things.</em></h1><p>Apps, benchmarks, tools and experiments — shipped in public and tracked honestly.</p></section>
      <section className="claude-workbench__cards" id="sample-projects">
        {projects.slice(0, 3).map((project) => <article key={project.id}><div><Status status={project.status} /><span>{project.year}</span></div><h2>{project.name}</h2><p>{project.summary}</p><div className="claude-workbench__tags"><span>{project.kind}</span><span>Build notes</span></div><a href={`#${project.id}`}>Open project →</a></article>)}
      </section>
      <section className="claude-workbench__more" id="sample-notes"><span>Also on the bench: Gaming Benchmark, Marketing Engine and more.</span><a href="#sample-projects">Full project log →</a></section>
      <SampleFooter /><DesignSwitcher active="claude-workbench" />
    </main>
  );
}

export function ClaudeJournal() {
  return (
    <main className="design-sample claude-journal">
      <header className="claude-journal__header" id="sample-top"><span>The products, prose &amp; occasional talks of</span><h1>Tom Murton</h1><div><ClaudeNav /><small>Vol. II — Summer 2026</small></div></header>
      <section className="claude-journal__grid" id="sample-projects">
        <article className="claude-journal__lead"><span>Featured project</span><h2>Chasing the light: building LightScout alone</h2><p>How taking an AI photography app from idea to the App Store tested the product instincts behind it.</p><ProjectArtwork projectId="lightscout" compact /><a href="#lightscout">Continue reading →</a></article>
        <section id="sample-notes"><span>Latest writing</span><a href="#essay">The Case for Becoming a More Product-Focused Engineering Leader <small>Essay</small></a><a href="#essay">Bridging the Gap: Better Collaboration with Product <small>Essay</small></a><a href="#essay">In Defence of Estimates <small>Essay</small></a></section>
        <aside><span>On the bench</span>{projects.slice(1).map((project) => <div key={project.id}><strong>{project.name}</strong><Status status={project.status} /></div>)}<hr /><span>Speaking</span><p>“Frictionless Internal Movement” — most recently in London.</p></aside>
      </section>
      <SampleFooter /><DesignSwitcher active="claude-journal" />
    </main>
  );
}

export function ClaudeIndex() {
  return (
    <main className="design-sample claude-index">
      <header className="claude-index__header" id="sample-top"><h1>TOM<br />MURTON</h1><div><p>Index of work, 2012 → 2026.<br />Products, articles, talks and a CV.</p><ClaudeNav /></div></header>
      <section className="claude-index__table" id="sample-projects">
        <div className="claude-index__row claude-index__row--head"><span>No.</span><span>Name</span><span>Type</span><span>Status</span><span>Year</span></div>
        {projects.map((project, index) => <a className="claude-index__row" href={`#${project.id}`} key={project.id}><span>00{index + 1}</span><strong>{project.name} ↗</strong><span>{project.kind}</span><Status status={project.status} /><span>{project.year}</span></a>)}
        <a className="claude-index__row" href="#essay" id="sample-notes"><span>006</span><strong>In Defence of Estimates</strong><span>Article</span><span>Published</span><span>2023</span></a>
        <a className="claude-index__row" href="#talk"><span>007</span><strong>Frictionless Internal Movement</strong><span>Talk</span><span>Delivered</span><span>2025</span></a>
      </section>
      <SampleFooter /><DesignSwitcher active="claude-index" />
    </main>
  );
}

export function ClaudePlayground() {
  return (
    <main className="design-sample claude-playground">
      <header className="claude-playground__header"><a href="#sample-top">tom murton<span>.</span></a><ClaudeNav /></header>
      <section className="claude-playground__hero" id="sample-top"><h1>I make things.<br />Some of them even ship.</h1></section>
      <section className="claude-playground__bento" id="sample-projects">
        <article className="claude-playground__lightscout"><span>Live on iOS</span><h2>LightScout</h2><p>Find the right light and location before leaving home.</p><img src="/lightscout-home-screenshot.webp" alt="LightScout app home screen" /></article>
        <article><span>Now building</span><h2>Warden</h2><i><b /></i><small>Core loop in progress</small></article>
        <article><span>Experiment</span><h2>Can an AI ship a game?</h2><p>The Gaming Benchmark →</p></article>
        <article id="sample-notes"><span>Words</span><h2>“In Defence of Estimates”</h2><p>Essays and talks →</p></article>
        <article><span>About</span><h2>Product lead. Engineer at heart.</h2><p>Full CV →</p></article>
      </section>
      <div className="claude-playground__ticker"><div><span>projects ✳ essays ✳ talks ✳ experiments ✳</span><span>projects ✳ essays ✳ talks ✳ experiments ✳</span><span>projects ✳ essays ✳ talks ✳ experiments ✳</span></div></div>
      <SampleFooter /><DesignSwitcher active="claude-playground" />
    </main>
  );
}

export function ClaudePoster() {
  const posterProjects = projects.slice(0, 4);
  return (
    <main className="design-sample claude-poster">
      <header className="claude-poster__header"><a href="#sample-top">TOM MURTON®</a><ClaudeNav /></header>
      <section className="claude-poster__intro" id="sample-top">Product lead, engineer at heart. Everything I’ve shipped, started, or stood on a stage to say.</section>
      <section className="claude-poster__rows" id="sample-projects">
        {posterProjects.map((project, index) => <a className={index === 1 ? "is-highlighted" : ""} href={`#${project.id}`} key={project.id}><span>0{index + 1}</span><strong>{project.name}</strong><small>{project.kind}<br />{project.status} · {project.year}</small></a>)}
      </section>
      <section className="claude-poster__footer" id="sample-notes"><span>Also: essays · talks · product leadership</span><a href="#sample-projects">All work ↓</a></section>
      <SampleFooter /><DesignSwitcher active="claude-poster" />
    </main>
  );
}
