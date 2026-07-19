import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteFrame } from "@/components/site/SiteFrame";

const configuredStudioUrl = import.meta.env.VITE_SANITY_STUDIO_URL as string | undefined;
const studioUrl = configuredStudioUrl ?? (import.meta.env.DEV ? "http://127.0.0.1:3333/admin" : undefined);

export default function Admin() {
  useEffect(() => {
    if (studioUrl) window.location.replace(studioUrl);
  }, []);

  if (studioUrl) return null;

  return (
    <SiteFrame title="Admin">
      <main className="pg-collection-page" id="main-content">
        <header className="pg-collection-intro">
          <p className="pg-eyebrow">Site admin</p>
          <h1>The editor has not been deployed yet.</h1>
          <div>
            <p>Set VITE_SANITY_STUDIO_URL to the deployed Studio address when the admin is published.</p>
            <a className="pg-text-link" href="https://www.sanity.io/manage" target="_blank" rel="noreferrer">
              Open Sanity management <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </header>
      </main>
    </SiteFrame>
  );
}
