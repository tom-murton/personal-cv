import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TalkList } from "@/components/site/TalkList";
import { usePortfolioContent } from "@/content/PortfolioContentContext";
import type { HomeTalksSection as HomeTalksSectionConfig } from "@/content/types";

interface HomeTalksSectionProps {
  section: HomeTalksSectionConfig;
}

export function HomeTalksSection({ section }: HomeTalksSectionProps) {
  const { talks } = usePortfolioContent();
  const talkById = new Map(talks.map((talk) => [talk.id, talk]));
  const items = section.itemIds.flatMap((id) => {
    const item = talkById.get(id);
    return item ? [item] : [];
  });

  return (
    <section className="pg-home-section pg-home-talks" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="pg-section-shell">
        <div id={`${section.id}-title`}>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            action={<Link className="pg-text-link" to="/talks">All talks <ArrowRight aria-hidden="true" /></Link>}
          />
        </div>
        <TalkList items={items} />
      </div>
    </section>
  );
}
