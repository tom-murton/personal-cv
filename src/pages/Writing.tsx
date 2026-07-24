import { CollectionIntro } from "@/components/site/CollectionIntro";
import { SiteFrame } from "@/components/site/SiteFrame";
import { WritingList } from "@/components/site/WritingList";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export default function Writing() {
  const { collections } = usePortfolioContent();
  const page = collections.writing;

  return (
    <SiteFrame title="Writing" description={page.description}>
      <main className="pg-collection-page" id="main-content">
        <CollectionIntro
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          count={page.items.length}
        />
        <div className="pg-collection-body">
          <WritingList items={page.items} />
        </div>
      </main>
    </SiteFrame>
  );
}
