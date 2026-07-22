import { CollectionIntro } from "@/components/site/CollectionIntro";
import { SiteFrame } from "@/components/site/SiteFrame";
import { TalkList } from "@/components/site/TalkList";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export default function Talks() {
  const { collections } = usePortfolioContent();
  const page = collections.talks;

  return (
    <SiteFrame title="Talks">
      <main className="pg-collection-page" id="main-content">
        <CollectionIntro
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          count={page.items.length}
        />
        <div className="pg-collection-body">
          <TalkList items={page.items} />
        </div>
      </main>
    </SiteFrame>
  );
}
