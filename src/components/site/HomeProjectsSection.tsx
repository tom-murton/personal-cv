import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { HomeProjectsSection as HomeProjectsSectionConfig } from "@/content/types";

interface HomeProjectsSectionProps {
  section: HomeProjectsSectionConfig;
}

export function HomeProjectsSection({ section }: HomeProjectsSectionProps) {
  return (
    <section className="pg-home-section pg-home-projects" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="pg-section-shell">
        <div id={`${section.id}-title`}>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            action={<Link className="pg-text-link" to="/projects">All projects <ArrowRight aria-hidden="true" /></Link>}
          />
        </div>
      </div>
      <ProjectGrid rows={section.rows} />
    </section>
  );
}
