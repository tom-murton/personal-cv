import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { HomeAboutSection as HomeAboutSectionConfig } from "@/content/types";

interface HomeAboutSectionProps {
  section: HomeAboutSectionConfig;
}

export function HomeAboutSection({ section }: HomeAboutSectionProps) {
  return (
    <section className="pg-home-section pg-home-about" id={section.id} aria-labelledby={`${section.id}-title`}>
      <p className="pg-eyebrow">{section.eyebrow}</p>
      <div>
        <h2 id={`${section.id}-title`}>{section.title}</h2>
        <p>{section.body}</p>
        <Link className="pg-text-link" to="/cv">Read the CV <ArrowRight aria-hidden="true" /></Link>
      </div>
    </section>
  );
}

