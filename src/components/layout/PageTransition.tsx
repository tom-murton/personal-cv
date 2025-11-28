import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  location: string;
  className?: string;
}

/**
 * PageTransition component provides smooth transitions between page changes
 * It wraps page content and animates it when the location (route) changes
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  location,
  className = '',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 30,
          duration: 0.3,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition; 