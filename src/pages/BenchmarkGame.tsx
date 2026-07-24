import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router";
import { ArticleBody } from "@/components/site/ArticleBody";
import { SiteFrame } from "@/components/site/SiteFrame";
import { autonomyScore, benchmarkGameBySlug, type BenchmarkScore } from "@/content/benchmarks";
import NotFound from "@/pages/NotFound";

function tally(score: BenchmarkScore) {
  const count = (value: number, singular: string, plural = `${singular}s`) =>
    `${value} ${value === 1 ? singular : plural}`;
  return `${count(score.nudges, "nudge")} · ${count(score.fixes, "fix", "fixes")} · ${count(score.rescues, "rescue")}`;
}

export default function BenchmarkGame() {
  const { game: slug } = useParams();
  const game = slug ? benchmarkGameBySlug.get(slug) : undefined;

  if (!game) return <NotFound />;

  const hasLinks = Boolean(game.appStoreUrl || game.playUrl || game.links?.length);
  const appleOutcomes: Record<string, string> = {
    "approved-first-pass": "Approved first pass",
    "approved-after-rejection": `Approved after ${game.appleReview?.rejections ?? 1} rejection${(game.appleReview?.rejections ?? 1) === 1 ? "" : "s"}`,
    "in-review": "In review",
    rejected: "Rejected",
  };

  return (
    <SiteFrame title={`${game.name} — Ship a Game`} description={game.summary}>
      <main id="main-content" className="pg-article-page">
        <header className="pg-article-hero">
          <span className="pg-article-hero__ghost" aria-hidden="true">{game.name}</span>
          <Link className="pg-article-back" to="/projects/ship-a-game">
            <ArrowLeft aria-hidden="true" /> Ship a Game
          </Link>
          <p className="pg-eyebrow">Benchmark game / {game.model}</p>
          <h1>{game.name}</h1>
          <p className="pg-article-standfirst">{game.summary}</p>
        </header>

        <div className="pg-article-layout">
          <aside className="pg-article-rail" aria-label="Run details">
            <dl>
              <div><dt>Model</dt><dd>{game.model}</dd></div>
              <div><dt>Harness</dt><dd>{game.harness}</dd></div>
              {game.engine ? <div><dt>Engine</dt><dd>{game.engine}</dd></div> : null}
              <div><dt>Status</dt><dd>{game.statusLabel}</dd></div>
              <div><dt>Autonomy</dt><dd>{autonomyScore(game.autonomy)}/100 — {tally(game.autonomy)}</dd></div>
              {game.improveScore ? <div><dt>Round 2</dt><dd>{autonomyScore(game.improveScore)}/100 — {tally(game.improveScore)}</dd></div> : null}
              {game.articleScore ? <div><dt>Round 3</dt><dd>{autonomyScore(game.articleScore)}/100 — {tally(game.articleScore)}</dd></div> : null}
              {game.buildStats?.hours ? <div><dt>Build time</dt><dd>{game.buildStats.hours} hours</dd></div> : null}
              {game.buildStats?.costUsd ? <div><dt>Build cost</dt><dd>${game.buildStats.costUsd}</dd></div> : null}
              <div><dt>Quality</dt><dd>{game.quality ? `${game.quality.overall}/10 — judged by ${game.quality.judgedBy}` : "Not yet judged"}</dd></div>
              {game.appleReview ? <div><dt>Apple</dt><dd>{appleOutcomes[game.appleReview.outcome]}</dd></div> : null}
              {game.reception ? (
                <div>
                  <dt>Reception</dt>
                  <dd>
                    {[
                      game.reception.rating ? `${game.reception.rating.toFixed(1)}★${game.reception.ratingsCount ? ` (${game.reception.ratingsCount})` : ""}` : null,
                      game.reception.downloads,
                      game.reception.crashFreePct ? `${game.reception.crashFreePct}% crash-free` : null,
                    ].filter(Boolean).join(" · ")}{" "}
                    — as of {game.reception.asOf}
                  </dd>
                </div>
              ) : null}
              {game.price ? <div><dt>Price</dt><dd>{game.price}</dd></div> : null}
              <div><dt>Published</dt><dd>{game.date}</dd></div>
            </dl>
            {hasLinks ? (
              <nav aria-label="Links">
                <span>Links</span>
                {game.appStoreUrl ? (
                  <a href={game.appStoreUrl} target="_blank" rel="noreferrer">App Store<ArrowUpRight aria-hidden="true" /></a>
                ) : null}
                {game.playUrl ? (
                  <a href={game.playUrl} target="_blank" rel="noreferrer">Play the web build<ArrowUpRight aria-hidden="true" /></a>
                ) : null}
                {game.links?.map((link) => (
                  <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}<ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </nav>
            ) : null}
          </aside>

          {game.review?.length ? (
            <div className="pg-benchmark-story">
              {game.screenshots?.length ? (
                <div className="pg-benchmark-gallery" aria-label={`${game.name} screenshots`}>
                  {game.screenshots.map((screenshot) => (
                    <figure key={screenshot.src}>
                      <img src={screenshot.src} alt={screenshot.alt} loading="lazy" />
                      <figcaption>{screenshot.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
              <ArticleBody blocks={game.review} />
            </div>
          ) : (
            <div className="pg-article-prose">
              <p><em>The full write-up for {game.name} — the model's own first-person account of how it researched, built and shipped the game, and where it needed help — is coming soon.</em></p>
            </div>
          )}
        </div>

        <footer className="pg-article-footer">
          <span>Ship a Game / benchmark</span>
          <Link to="/projects/ship-a-game">All games <ArrowUpRight aria-hidden="true" /></Link>
        </footer>
      </main>
    </SiteFrame>
  );
}
