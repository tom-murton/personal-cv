import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { site } = usePortfolioContent();

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  return (
    <header className="pg-header">
      <Link className="pg-brand" to="/" aria-label={`${site.name}, home`}>
        <span>{site.name}</span>
        <small>Makes things</small>
      </Link>

      <button
        className="pg-menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <nav
        className={`pg-navigation${menuOpen ? " is-open" : ""}`}
        id="primary-navigation"
        aria-label="Primary navigation"
      >
        {site.navigation.map((item) => (
          <Link key={item.href} to={item.href}>{item.label}</Link>
        ))}
      </nav>
    </header>
  );
}
