import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { site } = usePortfolioContent();

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;

    const firstLink = navigationRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="pg-header">
      <Link className="pg-brand" to="/" aria-label={`${site.name}, home`}>
        <span>{site.name}</span>
        <small>Makes things</small>
      </Link>

      <button
        ref={menuButtonRef}
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
        ref={navigationRef}
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
