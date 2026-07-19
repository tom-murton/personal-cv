import { ArrowUpRight } from "lucide-react";
import type { Talk } from "@/content/types";

interface TalkListProps {
  items: Talk[];
}

export function TalkList({ items }: TalkListProps) {
  return (
    <div className="pg-talk-list">
      {items.map((talk) => (
        <a key={talk.id} className="pg-talk-card" href={talk.link} target="_blank" rel="noreferrer">
          <div className="pg-talk-card__stage" aria-hidden="true">
            <i /><i /><i /><span>LIVE</span>
          </div>
          <div className="pg-talk-card__copy">
            <span>{talk.event} · {talk.date}</span>
            <h3>{talk.title}</h3>
            <p>{talk.description}</p>
            <strong>View event <ArrowUpRight aria-hidden="true" /></strong>
          </div>
        </a>
      ))}
    </div>
  );
}

