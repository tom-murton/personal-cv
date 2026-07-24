import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router";
import { ArticleBody } from "@/components/site/ArticleBody";
import { SiteFrame } from "@/components/site/SiteFrame";
import { usePortfolioContent } from "@/content/PortfolioContentContext";
import type { ArticleBlock } from "@/content/types";
import NotFound from "@/pages/NotFound";

function readingTime(body: ArticleBlock[]) {
  const words = body.flatMap((block) => block.children).reduce((total, span) => (
    total + span.text.trim().split(/\s+/).filter(Boolean).length
  ), 0);
  return Math.max(1, Math.ceil(words / 220));
}

function useArticle() {
  const { slug } = useParams();
  const { writing } = usePortfolioContent();
  return writing.find((item) => item.id === slug);
}

export default function Article() {
  const article = useArticle();
  const { projects } = usePortfolioContent();

  if (!article?.body?.length) return <NotFound />;

  const project = article.projectId ? projects.find((item) => item.id === article.projectId) : undefined;
  const minutes = readingTime(article.body);

  return (
    <SiteFrame title={article.title} description={article.description}>
      <main id="main-content" className="pg-article-page">
        <header className="pg-article-hero">
          <span className="pg-article-hero__ghost" aria-hidden="true">{article.projectName ?? "Field notes"}</span>
          <Link className="pg-article-back" to="/writing"><ArrowLeft aria-hidden="true" /> All writing</Link>
          <p className="pg-eyebrow">Project story / {article.projectName ?? "Build notes"}</p>
          <h1>{article.title}</h1>
          <p className="pg-article-standfirst">{article.description}</p>
        </header>

        <div className="pg-article-layout">
          <aside className="pg-article-rail" aria-label="Article details">
            <dl>
              <div><dt>Project</dt><dd>{article.projectName ?? "Independent article"}</dd></div>
              <div><dt>Published</dt><dd>{article.date}</dd></div>
              <div><dt>Status</dt><dd>{project?.status ?? "In progress"}</dd></div>
              <div><dt>Reading time</dt><dd>{minutes} min{minutes === 1 ? "" : "s"}</dd></div>
            </dl>
            {article.links?.length ? (
              <nav aria-label="Related links">
                <span>Related</span>
                {article.links.map((link) => (
                  <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}<ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </nav>
            ) : null}
          </aside>

          <ArticleBody blocks={article.body} />
        </div>

        <footer className="pg-article-footer">
          <span>End note / {article.projectName ?? "Project story"}</span>
          <Link to="/writing">More writing <ArrowUpRight aria-hidden="true" /></Link>
        </footer>
      </main>
    </SiteFrame>
  );
}
