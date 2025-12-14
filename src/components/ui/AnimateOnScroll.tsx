import React, { useEffect, useState, useCallback, memo } from 'react';
import { motion, Variants } from 'framer-motion';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { fadeUp } from '@/utils/animation';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  variants?: Variants;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
}

/**
 * A component that animates its children when they enter the viewport
 * Respects user's preference for reduced motion
 */
const AnimateOnScroll = memo(({
  children,
  variants = fadeUp,
  threshold: propThreshold = 0.1,
  rootMargin: propRootMargin = '200px',
  className = '',
  style = {},
  delay = 0,
  duration,
}: AnimateOnScrollProps) => {
  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Memoize the check mobile function to prevent recreation on each render
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  useEffect(() => {
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);
  
  // Use more aggressive settings on mobile
  const threshold = isMobile ? 0.01 : propThreshold;
  const rootMargin = isMobile ? '500px' : propRootMargin;

  // Get intersection observer for detecting when element enters viewport
  const [elementRef, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  });

  // Check if user prefers reduced motion
  const prefersReducedMotion = usePrefersReducedMotion();

  // If user prefers reduced motion, don't animate
  if (prefersReducedMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      custom={delay}
      transition={duration ? { duration } : undefined}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
});

// Add display name for better debugging
AnimateOnScroll.displayName = 'AnimateOnScroll';

export default AnimateOnScroll; 