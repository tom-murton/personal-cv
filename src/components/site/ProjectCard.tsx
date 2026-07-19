import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/site/ProjectArtwork";
import { usePortfolioContent } from "@/content/PortfolioContentContext";
import type { Project, ProjectCardSize } from "@/content/types";

interface ProjectCardProps {
  project: Project;
  size: ProjectCardSize;
  index: number;
}

export function ProjectCard({ project, size, index }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const { site } = usePortfolioContent();
  const quietMotion = site.theme.motion === "quiet";
  const expressiveMotion = site.theme.motion === "expressive";

  return (
    <motion.article
      className={`pg-project-card pg-project-card--${project.id}`}
      data-size={size}
      initial={reduceMotion || quietMotion ? false : { opacity: 0, y: expressiveMotion ? 58 : 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: expressiveMotion ? 0.85 : 0.65, delay: Math.min(index * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] }}
    >
      <ProjectArtwork artwork={project.artwork} />
      <div className="pg-project-card__shade" aria-hidden="true" />
      <div className="pg-project-card__number">{String(index + 1).padStart(2, "0")}</div>
      <div className="pg-project-card__copy">
        <div className="pg-project-card__meta">
          <span className={`pg-status pg-status--${project.status.toLowerCase()}`}>{project.status}</span>
          <span>{project.kind}</span>
          <span>{project.year}</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        {project.href ? (
          <a href={project.href} target="_blank" rel="noreferrer">
            {project.hrefLabel ?? "View project"}<ArrowUpRight aria-hidden="true" />
          </a>
        ) : (
          <div className="pg-project-card__update"><span>Current note</span>{project.update}</div>
        )}
      </div>
    </motion.article>
  );
}
