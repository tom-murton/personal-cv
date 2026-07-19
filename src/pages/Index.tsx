import { HeroSection } from "@/components/site/HeroSection";
import { HomeAboutSection } from "@/components/site/HomeAboutSection";
import { HomeProjectsSection } from "@/components/site/HomeProjectsSection";
import { HomeTalksSection } from "@/components/site/HomeTalksSection";
import { HomeWritingSection } from "@/components/site/HomeWritingSection";
import { SiteFrame } from "@/components/site/SiteFrame";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export default function Index() {
  const { homeSections } = usePortfolioContent();

  return (
    <SiteFrame>
      <main id="main-content">
        <HeroSection />
        {homeSections.filter((section) => section.enabled).map((section) => {
          if (section.kind === "projects") return <HomeProjectsSection key={section.id} section={section} />;
          if (section.kind === "writing") return <HomeWritingSection key={section.id} section={section} />;
          if (section.kind === "talks") return <HomeTalksSection key={section.id} section={section} />;
          return <HomeAboutSection key={section.id} section={section} />;
        })}
      </main>
    </SiteFrame>
  );
}
