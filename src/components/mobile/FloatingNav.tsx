import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Menu, X } from "lucide-react";

interface FloatingNavLinkProps {
  href: string;
  label: string;
  onClick: () => void;
}

const FloatingNavLink: React.FC<FloatingNavLinkProps> = ({ href, label, onClick }) => {
  return (
    <a
      href={href}
      className="block py-3 px-4 text-muted-foreground hover:text-white transition-colors"
      onClick={(e) => {
        if (href === "#top") {
          e.preventDefault();
        }
        onClick();
      }}
    >
      {label}
    </a>
  );
};

const FloatingNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);
  
  // Track scroll position to detect when near bottom
  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far down the page the user has scrolled (as a percentage)
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
      
      // Consider "near bottom" when scrolled 90% or more down the page
      setIsNearBottom(scrollPercentage >= 90);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Navigation items
  const navItems = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#articles", label: "Articles" },
    { href: "#talks", label: "Talks" },
    { href: "#top", label: "Back to Top" }
  ];
  
  // Handle clicking "Back to Top"
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };
  
  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      {/* Show Menu or Back to Top button based on scroll position */}
      <AnimatePresence mode="wait">
        {isNearBottom ? (
          <motion.button
            key="backtotop"
            onClick={handleBackToTop}
            className="bg-accent-teal/90 backdrop-blur-sm text-background-start rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.92 }}
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        ) : (
          <motion.button
            key="menu"
            onClick={() => setIsOpen(!isOpen)}
            className={`${isOpen ? 'bg-muted/30' : 'bg-accent-teal/90'} backdrop-blur-sm text-${isOpen ? 'white' : 'background-start'} rounded-full w-12 h-12 flex items-center justify-center shadow-lg`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.92 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Floating menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-16 right-0 bg-background-start/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-border/20"
            initial={{ opacity: 0, y: -20, width: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              width: "auto", 
              height: "auto", 
              transition: { 
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1]
              } 
            }}
            exit={{ 
              opacity: 0, 
              y: -20, 
              width: 0, 
              height: 0,
              transition: { 
                duration: 0.2,
                ease: [0.23, 1, 0.32, 1]
              }
            }}
          >
            {/* Navigation items */}
            <div className="py-2 min-w-[180px]">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    transition: { delay: 0.05 * index } 
                  }}
                >
                  {item.href === "#top" ? (
                    <FloatingNavLink 
                      href={item.href} 
                      label={item.label} 
                      onClick={handleBackToTop} 
                    />
                  ) : (
                    <FloatingNavLink 
                      href={item.href} 
                      label={item.label} 
                      onClick={() => setIsOpen(false)} 
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNav; 