import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import useIsTouchDevice from '@/hooks/useIsTouchDevice';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  title: string;
  description: string;
  date: string;
  link: string;
  image?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  description,
  date,
  link,
  image,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  
  // Define hover animation based on device and preferences
  const hoverAnimation = (!prefersReducedMotion && !isTouchDevice) 
    ? { scale: 1.03, y: -5 } 
    : {};
  
  // Define tap animation for touch devices
  const tapAnimation = (!prefersReducedMotion && isTouchDevice)
    ? { scale: 0.98 }
    : {};
  
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-accent-teal focus:ring-opacity-50 h-full"
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0] // cubic-bezier easing for smoother motion
      }}
    >
      {/* Card glow effect on hover */}
      <motion.div 
        className="absolute -inset-px opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-accent-teal/10 via-transparent to-primary/5 rounded-lg z-0"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Article image thumbnail with zoom effect if available */}
      {image && (
        <div className="relative h-40 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          <motion.div
            className="w-full h-full transform-gpu"
            whileHover={!prefersReducedMotion ? { scale: 1.07 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <OptimizedImage
              src={image}
              alt={title}
              className="w-full h-full transform transition-transform"
              objectFit="cover"
            />
          </motion.div>
        </div>
      )}
      
      <div className={cn("p-4 sm:p-6 relative z-10", !image && "h-full flex flex-col")}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-mono">{date}</p>
          <ExternalLink className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:text-accent-teal group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3 className="mt-2 text-lg sm:text-xl font-semibold tracking-tight group-hover:text-accent-teal transition-all duration-300">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm sm:text-base text-muted-foreground">{description}</p>
        
        {/* Mobile-friendly action indicator */}
        <div className={cn("mt-4 pt-3 border-t border-border/30 flex items-center justify-between", !image && "mt-auto")}>
          <motion.span 
            className="text-sm text-accent-teal"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            Read article
          </motion.span>
          <motion.div 
            className="h-8 w-8 rounded-full flex items-center justify-center bg-transparent group-hover:bg-accent-teal/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ExternalLink className="h-4 w-4 text-accent-teal" />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

export default ArticleCard;
