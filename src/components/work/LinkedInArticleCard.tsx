import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkedInArticleCardProps {
  title: string;
  description: string;
  date: string;
  url: string;
  imageUrl?: string;
}

export const LinkedInArticleCard: React.FC<LinkedInArticleCardProps> = ({
  title,
  description,
  date,
  url,
  imageUrl,
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary"
    >
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{date}</p>
          <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 line-clamp-2 text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}; 