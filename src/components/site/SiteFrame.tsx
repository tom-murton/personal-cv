import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { usePortfolioContent } from "@/content/PortfolioContentContext";
import { getSiteThemeVariables } from "@/content/site";

interface SiteFrameProps {
  children: ReactNode;
  title?: string;
  description?: string;
  robots?: "index,follow" | "noindex,nofollow";
}

const defaultDescription = "Projects, writing and talks from product lead and solo builder Tom Murton.";
const canonicalOrigin = "https://tommurton.com";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

export function SiteFrame({
  children,
  title,
  description = defaultDescription,
  robots = "index,follow",
}: SiteFrameProps) {
  const location = useLocation();
  const { site, source } = usePortfolioContent();

  useEffect(() => {
    const documentTitle = title
      ? `${title} — ${site.name}`
      : `${site.name} — Products, tools and experiments`;
    const canonicalUrl = new URL(location.pathname, canonicalOrigin).toString();

    document.title = documentTitle;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: documentTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: documentTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, location.pathname, robots, site.name, title]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const targetId = decodeURIComponent(location.hash.slice(1));
        document.getElementById(targetId)?.scrollIntoView();
      } else {
        window.scrollTo({ top: 0 });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return (
    <div
      className="pg-site"
      style={getSiteThemeVariables(site)}
      data-content-source={source}
      data-motion={site.theme.motion}
      data-type-scale={site.theme.typeScale}
      data-density={site.theme.density}
      data-card-height={site.theme.cardHeight}
      data-corner-style={site.theme.cornerStyle}
      data-grid-gap={site.theme.gridGap}
      data-hero-backdrop={site.theme.heroBackdrop}
    >
      <a className="pg-skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
