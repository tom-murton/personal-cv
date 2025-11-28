import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ExternalLink, Video, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface TalkCardProps {
  talk: {
    title: string;
    event: string;
    description: string;
    date: string;
    link?: string;
    videoLink?: string;
    slidesLink?: string;
  };
}

const TalkCard: React.FC<TalkCardProps> = ({ talk }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Don't animate if user prefers reduced motion
  const shouldAnimate = !prefersReducedMotion;
  
  // Link button variants
  const linkButtonVariants = {
    initial: { opacity: 0.9, scale: 1 },
    hover: { opacity: 1, scale: 1.05, y: -2 },
    tap: { scale: 0.98 }
  };
  
  return (
    <motion.div
      className={cn(
        "p-0 rounded-lg transition-all duration-300 relative overflow-hidden",
        isHovered 
          ? "bg-card/30" 
          : "bg-transparent"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={shouldAnimate ? { y: -5 } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      {/* Background gradient effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent-teal/5 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
          <div className="flex-1">
            <motion.h3 
              className="text-xl font-semibold mb-1 group inline-flex items-center gap-1"
              animate={isHovered && shouldAnimate ? { color: "hsl(var(--accent-teal))" } : {}}
              transition={{ duration: 0.2 }}
            >
              {talk.title}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4 text-accent-teal" />
                </motion.div>
              )}
            </motion.h3>
            <motion.p 
              className="text-accent-teal"
              animate={isHovered && shouldAnimate ? { scale: 1.01, x: 1 } : {}}
              transition={{ duration: 0.2 }}
            >
              {talk.event}
            </motion.p>
          </div>
          <div className="flex items-center md:ml-4 mt-2 md:mt-0 text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <p className="font-mono text-sm whitespace-nowrap date-display">
              {talk.date}
            </p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6">{talk.description}</p>
        
        {/* Links section with enhanced buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {talk.link && (
            <motion.a
              href={talk.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/5 text-sm text-accent-teal hover:bg-primary/10 transition-colors"
              variants={linkButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Event Link
            </motion.a>
          )}
          
          {talk.videoLink && (
            <motion.a
              href={talk.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-accent-teal/5 text-sm text-accent-teal hover:bg-accent-teal/10 transition-colors"
              variants={linkButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Video className="h-4 w-4 mr-2" />
              Watch Video
            </motion.a>
          )}
          
          {talk.slidesLink && (
            <motion.a
              href={talk.slidesLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-secondary/10 text-sm text-accent-teal hover:bg-secondary/15 transition-colors"
              variants={linkButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Slides
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TalkCard;
