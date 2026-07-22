interface CollectionIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  count?: number;
}

export function CollectionIntro({ eyebrow, title, description, count }: CollectionIntroProps) {
  return (
    <header className="pg-collection-intro">
      <p className="pg-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div>
        <p>{description}</p>
        {typeof count === "number" && <span>{String(count).padStart(2, "0")} entries</span>}
      </div>
    </header>
  );
}

