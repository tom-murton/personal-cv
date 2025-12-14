import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ChevronRight } from "lucide-react";
import { fadeUp } from "@/utils/animation";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  title: string;
  company: string;
  companyLink?: string;
  period: string;
  description: string;
  achievements?: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  company,
  companyLink,
  period,
  description,
  achievements = [],
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  
  // Adjust animation based on user preferences and device
  const animationProps = prefersReducedMotion 
    ? {} 
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-50px" },
        variants: fadeUp
      };
  
  return (
    <motion.div
      className={cn(
        "p-0 transition-all duration-300 rounded-lg relative",
        isHovered 
          ? "bg-card/30" 
          : "hover:bg-card/5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...animationProps}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] sm:text-[20px] font-semibold transition-colors duration-200 mb-[2px]">
            {title}
          </h2>
          {companyLink ? (
            <motion.a
              href={companyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-accent-teal hover:text-accent-teal/80 inline-flex items-center mt-0.5 gap-1 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:ring-offset-1 focus:ring-offset-background rounded"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              {company}
              <motion.div
                animate={{ x: isHovered ? 2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExternalLink size={16} className="hidden sm:inline-block" />
              </motion.div>
            </motion.a>
          ) : (
            <p className="text-lg text-accent-teal mt-1">{company}</p>
          )}
        </div>
        <p className="text-muted-foreground font-mono text-[15px] mt-[2px] sm:mt-[2px] mb-[2px] transition-colors duration-200 date-display">
          {period}
        </p>
      </div>
      
      <p className="text-muted-foreground mb-6 transition-colors duration-200">
        {description}
      </p>
      
      {achievements.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm uppercase tracking-wider mb-3 text-muted-foreground font-medium">
            KEY ACHIEVEMENTS
          </h4>
          
          <ul className="ml-0 space-y-3">
            {achievements.map((achievement, index) => (
              <motion.li 
                key={index} 
                className="flex items-start rounded-md hover:bg-card/20 transition-colors duration-200 p-1"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                whileHover={!prefersReducedMotion ? { x: 2 } : {}}
              >
                <motion.div
                  className="text-accent-teal mr-2 mt-1 flex-shrink-0"
                  animate={{ 
                    x: isHovered ? [0, 2, 0] : 0,
                    transition: { 
                      duration: 0.5,
                      repeat: isHovered ? Infinity : 0,
                      repeatType: "loop"
                    }
                  }}
                >
                  <ChevronRight size={14} />
                </motion.div>
                <span className="text-sm sm:text-base">{achievement}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceCard;
