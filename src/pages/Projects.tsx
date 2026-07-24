import { CollectionIntro } from "@/components/site/CollectionIntro";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { SiteFrame } from "@/components/site/SiteFrame";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export default function Projects() {
  const { collections } = usePortfolioContent();
  const page = collections.projects;

  return (
    <SiteFrame title="Projects" description={page.description}>
      <main className="pg-collection-page" id="main-content">
        <CollectionIntro
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          count={page.items.length}
        />
        <ProjectGrid projects={page.items} />
      </main>
    </SiteFrame>
  );
}
