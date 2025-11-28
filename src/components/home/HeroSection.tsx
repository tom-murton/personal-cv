
import React from "react";
import { motion } from "framer-motion";
import SocialLinks from "../layout/SocialLinks";
import type { HeroContent as HeroContentType } from "@/types/directus";

interface HeroSectionProps {
  heroContent: HeroContentType;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroContent }) => {
  // Ensure heroContent is never null or undefined
  const safeHeroContent = heroContent || {
    greeting: "Hi, my name is",
    name: "Tom Murton.",
    tagline: "Product & Engineering Leader & Photographer.",
    description: "I'm passionate about building great engineering teams and capturing moments through my lens."
  };
  
  return (
    <section className="min-h-[92vh] container px-6 py-10 relative">
      <div className="max-w-5xl mx-auto w-full text-left">
        <motion.p
          className="text-accent-teal mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {safeHeroContent.greeting}
        </motion.p>
        
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {safeHeroContent.name}
        </motion.h1>
        
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {safeHeroContent.tagline}
        </motion.h2>
        
        <motion.p
          className="text-muted-foreground mb-10 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {safeHeroContent.description}
        </motion.p>
        
        {/* Mobile horizontal social links (only visible on mobile) */}
        <motion.div
          className="mt-12 mb-6 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SocialLinks />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
