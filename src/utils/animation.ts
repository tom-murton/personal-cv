import { Variants } from "framer-motion";

// Fade up animation - good for section titles and content
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] // Ease out cubic
    }
  })
};

// Fade in animation - more subtle, good for background elements
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: {
      delay: custom * 0.1,
      duration: 0.6
    }
  })
};

// Scale up animation - good for cards and important elements
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

// Container variant for staggered children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Slide in from side - good for sidebar elements
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

// Scroll progress animation - good for progress indicators
export const scrollProgress: Variants = {
  hidden: { scaleX: 0 },
  visible: { 
    scaleX: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Hover animation variants
// Subtle scale effect for buttons and interactive elements
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2, ease: "easeOut" }
};

// Lift effect for cards and larger elements
export const hoverLift = {
  y: -5,
  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
  transition: { duration: 0.2, ease: "easeOut" }
};

// Glow effect for special elements
export const hoverGlow = {
  boxShadow: "0 0 15px rgba(45, 212, 191, 0.5)",
  transition: { duration: 0.2 }
};

// Brightness increase for images and media
export const hoverBrightness = {
  filter: "brightness(1.1)",
  transition: { duration: 0.2 }
};

// Text underline effect for links
export const hoverUnderline = {
  textDecoration: "underline",
  textDecorationColor: "rgba(45, 212, 191, 0.8)",
  textUnderlineOffset: "4px",
  transition: { duration: 0.2 }
};

// Tap/click animation for interactive elements
export const tapAnimation = {
  scale: 0.98,
  transition: { duration: 0.1 }
}; 