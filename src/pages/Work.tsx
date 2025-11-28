
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import SocialLinks from "@/components/layout/SocialLinks";
import ArticleCard from "@/components/work/ArticleCard";
import { 
  experiences as initialExperiences, 
  articles as initialArticles, 
  talks as initialTalks 
} from "@/data/workData";
import { aboutContent as initialAbout } from "@/data/navigationData";
import type { WorkExperience, Article, Talk, AboutContent } from "@/types/directus";

// Define navigation items for work page sections
const workNavigation = [
  { id: "1", label: "About", sectionId: "About", order: 1 },
  { id: "2", label: "Experience", sectionId: "Experience", order: 2 },
  { id: "3", label: "Articles", sectionId: "Articles", order: 3 },
  { id: "4", label: "Talks", sectionId: "Talks", order: 4 }
];

const Work = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>(initialExperiences.map(exp => ({
    ...exp,
    id: exp.id.toString(),
    skills: exp.skills || []
  })));
  const [articles, setArticles] = useState<Article[]>(initialArticles.map(article => ({
    ...article,
    id: article.id.toString()
  })));
  const [talks, setTalks] = useState<Talk[]>(initialTalks.map(talk => ({
    ...talk,
    id: talk.id.toString()
  })));
  const [aboutContent, setAboutContent] = useState<AboutContent>(initialAbout);
  
  const [activeSection, setActiveSection] = useState("About");
  const [navigation] = useState(workNavigation);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate position with offset to account for header
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      // Get all section IDs from the navigation
      const sectionIds = navigation.map(item => item.sectionId);
      
      // Check which section is currently in view
      const scrollPosition = window.scrollY + 100;
      
      // Check sections in reverse order (bottom to top)
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && scrollPosition >= section.offsetTop - 100) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigation]);

  return (
    <Layout>
      <div className="min-h-screen bg-navy text-[#ccd6f6] py-16 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Desktop sidebar - only visible on desktop and fixed */}
          <div className="hidden md:block md:fixed md:top-32 md:w-48 md:pl-12 md:pr-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl font-bold whitespace-nowrap">Tom Murton</h1>
                <p className="text-accent-teal whitespace-nowrap">Product & Engineering Leader</p>
              </div>
              
              <nav className="mt-8">
                <ul className="space-y-6">
                  {navigation.sort((a, b) => a.order - b.order).map((section) => (
                    <li key={section.id}>
                      <button 
                        onClick={() => scrollToSection(section.sectionId)}
                        className={`relative flex items-center text-sm uppercase tracking-wider transition-colors group ${
                          activeSection === section.sectionId 
                            ? "text-accent-teal" 
                            : "text-muted-foreground hover:text-[#ccd6f6]"
                        }`}
                      >
                        {activeSection === section.sectionId && (
                          <div className="absolute -left-5 w-3 h-[1px] bg-accent-teal"></div>
                        )}
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </div>

          {/* Mobile header - only visible on mobile */}
          <div className="md:hidden mb-8">
            <h1 className="text-3xl font-bold whitespace-nowrap">Tom Murton</h1>
            <p className="text-accent-teal whitespace-nowrap">Product & Engineering Leader</p>
            
            <div className="flex space-x-4 mt-6 overflow-x-auto pb-2">
              {navigation.sort((a, b) => a.order - b.order).map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.sectionId)}
                  className={`whitespace-nowrap text-sm uppercase tracking-wider transition-colors ${
                    activeSection === section.sectionId 
                      ? "text-accent-teal border-b border-accent-teal" 
                      : "text-muted-foreground"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
            
            {/* Mobile horizontal social links */}
            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>

          {/* Main content area - pushed to the right to align with other pages */}
          <div className="md:ml-72 max-w-5xl">
            {/* About Section */}
            <motion.section
              id="About"
              className="mb-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl text-accent-teal border-b border-muted pb-3 mb-8">
                <span className="opacity-70 mr-2">01.</span> {aboutContent.title}
              </h2>
              
              {aboutContent.subtitle && (
                <h3 className="text-lg font-semibold mb-6 text-[#ccd6f6]">
                  {aboutContent.subtitle}
                </h3>
              )}
              
              <div className="text-base space-y-6 text-[#ccd6f6]">
                {aboutContent.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
                
                {aboutContent.highlights && aboutContent.highlights.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-base font-semibold mb-4 text-[#ccd6f6]">Highlights</h4>
                    <ul className="space-y-3">
                      {aboutContent.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-accent-teal mr-3 mt-1">•</span>
                          <span className="text-[#ccd6f6]">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aboutContent.currentCompany && aboutContent.currentCompany.length > 0 && (
                  <p>
                    Currently, I&apos;m working at{" "}
                    <a 
                      href={aboutContent.currentCompanyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-accent-teal hover:underline"
                    >
                      {aboutContent.currentCompany}
                    </a>.
                  </p>
                )}
              </div>
            </motion.section>

            {/* Experience Section */}
            <section id="Experience" className="mb-24">
              <h2 className="text-xl text-accent-teal border-b border-muted pb-3 mb-8">
                <span className="opacity-70 mr-2">02.</span> Experience
              </h2>
              
              <div className="space-y-16">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                      <div className="w-full md:w-48 flex-shrink-0">
                        <p className="text-sm text-muted-foreground">{exp.period}</p>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-xl font-medium mb-1 flex items-start">
                          {exp.title}
                          {exp.company && (
                            <>
                              {" "}
                              <span className="text-muted-foreground mx-1">•</span>{" "}
                              {exp.companyLink ? (
                                <a
                                  href={exp.companyLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent-teal hover:underline inline-flex items-center"
                                >
                                  {exp.company}
                                </a>
                              ) : (
                                <span>{exp.company}</span>
                              )}
                            </>
                          )}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          London, UK • Hybrid
                        </p>
                        
                        <p className="text-[#ccd6f6] mb-4">{exp.description}</p>
                        
                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="space-y-3 mt-6">
                            {exp.achievements.map((achievement, i) => (
                              <div key={i} className="flex items-start">
                                <ChevronRight size={18} className="text-accent-teal flex-shrink-0 mt-1" />
                                <p className="text-[#ccd6f6] text-sm ml-2">{achievement}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Articles Section */}
            <section id="Articles" className="mb-24">
              <h2 className="text-xl text-accent-teal border-b border-muted pb-3 mb-8">
                <span className="opacity-70 mr-2">03.</span> Articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    date={article.date}
                    description={article.description}
                    link={article.link}
                    image={article.image}
                  />
                ))}
              </div>
            </section>

            {/* Talks Section */}
            <section id="Talks">
              <h2 className="text-xl text-accent-teal border-b border-muted pb-3 mb-8">
                <span className="opacity-70 mr-2">04.</span> Talks
              </h2>
              
              <div className="space-y-8">
                {talks.map((talk) => (
                  <motion.div
                    key={talk.id}
                    className="bg-navy-light p-6 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-medium mb-2">{talk.title}</h3>
                    <p className="text-accent-teal mb-2">{talk.event} • {talk.date}</p>
                    <p className="text-[#ccd6f6] mb-4">{talk.description}</p>
                    {talk.link && (
                      <a
                        href={talk.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-accent-teal transition-colors"
                      >
                        View Talk →
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Work;
