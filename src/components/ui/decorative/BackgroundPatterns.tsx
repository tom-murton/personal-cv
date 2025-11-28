import React from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface BackgroundPatternsProps {
  variant?: "dots" | "grid" | "none";
  opacity?: number;
  className?: string;
}

const BackgroundPatterns: React.FC<BackgroundPatternsProps> = ({
  variant = "dots",
  opacity = 0.06,
  className = "",
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Don't render patterns if reduced motion is preferred
  if (prefersReducedMotion && variant !== "none") {
    return null;
  }
  
  // Generate pattern based on variant
  const renderPattern = () => {
    switch (variant) {
      case "dots":
        return (
          <div 
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{ 
              backgroundImage: `radial-gradient(circle, rgba(100, 255, 218, ${opacity}) 1px, transparent 1.5px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0',
            }}
          />
        );
      case "grid":
        return (
          <div 
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(100, 255, 218, ${opacity / 2}) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(100, 255, 218, ${opacity / 2}) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        );
      case "none":
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {renderPattern()}
    </motion.div>
  );
};

export default BackgroundPatterns; 