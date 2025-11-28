import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  speed?: number;
}

/**
 * A component that creates a subtle parallax effect on scroll
 */
const Parallax: React.FC<ParallaxProps> = ({
  children,
  offset = 50,
  direction = 'up',
  className = '',
  speed = 1
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  // Calculate movement based on direction
  const getMovement = () => {
    const adjustedOffset = offset * speed;
    
    switch (direction) {
      case 'up':
        return [adjustedOffset, 0];
      case 'down':
        return [-adjustedOffset, 0];
      case 'left':
        return [0, adjustedOffset];
      case 'right':
        return [0, -adjustedOffset];
      default:
        return [adjustedOffset, 0];
    }
  };
  
  const [yMovement, xMovement] = getMovement();
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [yMovement, 0]
  );
  
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [xMovement, 0]
  );
  
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Parallax; 