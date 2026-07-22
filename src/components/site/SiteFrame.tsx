import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { usePortfolioContent } from "@/content/PortfolioContentContext";
import { getSiteThemeVariables } from "@/content/site";
import "@/styles/GallerySite.css";

interface SiteFrameProps {
  children: ReactNode;
  title?: string;
}

export function SiteFrame({ children, title }: SiteFrameProps) {
  const location = useLocation();
  const { site, source } = usePortfolioContent();

  useEffect(() => {
    document.title = title
      ? `${title} — ${site.name}`
      : `${site.name} — Products, tools and experiments`;
  }, [site.name, title]);

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
