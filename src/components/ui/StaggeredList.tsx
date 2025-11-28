import React from "react";
import { motion } from "framer-motion";

interface StaggeredListProps {
  children: React.ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  itemClassName?: string;
  once?: boolean;
}

/**
 * A component that renders a list with staggered animation effects.
 * Each item appears with a slight delay after the previous one.
 */
const StaggeredList: React.FC<StaggeredListProps> = ({ 
  children, 
  delay = 0.1,
  staggerDelay = 0.05,
  className = "",
  itemClassName = "",
  once = true
}) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };
  
  // Convert children to array
  const childrenArray = React.Children.toArray(children);
  
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      className={`space-y-2 ${className}`}
    >
      {childrenArray.map((child, i) => (
        <motion.li
          key={i}
          variants={item}
          className={`flex items-start gap-2 ${itemClassName}`}
        >
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default StaggeredList; 