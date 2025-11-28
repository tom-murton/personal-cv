import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";

interface CursorEffectProps {
  variant?: "glow" | "dot" | "ring";
  color?: string;
  size?: number;
  blur?: number;
  opacity?: number;
}

const CursorEffect: React.FC<CursorEffectProps> = ({
  variant = "glow",
  color = "hsl(var(--accent-teal))",
  size = 32,
  blur = 10,
  opacity = 0.3,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  
  // Don't render on touch devices or if reduced motion is preferred
  if (isTouchDevice || prefersReducedMotion) {
    return null;
  }
  
  // Motion values for cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Add spring physics for smooth movement
  const springConfig = { damping: 30, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
    // Add event listeners
    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);
  
  // Render different cursor variants
  const renderCursor = () => {
    const baseStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 9999,
      pointerEvents: "none",
      translateX: "-50%",
      translateY: "-50%",
      x: cursorXSpring,
      y: cursorYSpring,
      opacity: isVisible ? opacity : 0,
    } as const;
    
    switch (variant) {
      case "dot":
        return (
          <motion.div
            style={{
              ...baseStyle,
              width: size / 4,
              height: size / 4,
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />
        );
      case "ring":
        return (
          <motion.div
            style={{
              ...baseStyle,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1.5px solid ${color}`,
              mixBlendMode: "difference",
            }}
          />
        );
      case "glow":
      default:
        return (
          <motion.div
            style={{
              ...baseStyle,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              filter: `blur(${blur}px)`,
            }}
          />
        );
    }
  };
  
  return renderCursor();
};

export default CursorEffect; 