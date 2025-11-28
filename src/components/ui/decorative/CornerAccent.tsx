import React from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface CornerAccentProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
  size?: number;
  variant?: "line" | "dot" | "square";
  className?: string;
}

const CornerAccent: React.FC<CornerAccentProps> = ({
  position = "top-right",
  color = "hsl(var(--accent-teal))",
  size = 80,
  variant = "line",
  className = "",
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Position styles
  const positionStyles: { [key: string]: string } = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0"
  };
  
  // Transform based on position
  const getTransform = () => {
    switch (position) {
      case "top-left": return "rotate(180deg)";
      case "top-right": return "rotate(270deg)";
      case "bottom-left": return "rotate(90deg)";
      case "bottom-right": return "rotate(0deg)";
    }
  };
  
  // Generate SVG based on variant
  const renderSvg = () => {
    switch (variant) {
      case "line":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: getTransform() }}
          >
            <motion.path
              d="M0 0L80 0L80 2C80 37.4213 50.9214 66.5 15.5 66.5L0 66.5L0 0Z"
              fill={color}
              fillOpacity="0.15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.15 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M0 0L40 0L40 1.5C40 18.1355 26.6355 31.5 10 31.5L0 31.5L0 0Z"
              fill={color}
              fillOpacity="0.25"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.25 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
            />
          </svg>
        );
      case "dot":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: getTransform() }}
          >
            <motion.circle
              cx="60"
              cy="20"
              r="8"
              fill={color}
              fillOpacity="0.2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.circle
              cx="40"
              cy="40"
              r="5"
              fill={color}
              fillOpacity="0.15"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            />
            <motion.circle
              cx="20"
              cy="60"
              r="3"
              fill={color}
              fillOpacity="0.1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            />
          </svg>
        );
      case "square":
      default:
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: getTransform() }}
          >
            <motion.rect
              x="0"
              y="0"
              width="80"
              height="2"
              fill={color}
              fillOpacity="0.2"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.2 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.rect
              x="78"
              y="0"
              width="80"
              height="2"
              fill={color}
              fillOpacity="0.2"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.2 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
          </svg>
        );
    }
  };
  
  // Don't animate if reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <div 
        className={`absolute ${positionStyles[position]} pointer-events-none ${className}`}
        style={{ width: size, height: size, opacity: 0.15 }}
      >
        {renderSvg()}
      </div>
    );
  }
  
  return (
    <div 
      className={`absolute ${positionStyles[position]} pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {renderSvg()}
    </div>
  );
};

export default CornerAccent; 