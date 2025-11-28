import React from "react";
import { motion } from "framer-motion";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  once?: boolean;
  element?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.05,
  staggerChildren = 0.03,
  once = true,
  element = "span",
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Split text into characters for animation
  const characters = text.split("");
  
  // If reduced motion is preferred, just render the text
  if (prefersReducedMotion) {
    return React.createElement(element, { className }, text);
  }
  
  // Container and character animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: staggerChildren, 
        delayChildren: delay,
        duration: 0.1,
      }
    })
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: duration,
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: duration,
      }
    }
  };
  
  return React.createElement(
    motion.div,
    {
      className: `inline-block ${className}`,
      variants: container,
      initial: "hidden",
      whileInView: "visible",
      viewport: { once },
    },
    characters.map((char, index) => (
      <motion.span
        key={`${char}-${index}`}
        variants={child}
        className="inline-block"
      >
        {char === " " ? <span>&nbsp;</span> : char}
      </motion.span>
    ))
  );
};

export default TextReveal; 