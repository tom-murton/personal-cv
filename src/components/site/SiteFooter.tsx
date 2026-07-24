import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export function SiteFooter() {
  const { site } = usePortfolioContent();

  return (
    <footer className="pg-footer">
      <div>
        <Link className="pg-footer__name" to="/">{site.name}</Link>
        <p>{site.descriptor}</p>
      </div>
      <nav aria-label="Social links">
        {site.socialLinks.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}<ArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </nav>
      <small>© {new Date().getFullYear()} {site.name}</small>
    </footer>
  );
}
