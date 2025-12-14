import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Menu, X } from "lucide-react";

const FloatingNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    { id: "hero", label: "Home", isRoute: false },
    { id: "about", label: "About", isRoute: false },
    { id: "projects", label: "Projects", isRoute: true },
    { id: "experience", label: "Experience", isRoute: false },
    { id: "articles", label: "Articles", isRoute: false },
    { id: "talks", label: "Talks", isRoute: false },
    { id: "top", label: "Back to Top", isRoute: false }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 60; // Smaller offset for mobile
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleNavigation = (item: typeof navItems[0]) => {
    // Close menu first to prevent animation interference
    setIsOpen(false);

    // Special handling for "Back to Top"
    if (item.id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.isRoute) {
      // Regular route navigation
      navigate(`/${item.id}`);
    } else if (location.pathname === '/') {
      // On home page - scroll after menu closes (150ms delay for animation)
      setTimeout(() => {
        scrollToSection(item.id);
      }, 150);
    } else {
      // On other page - navigate to home with section state
      navigate('/', { state: { scrollTo: item.id } });
    }
  };
  
  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      {/* Show Menu or Back to Top button based on scroll position */}
      <AnimatePresence mode="wait">
        {isNearBottom ? (
          <motion.button
            key="backtotop"
            onClick={() => handleNavigation({ id: "top", label: "Back to Top", isRoute: false })}
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
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation items */}
            <div className="py-2 min-w-[180px]">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.05 * index }
                  }}
                >
                  <button
                    type="button"
                    className="block w-full text-left py-3 px-4 text-muted-foreground hover:text-white transition-colors"
                    onClick={() => handleNavigation(item)}
                  >
                    {item.label}
                  </button>
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