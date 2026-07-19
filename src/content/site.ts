import type { CSSProperties } from "react";
import type { SiteConfig } from "@/content/types";

export const site = {
  name: "Tom Murton",
  descriptor: "Product lead · Engineering background · Solo builder",
  hero: {
    eyebrow: "Products, tools, experiments and the thinking behind them",
    title: "Selected work,",
    accentTitle: "still in motion.",
    introduction: "I help teams make better product decisions, then build things myself to keep those instincts honest.",
  },
  navigation: [
    { label: "Projects", href: "/projects" },
    { label: "Writing", href: "/writing" },
    { label: "Talks", href: "/talks" },
    { label: "About", href: "/#about" },
    { label: "CV", href: "/cv" },
  ],
  socialLinks: [
    { label: "GitHub", href: "https://github.com/tom-murton/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tommurton/" },
    { label: "Instagram", href: "https://www.instagram.com/tom.murton" },
  ],
  theme: {
    background: "#0d0e12",
    surface: "#14161a",
    foreground: "#f3f4f0",
    muted: "#9ca6a8",
    accent: "#b8e7f0",
    accentInk: "#111315",
    line: "rgba(255, 255, 255, 0.16)",
    motion: "standard",
    typeScale: "balanced",
    density: "balanced",
    cardHeight: "balanced",
    cornerStyle: "square",
    gridGap: "hairline",
    heroBackdrop: "rings",
  },
} satisfies SiteConfig;

export function getSiteThemeVariables(config: SiteConfig) {
  return {
    "--pg-background": config.theme.background,
    "--pg-surface": config.theme.surface,
    "--pg-foreground": config.theme.foreground,
    "--pg-muted": config.theme.muted,
    "--pg-accent": config.theme.accent,
    "--pg-accent-ink": config.theme.accentInk,
    "--pg-line": config.theme.line,
  } as CSSProperties;
}
