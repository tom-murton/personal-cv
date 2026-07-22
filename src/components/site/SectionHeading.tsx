interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <header className="pg-section-heading">
      <div>
        <p className="pg-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </header>
  );
}

