import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface FadeInContentProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
}

/**
 * A component that fades in content when it enters the viewport
 * with a subtle animation based on direction.
 */
const FadeInContent: React.FC<FadeInContentProps> = ({
  children,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  duration = 0.7,
  className = '',
  direction = 'up',
  distance = 20,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Define animation variants based on direction
  const getVariants = (): Variants => {
    // For users who prefer reduced motion, use a simple fade
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }

    // Otherwise, use directional animations
    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 },
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -distance },
          visible: { opacity: 1, y: 0 },
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: distance },
          visible: { opacity: 1, x: 0 },
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: -distance },
          visible: { opacity: 1, x: 0 },
        };
      case 'none':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  // Set up the Intersection Observer
  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, once]);

  return (
    <div ref={setRef} className={className}>
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={getVariants()}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier curve for a smooth feel
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default FadeInContent; 