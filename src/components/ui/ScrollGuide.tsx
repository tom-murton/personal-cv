import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface ScrollGuideProps {
  className?: string;
  hideAfterScroll?: boolean;
  direction?: 'down' | 'up';
  color?: 'light' | 'dark';
  text?: string;
  timing?: number; // milliseconds before showing
}

export const ScrollGuide: React.FC<ScrollGuideProps> = ({
  className,
  hideAfterScroll = true,
  direction = 'down',
  color = 'light',
  text = 'Scroll to explore',
  timing = 3000,
}) => {
  const [show, setShow] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Show after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, timing);

    return () => clearTimeout(timer);
  }, [timing]);

  // Hide after scroll if enabled
  useEffect(() => {
    if (!hideAfterScroll) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideAfterScroll]);

  // Don't show if user has already scrolled
  if (hasScrolled) return null;

  // Track in localStorage if it's been seen (for future enhancement)
  const colorClasses = color === 'light' 
    ? 'text-white bg-black/10 backdrop-blur-sm' 
    : 'text-slate-800 bg-white/80 backdrop-blur-sm';

  const bounceAnimation = {
    y: [0, direction === 'down' ? 6 : -6, 0],
    transition: {
      y: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={cn(
            'fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full shadow-md',
            colorClasses,
            className
          )}
          initial={{ opacity: 0, y: direction === 'down' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{text}</span>
            <motion.div
              animate={prefersReducedMotion ? {} : bounceAnimation}
            >
              <ChevronDown 
                className={cn(
                  "w-4 h-4",
                  direction === 'up' && "rotate-180"
                )} 
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 