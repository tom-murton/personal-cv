import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { SiteFrame } from "@/components/site/SiteFrame";

export default function NotFound() {
  return (
    <SiteFrame
      title="Page not found"
      description="That page does not exist. Browse Tom Murton's current projects, writing and talks."
      robots="noindex,nofollow"
    >
      <main className="pg-not-found" id="main-content">
        <div className="pg-not-found__code" aria-hidden="true">404</div>

        <section className="pg-not-found__copy" aria-labelledby="not-found-title">
          <p className="pg-eyebrow">404 / Not in the collection</p>
          <h1 id="not-found-title">Nothing lives at this address.</h1>
          <p>
            The link may be out of date, or the page may have moved. Browse the
            current projects or return to the homepage.
          </p>

          <nav className="pg-not-found__actions" aria-label="Page recovery">
            <Link className="pg-not-found__primary" to="/projects">
              Browse projects
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="pg-not-found__secondary" to="/">Return home</Link>
          </nav>
        </section>
      </main>
    </SiteFrame>
  );
}
