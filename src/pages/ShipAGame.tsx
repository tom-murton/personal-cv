import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ArticleBody } from "@/components/site/ArticleBody";
import { SiteFrame } from "@/components/site/SiteFrame";
import {
  autonomyScore,
  benchmarkGames,
  benchmarkMeta,
  benchmarkMethodology,
  scoringDimensions,
  type BenchmarkGame,
} from "@/content/benchmarks";

function scoreGrade(value: number): string {
  if (value >= 90) return "high";
  if (value >= 60) return "mid";
  return "low";
}

function RoundDots({ game }: { game: BenchmarkGame }) {
  const rounds = [
    { key: "R1", label: "Round 1 · build", score: game.autonomy },
    { key: "R2", label: "Round 2 · improve", score: game.improveScore },
    { key: "R3", label: "Round 3 · story", score: game.articleScore ?? (game.review?.length ? { nudges: 0, fixes: 0, rescues: 0 } : undefined) },
  ];
  return (
    <span className="pg-bench-rounds" aria-label="Rounds completed">
      {rounds.map((round) => (
        <span
          key={round.key}
          className="pg-bench-round"
          data-done={round.score ? "true" : undefined}
          title={round.score ? `${round.label} — ${round.score.nudges}n · ${round.score.fixes}f · ${round.score.rescues}r` : `${round.label} — not yet run`}
        >
          {round.key}
        </span>
      ))}
    </span>
  );
}

function GameFacts({ game }: { game: BenchmarkGame }) {
  const facts: { label: string; value: string }[] = [];
  facts.push({
    label: "interventions",
    value: `${game.autonomy.nudges}n · ${game.autonomy.fixes}f · ${game.autonomy.rescues}r`,
  });
  if (game.buildStats?.hours) facts.push({ label: "build time", value: `${game.buildStats.hours}h` });
  facts.push({ label: "quality", value: game.quality ? `${game.quality.overall}/10` : "—" });
  if (game.appleReview) {
    const outcomes: Record<string, string> = {
      "approved-first-pass": "approved first pass",
      "approved-after-rejection": `approved after ${game.appleReview.rejections ?? 1} rejection${(game.appleReview.rejections ?? 1) === 1 ? "" : "s"}`,
      "in-review": "in review",
      rejected: "rejected",
    };
    facts.push({ label: "apple", value: outcomes[game.appleReview.outcome] });
  }
  facts.push({
    label: "reception",
    value: game.reception?.rating ? `${game.reception.rating.toFixed(1)}★` : "—",
  });
  return (
    <span className="pg-bench-row__facts">
      {facts.map((fact) => (
        <span key={fact.label} className="pg-bench-fact">
          <span>{fact.label}</span>
          <b>{fact.value}</b>
        </span>
      ))}
    </span>
  );
}

export default function ShipAGame() {
  return (
    <SiteFrame title="Ship a Game">
      <main id="main-content" className="pg-collection-page pg-bench-page">
        <header className="pg-collection-intro">
          <p className="pg-eyebrow">{benchmarkMeta.eyebrow}</p>
          <h1>{benchmarkMeta.title}</h1>
          <div>
            <p>{benchmarkMeta.standfirst}</p>
            <span>{String(benchmarkGames.length).padStart(2, "0")} games</span>
          </div>
        </header>

        <div className="pg-bench-actions">
          <Link className="pg-bench-article-link" to={`/writing/${benchmarkMeta.articleSlug}`}>
            {benchmarkMeta.articleLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <section className="pg-bench-board" aria-label="Benchmark scoreboard">
          <h2 className="pg-eyebrow">The scoreboard</h2>
          <ol className="pg-bench-rows">
            {benchmarkGames.map((game, index) => {
              const score = autonomyScore(game.autonomy);
              return (
                <li key={game.slug}>
                  <Link className="pg-bench-row" to={`/projects/ship-a-game/${game.slug}`}>
                    <span className="pg-bench-row__num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="pg-bench-row__score" data-grade={scoreGrade(score)}>
                      <b>{score}</b>
                      <span>autonomy</span>
                    </span>
                    <span className="pg-bench-row__main">
                      <span className="pg-bench-row__name">{game.name}</span>
                      <span className="pg-bench-row__sub">
                        {game.model}
                        {game.engine ? ` · ${game.engine}` : ""}
                      </span>
                      <GameFacts game={game} />
                    </span>
                    <span className="pg-bench-row__side">
                      <RoundDots game={game} />
                      <span className={`pg-status pg-status--${game.status} pg-bench-row__status`}>{game.statusLabel}</span>
                    </span>
                    <ArrowRight className="pg-bench-row__arrow" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="pg-bench-scoring" aria-label="How scoring works">
          <h2 className="pg-eyebrow">How scoring works</h2>
          <dl className="pg-bench-dimensions">
            {scoringDimensions.map((dimension) => (
              <div key={dimension.name}>
                <dt>
                  {dimension.name}
                  <span>{dimension.metric}</span>
                </dt>
                <dd>{dimension.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pg-bench-method">
          <ArticleBody blocks={benchmarkMethodology} />
        </section>
      </main>
    </SiteFrame>
  );
}
