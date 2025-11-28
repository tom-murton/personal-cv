import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface GradientBlobsProps {
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  animated?: boolean;
}

// Memoized version of the component to prevent unnecessary re-renders
const GradientBlobs = memo(({
  className,
  intensity = 'medium',
  animated = true,
}: GradientBlobsProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  // Different opacity based on intensity - memoized to prevent recreation
  const intensityMap = useMemo(() => ({
    light: 'opacity-[0.15]',
    medium: 'opacity-[0.25]',
    strong: 'opacity-[0.35]',
  }), []);

  // Memoize animation variants to prevent recreation on each render
  const topBlobAnimation = useMemo(() => ({
    initial: shouldAnimate ? { x: -100, opacity: 0 } : {},
    animate: shouldAnimate ? { 
      x: 0, 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut" }
    } : {}
  }), [shouldAnimate]);

  const bottomBlobAnimation = useMemo(() => ({
    initial: shouldAnimate ? { x: 100, opacity: 0 } : {},
    animate: shouldAnimate ? { 
      x: 0, 
      opacity: 1,
      transition: { duration: 1.5, delay: 0.3, ease: "easeOut" }
    } : {}
  }), [shouldAnimate]);

  const centerBlobAnimation = useMemo(() => ({
    initial: shouldAnimate ? { scale: 0.8, opacity: 0 } : {},
    animate: shouldAnimate ? { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 1.8, delay: 0.5, ease: "easeOut" }
    } : {}
  }), [shouldAnimate]);

  return (
    <div 
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      {/* Top left blob */}
      <motion.div
        className={cn(
          "absolute -top-[30%] -left-[10%] w-[50%] aspect-square rounded-full bg-primary/40 blur-[100px] mix-blend-multiply",
          intensityMap[intensity]
        )}
        initial={topBlobAnimation.initial}
        animate={topBlobAnimation.animate}
      />

      {/* Bottom right blob */}
      <motion.div
        className={cn(
          "absolute -bottom-[20%] -right-[10%] w-[60%] aspect-square rounded-full bg-accent/40 blur-[100px] mix-blend-multiply",
          intensityMap[intensity]
        )}
        initial={bottomBlobAnimation.initial}
        animate={bottomBlobAnimation.animate}
      />

      {/* Center blob */}
      <motion.div
        className={cn(
          "absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[40%] aspect-square rounded-full bg-secondary/30 blur-[100px] mix-blend-multiply",
          intensityMap[intensity]
        )}
        initial={centerBlobAnimation.initial}
        animate={centerBlobAnimation.animate}
      />
    </div>
  );
});

// Add a display name for better debugging experience
GradientBlobs.displayName = 'GradientBlobs';

export { GradientBlobs }; 