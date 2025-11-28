import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}

const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  content,
  side = "top",
  align = "center",
  sideOffset = 8,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isTouchDevice = useIsTouchDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Position calculations based on side and align
  const getPosition = () => {
    let position: any = {};
    
    switch (side) {
      case "top":
        position.bottom = "100%";
        position.marginBottom = `${sideOffset}px`;
        break;
      case "right":
        position.left = "100%";
        position.marginLeft = `${sideOffset}px`;
        break;
      case "bottom":
        position.top = "100%";
        position.marginTop = `${sideOffset}px`;
        break;
      case "left":
        position.right = "100%";
        position.marginRight = `${sideOffset}px`;
        break;
    }
    
    switch (align) {
      case "start":
        if (side === "top" || side === "bottom") position.left = 0;
        if (side === "left" || side === "right") position.top = 0;
        break;
      case "center":
        if (side === "top" || side === "bottom") {
          position.left = "50%";
          position.transform = "translateX(-50%)";
        }
        if (side === "left" || side === "right") {
          position.top = "50%";
          position.transform = "translateY(-50%)";
        }
        break;
      case "end":
        if (side === "top" || side === "bottom") position.right = 0;
        if (side === "left" || side === "right") position.bottom = 0;
        break;
    }
    
    return position;
  };
  
  // Handler for show/hide based on device type
  const getInteractionProps = () => {
    if (isTouchDevice) {
      return {
        onClick: () => setIsOpen(!isOpen), // Toggle on touch
      };
    } else {
      return {
        onMouseEnter: () => setIsOpen(true),
        onMouseLeave: () => setIsOpen(false),
      };
    }
  };
  
  // Animation settings - respect reduced motion
  const animationConfig = prefersReducedMotion 
    ? { duration: 0 } 
    : { duration: 0.2 };
  
  return (
    <div
      className={`relative inline-block ${className}`}
      {...getInteractionProps()}
    >
      {/* Trigger Element */}
      {trigger}
      
      {/* Hover Card Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 min-w-[220px] p-4 rounded-md bg-background-start border border-border/40 shadow-lg"
            style={getPosition()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={animationConfig}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverCard; 