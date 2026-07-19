import type { ProjectArtwork as ProjectArtworkConfig } from "@/content/types";

interface ProjectArtworkProps {
  artwork: ProjectArtworkConfig;
}

export function ProjectArtwork({ artwork }: ProjectArtworkProps) {
  if (artwork.type === "image") {
    return (
      <div className="pg-art pg-art--image">
        <img src={artwork.src} alt={artwork.alt} style={{ objectPosition: artwork.position ?? "50% 50%" }} />
      </div>
    );
  }

  if (artwork.preset === "lightscout") {
    return (
      <div className="pg-art pg-art--lightscout">
        <div className="pg-art__sun" aria-hidden="true" />
        <div className="pg-art__horizon" aria-hidden="true" />
        <img src="/lightscout-home-screenshot.png" alt="LightScout app home screen" />
        <span>Find the shot before the light changes</span>
      </div>
    );
  }

  if (artwork.preset === "warden") {
    return (
      <div className="pg-art pg-art--warden" role="img" aria-label="Abstract Warden tactics board">
        <div className="pg-warden-board" aria-hidden="true">
          {Array.from({ length: 25 }, (_, index) => <i key={index} />)}
          <b className="pg-warden-piece pg-warden-piece--hero" />
          <b className="pg-warden-piece pg-warden-piece--enemy" />
          <b className="pg-warden-piece pg-warden-piece--ward" />
        </div>
        <span>WARDEN</span>
      </div>
    );
  }

  if (artwork.preset === "rest-rise") {
    return (
      <div className="pg-art pg-art--rest" role="img" aria-label="Rest and Rise morning and evening clock">
        <div className="pg-rest-orbit" aria-hidden="true"><i /><b /></div>
        <div className="pg-rest-times" aria-hidden="true">
          <span><small>RISE</small>06:45</span>
          <span><small>REST</small>22:10</span>
        </div>
      </div>
    );
  }

  if (artwork.preset === "gaming-benchmark") {
    return (
      <div className="pg-art pg-art--benchmark" role="img" aria-label="Gaming Benchmark model scorecard">
        <div className="pg-benchmark-grid" aria-hidden="true" />
        <strong>SHIP<br />A GAME</strong>
        <div className="pg-benchmark-models" aria-hidden="true"><span>GPT</span><span>CLAUDE</span><span>GEMINI</span></div>
        <small>AUTONOMY TEST / 01</small>
      </div>
    );
  }

  return (
    <div className="pg-art pg-art--marketing" role="img" aria-label="Marketing Engine workflow">
      <div className="pg-marketing-track" aria-hidden="true">
        <span>01 / BRIEF</span><span>02 / CREATE</span><span>03 / REVIEW</span><span>04 / SHIP</span>
      </div>
      <strong>Marketing<br />Engine</strong>
      <small>One system. Several products.</small>
    </div>
  );
}
