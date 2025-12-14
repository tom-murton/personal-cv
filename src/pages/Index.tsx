import React, { memo, useMemo, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ArticleCard from "@/components/work/ArticleCard";
import TalkCard from "@/components/work/TalkCard";
import ExperienceCard from "@/components/work/ExperienceCard";
import { heroContent } from "@/data/homeData";
import { experiences, articles, talks } from "@/data/workData";
import { aboutContent } from "@/data/navigationData";
import { fadeUp, fadeIn, scaleUp, staggerContainer, slideInLeft } from "@/utils/animation";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import StaggeredList from "@/components/ui/StaggeredList";
import BackgroundPatterns from "@/components/ui/decorative/BackgroundPatterns";
import { GradientBlobs } from "@/components/ui/decorative/GradientBlobs";
import CornerAccent from "@/components/ui/decorative/CornerAccent";
import { renderParagraphsWithBullets } from "@/utils/renderHelpers";
import { ScrollGuide } from "@/components/ui/ScrollGuide";

// Memoized section components
const HeroSection = memo(() => (
  <section id="hero" className="section pt-32 relative">
    <CornerAccent position="top-right" variant="line" />
    
    <div className="max-w-4xl">
      <motion.p
        className="text-accent-teal font-mono mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {heroContent.greeting}
      </motion.p>
      
      <motion.h1
        className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {heroContent.name}
      </motion.h1>
      
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl text-accent-teal font-semibold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {heroContent.tagline}
      </motion.h2>
      
      <motion.p
        className="text-muted-foreground text-lg max-w-3xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {heroContent.description}
      </motion.p>
      
      {/* Add scroll guide for first-time visitors */}
      <ScrollGuide 
        text="Scroll to explore my work" 
        timing={4000}
        color="dark"
      />
    </div>
  </section>
));
HeroSection.displayName = 'HeroSection';

const AboutSection = memo(() => (
  <AnimateOnScroll>
    <section
      id="about"
      className="section border-t border-[#1a1f2e] relative"
      style={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      <CornerAccent position="top-left" variant="dot" size={60} />
      
      <motion.div className="mb-6" variants={fadeUp}>
        <h2 className="text-2xl mb-4 flex items-center">
          <span className="text-accent-teal mr-2 font-mono">02.</span>
          About Me
        </h2>
      </motion.div>
      
      <div className="max-w-4xl">
        {aboutContent.paragraphs.map((paragraph, index) => (
          <motion.p 
            key={index} 
            variants={fadeUp} 
            custom={index + 1}
            className="mb-4 text-lg text-muted-foreground"
          >
            {paragraph}
          </motion.p>
        ))}
        
        {aboutContent.highlights && aboutContent.highlights.length > 0 && (
          <motion.div 
            variants={fadeUp} 
            custom={aboutContent.paragraphs.length + 1}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold mb-4 text-foreground">Highlights</h3>
            <ul className="space-y-3">
              {aboutContent.highlights.map((highlight, index) => {
                const parts: React.ReactNode[] = [];
                let lastIndex = 0;
                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                let match;
                
                while ((match = linkRegex.exec(highlight)) !== null) {
                  if (match.index > lastIndex) {
                    parts.push(highlight.slice(lastIndex, match.index));
                  }
                  parts.push(
                    <a
                      key={`link-${index}-${match.index}`}
                      href={match[2]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-teal hover:underline"
                    >
                      {match[1]}
                    </a>
                  );
                  lastIndex = match.index + match[0].length;
                }
                if (lastIndex < highlight.length) {
                  parts.push(highlight.slice(lastIndex));
                }
                
                return (
                  <motion.li 
                    key={index}
                    variants={fadeUp}
                    custom={aboutContent.paragraphs.length + 2 + index}
                    className="flex items-start text-muted-foreground"
                  >
                    <span className="text-accent-teal mr-3 mt-1">•</span>
                    <span>{parts.length > 0 ? parts : highlight}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  </AnimateOnScroll>
));
AboutSection.displayName = 'AboutSection';

const ProjectsSection = memo(() => (
  <AnimateOnScroll>
    <section
      id="projects"
      className="section border-t border-[#1a1f2e] relative"
      style={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      <CornerAccent position="top-right" variant="square" size={70} />
      
      <motion.div className="mb-6" variants={fadeUp}>
        <h2 className="text-2xl mb-4 flex items-center">
          <span className="text-accent-teal mr-2 font-mono">03.</span>
          Projects
        </h2>
      </motion.div>
      
      <div className="max-w-4xl">
        <motion.p 
          variants={fadeUp}
          custom={1}
          className="mb-6 text-lg text-muted-foreground"
        >
          A collection of projects I've built independently, from idea to launch.
        </motion.p>
        
        <motion.div variants={fadeUp} custom={2}>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-accent-teal hover:text-accent-teal/80 transition-colors group"
          >
            <span>View Projects</span>
            <ArrowRight 
              size={18} 
              className="transition-transform duration-200 group-hover:translate-x-1" 
            />
          </Link>
        </motion.div>
      </div>
    </section>
  </AnimateOnScroll>
));
ProjectsSection.displayName = 'ProjectsSection';

// Memoized Experience item to avoid recreating components for each experience
const ExperienceItem = memo(({ experience, index }: { experience: typeof experiences[0], index: number }) => (
  <motion.div key={index} variants={fadeUp} custom={index}>
    <ExperienceCard 
      title={experience.title}
      company={experience.company}
      companyLink={experience.companyLink}
      period={experience.period}
      description={experience.description}
      achievements={experience.achievements}
    />
  </motion.div>
));
ExperienceItem.displayName = 'ExperienceItem';

const ExperienceSection = memo(() => {
  // Memoize the experience items to prevent recreation on each render
  const experienceItems = useMemo(() => 
    experiences.map((experience, index) => (
      <ExperienceItem key={index} experience={experience} index={index} />
    )),
    []
  );

  return (
    <AnimateOnScroll>
      <section id="experience" className="section border-t border-[#1a1f2e] relative">
        <CornerAccent position="top-right" variant="square" size={70} />
        
        <motion.div className="mb-6" variants={fadeUp}>
          <h2 className="text-2xl mb-4 flex items-center">
            <span className="text-accent-teal mr-2 font-mono">04.</span>
            Experience
          </h2>
        </motion.div>
        
        <motion.div 
          className="space-y-6 max-w-4xl"
          variants={staggerContainer}
        >
          {experienceItems}
        </motion.div>
      </section>
    </AnimateOnScroll>
  );
});
ExperienceSection.displayName = 'ExperienceSection';

// Memoized Article item to avoid recreating components for each article
const ArticleItem = memo(({ article, index }: { article: typeof articles[0], index: number }) => (
  <motion.div key={index} variants={fadeUp} custom={index}>
    <ArticleCard
      title={article.title}
      date={article.date}
      description={article.description}
      link={article.link}
    />
  </motion.div>
));
ArticleItem.displayName = 'ArticleItem';

const ArticlesSection = memo(() => {
  // Memoize the article items to prevent recreation on each render
  const articleItems = useMemo(() => 
    articles.map((article, index) => (
      <ArticleItem key={index} article={article} index={index} />
    )),
    []
  );

  return (
    <AnimateOnScroll>
      <section id="articles" className="section border-t border-[#1a1f2e] relative">
        <CornerAccent position="bottom-left" variant="line" />
        
        <motion.div className="mb-10" variants={fadeUp}>
          <h2 className="text-2xl mb-4 flex items-center">
            <span className="text-accent-teal mr-2 font-mono">05.</span>
            Articles
          </h2>
          <p className="text-lg text-muted-foreground">
            Thoughts and insights I've shared.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {articleItems}
        </div>
      </section>
    </AnimateOnScroll>
  );
});
ArticlesSection.displayName = 'ArticlesSection';

// Memoized Talk item to avoid recreating components for each talk
const TalkItem = memo(({ talk, index }: { talk: typeof talks[0], index: number }) => (
  <motion.div key={index} variants={fadeUp} custom={index}>
    <TalkCard key={index} talk={talk} />
  </motion.div>
));
TalkItem.displayName = 'TalkItem';

const TalksSection = memo(() => {
  // Memoize the talk items to prevent recreation on each render
  const talkItems = useMemo(() => 
    talks.map((talk, index) => (
      <TalkItem key={index} talk={talk} index={index} />
    )),
    []
  );

  return (
    <AnimateOnScroll>
      <section id="talks" className="section border-t border-[#1a1f2e] relative">
        <CornerAccent position="bottom-right" variant="dot" />
        
        <motion.div className="mb-10" variants={fadeUp}>
          <h2 className="text-2xl mb-4 flex items-center">
            <span className="text-accent-teal mr-2 font-mono">06.</span>
            Talks
          </h2>
          <p className="text-lg text-muted-foreground">
            Presentations, conferences, and speaking engagements.
          </p>
        </motion.div>
        
        <div className="space-y-6 max-w-4xl">
          {talkItems}
        </div>
      </section>
    </AnimateOnScroll>
  );
});
TalksSection.displayName = 'TalksSection';

// Main Index component using memoized section components
const Index = () => {
  const location = useLocation();

  // Handle scroll to section when navigating from other pages
  useEffect(() => {
    const scrollToSection = location.state?.scrollTo as string | undefined;

    if (scrollToSection) {
      // Use setTimeout to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location.state?.scrollTo]);

  return (
    <Layout>
      {/* Background Elements */}
      <BackgroundPatterns variant="dots" opacity={0.05} />
      <GradientBlobs />

      <main>
        <div className="container">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <ExperienceSection />
          <ArticlesSection />
          <TalksSection />
        </div>
      </main>
    </Layout>
  );
};

export default Index;
