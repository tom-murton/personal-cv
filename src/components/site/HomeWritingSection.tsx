import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WritingList } from "@/components/site/WritingList";
import { usePortfolioContent } from "@/content/PortfolioContentContext";
import type { HomeWritingSection as HomeWritingSectionConfig } from "@/content/types";

interface HomeWritingSectionProps {
  section: HomeWritingSectionConfig;
}

export function HomeWritingSection({ section }: HomeWritingSectionProps) {
  const { writing } = usePortfolioContent();
  const writingById = new Map(writing.map((item) => [item.id, item]));
  const items = section.itemIds.flatMap((id) => {
    const item = writingById.get(id);
    return item ? [item] : [];
  });

  return (
    <section className="pg-home-section pg-home-writing" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="pg-section-shell">
        <div id={`${section.id}-title`}>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            action={<Link className="pg-text-link" to="/writing">All writing <ArrowRight aria-hidden="true" /></Link>}
          />
        </div>
        <WritingList items={items} />
      </div>
    </section>
  );
}
