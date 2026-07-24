import { ArrowUpRight } from "lucide-react";
import { CollectionIntro } from "@/components/site/CollectionIntro";
import { SiteFrame } from "@/components/site/SiteFrame";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export default function Cv() {
  const { collections, site } = usePortfolioContent();
  const page = collections.cv;

  return (
    <SiteFrame title="CV" description={page.description}>
      <main className="pg-cv-page" id="main-content">
        <CollectionIntro
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
        />

        <section className="pg-cv-links" aria-label="Professional profiles">
          {site.socialLinks.slice(0, 2).map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}<ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </section>

        <section className="pg-cv-experience" aria-labelledby="experience-title">
          <header>
            <p className="pg-eyebrow">Experience</p>
            <h2 id="experience-title">Career history</h2>
          </header>
          <div className="pg-cv-timeline">
            {page.items.map((experience) => (
              <article key={experience.id}>
                <div className="pg-cv-timeline__meta">
                  <time>{experience.period}</time>
                  <a href={experience.companyLink} target="_blank" rel="noreferrer">
                    {experience.company}<ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
                <div className="pg-cv-timeline__copy">
                  <h3>{experience.title}</h3>
                  <p>{experience.description}</p>
                  {experience.achievements && (
                    <ul>
                      {experience.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
                    </ul>
                  )}
                  <div className="pg-cv-skills" aria-label="Skills used">
                    {experience.skills.map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
