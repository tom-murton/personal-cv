import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { WritingItem } from "@/content/types";

interface WritingListProps {
  items: WritingItem[];
}

export function WritingList({ items }: WritingListProps) {
  return (
    <ol className="pg-writing-list">
      {items.map((item, index) => {
        const content = (
          <>
            <span className="pg-writing-list__number">{String(index + 1).padStart(2, "0")}</span>
            <span className="pg-writing-list__type">{item.body?.length ? "Project story" : "Article"}</span>
            <span className="pg-writing-list__main">
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>
            <time>{item.date}</time>
            <ArrowUpRight aria-hidden="true" />
          </>
        );

        return (
          <li key={item.id}>
            {item.body?.length
              ? <Link to={`/writing/${item.id}`}>{content}</Link>
              : <a href={item.link} target="_blank" rel="noreferrer">{content}</a>}
          </li>
        );
      })}
    </ol>
  );
}
