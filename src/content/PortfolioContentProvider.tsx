import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PortfolioContentContext } from "@/content/PortfolioContentContext";
import { localPortfolioContent } from "@/content/localPortfolioContent";
import type { PortfolioContent } from "@/content/types";
import { sanityClient, sanityEnabled } from "@/sanity/client";
import { mapPortfolioContent, type RawPortfolioContent } from "@/sanity/mapPortfolioContent";
import { portfolioContentQuery, portfolioMutationQuery } from "@/sanity/query";

interface PortfolioContentProviderProps {
  children: ReactNode;
}

export function PortfolioContentProvider({ children }: PortfolioContentProviderProps) {
  const [content, setContent] = useState<PortfolioContent>(localPortfolioContent);

  useEffect(() => {
    if (!sanityEnabled) return;

    let active = true;
    const liveClient = sanityClient.withConfig({ useCdn: false });

    const refresh = async () => {
      try {
        const raw = await liveClient.fetch<RawPortfolioContent>(portfolioContentQuery);
        const mapped = mapPortfolioContent(raw, localPortfolioContent);
        if (active && mapped) setContent(mapped);
      } catch {
        // The checked-in content is deliberately a complete offline fallback.
      }
    };

    void refresh();
    const subscription = liveClient
      .listen(portfolioMutationQuery, {}, { visibility: "query" })
      .subscribe({ next: () => void refresh() });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => content, [content]);
  return <PortfolioContentContext.Provider value={value}>{children}</PortfolioContentContext.Provider>;
}
