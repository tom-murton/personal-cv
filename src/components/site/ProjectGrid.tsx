import { ProjectCard } from "@/components/site/ProjectCard";
import { usePortfolioContent } from "@/content/PortfolioContentContext";
import { projectRowSizes } from "@/content/projectRows";
import type { FeaturedProjectRow, Project, ProjectCardSize } from "@/content/types";

interface ProjectGridProps {
  rows?: FeaturedProjectRow[];
  projects?: Project[];
}

interface ResolvedRow {
  id: string;
  items: Array<{ project: Project; size: ProjectCardSize; index: number }>;
}

function collectionRows(projects: Project[]): FeaturedProjectRow[] {
  const rows: FeaturedProjectRow[] = [];
  for (let index = 0; index < projects.length; index += 2) {
    const projectIds = projects.slice(index, index + 2).map((project) => project.id);
    rows.push({
      id: `collection-${index / 2}`,
      layout: projectIds.length === 1 ? "single" : "two-equal",
      enabled: true,
      projectIds,
    });
  }
  return rows;
}

export function ProjectGrid({ rows, projects: explicitProjects }: ProjectGridProps) {
  const { projects } = usePortfolioContent();
  const projectById = new Map(projects.map((project) => [project.id, project]));
  let cardIndex = 0;
  const sourceRows = rows ?? collectionRows(explicitProjects ?? projects);
  const visibleRows = sourceRows.filter((row) => row.enabled).flatMap<ResolvedRow>((row) => {
    const sizes = projectRowSizes[row.layout];
    const items = row.projectIds.flatMap((projectId, index) => {
      const project = projectById.get(projectId);
      if (!project || !sizes[index]) return [];
      const item = { project, size: sizes[index], index: cardIndex };
      cardIndex += 1;
      return [item];
    });
    return items.length ? [{ id: row.id, items }] : [];
  });

  return (
    <div className="pg-project-grid">
      {visibleRows.map((row) => (
        <div className="pg-project-row" key={row.id}>
          {row.items.map(({ project, size, index }) => (
            <ProjectCard key={project.id} project={project} size={size} index={index} />
          ))}
        </div>
      ))}
    </div>
  );
}
