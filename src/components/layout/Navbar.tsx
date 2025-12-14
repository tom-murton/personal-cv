import React, { useState, useEffect, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Instagram } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Logo from "./Logo";

// Memoized NavItem component to prevent unnecessary re-renders
const NavItem = memo(({ 
  item, 
  index, 
  activeSection, 
  onNavClick 
}: { 
  item: { id: string; label: string; number: string }; 
  index: number; 
  activeSection: string;
  onNavClick: (id: string) => void;
}) => (
  <motion.button
    key={item.id}
    onClick={() => onNavClick(item.id)}
    className={`relative text-sm group ${
      activeSection === item.id 
        ? "text-white" 
        : "text-muted-foreground hover:text-white"
    }`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <span className="text-accent-teal font-mono text-xs mr-2">{item.number}.</span>
    {item.label}
    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent-teal transition-all duration-300 group-hover:w-full" />
    {activeSection === item.id && (
      <motion.span 
        className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent-teal"
        layoutId="activeSection"
      />
    )}
  </motion.button>
));
NavItem.displayName = "NavItem";

// Memoized Instagram link component
const InstagramLink = memo(({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Link
      to="/instagram"
      className="text-muted-foreground hover:text-white transition-colors flex items-center"
      aria-label="Instagram Feed"
    >
      <Instagram size={18} className="mr-1" />
    </Link>
  </motion.div>
));
InstagramLink.displayName = "InstagramLink";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Get scroll progress for progress indicator
  const { scrollYProgress } = useScroll();
  const scrollIndicatorWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Navigation items with numbers - memoized to prevent recreation on every render
  const navigationItems = React.useMemo(() => [
    { id: "hero", label: "Home", number: "01" },
    { id: "about", label: "About", number: "02" },
    { id: "projects", label: "Projects", number: "03" },
    { id: "experience", label: "Experience", number: "04" },
    { id: "articles", label: "Articles", number: "05" },
    { id: "talks", label: "Talks", number: "06" }
  ], []);

  // Memoized scroll event handler
  const handleScroll = useCallback(() => {
    // Update scrolled state immediately for smooth transition
    const offset = window.scrollY;
    setScrolled(offset > 50);
    
    // The section detection code is left outside the callback since it uses setTimeout
    // and creates a new function on every render anyway
  }, []);

  // Add scroll event listener with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScrollWithSectionDetection = () => {
      handleScroll();
      
      // Debounce the more expensive active section calculation
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY + 100;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
          const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - 100;
          const sectionHeight = (section as HTMLElement).offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(section.id);
          }
        });
      }, 100); // 100ms debounce
    };

    window.addEventListener("scroll", handleScrollWithSectionDetection);
    return () => {
      window.removeEventListener("scroll", handleScrollWithSectionDetection);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Memoized scroll function to prevent recreation on every render
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
    if (isOpen) setIsOpen(false);
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-teal origin-left"
        style={{ scaleX: scrollIndicatorWidth }}
      />
      
      {/* Navbar Background */}
      <div 
        className={`
          relative bg-navy transition-all duration-300
          ${scrolled ? "shadow-md py-3" : "py-5"}
        `}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-white text-2xl font-bold">
              <Logo />
            </Link>
          </motion.div>

          {/* Desktop Navigation - hidden to remove top menu bar */}
          <nav className="hidden">
            {navigationItems.map((item, index) => (
              <NavItem 
                key={item.id}
                item={item}
                index={index}
                activeSection={activeSection}
                onNavClick={scrollToSection}
              />
            ))}
            
            {/* Instagram Link */}
            <InstagramLink delay={navigationItems.length * 0.1} />
          </nav>

          {/* Remove the Mobile Menu Button - we're using FloatingNav instead */}
          {/* Keep the remaining mobile menu implementation in case it's needed later */}
          <div className="md:hidden">
            {/* Empty div to maintain flex layout */}
          </div>
        </div>
      </div>

      {/* Keep the mobile menu implementation but don't display it */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-navy md:hidden hidden" // Added 'hidden' to prevent display
          >
            <motion.div 
              className="h-full flex flex-col justify-center items-center space-y-8 py-20"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
            >
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-3xl ${
                    activeSection === item.id ? "text-white" : "text-muted-foreground"
                  }`}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 20 }
                  }}
                >
                  <span className="text-accent-teal font-mono text-base block mb-2">
                    {item.number}.
                  </span>
                  {item.label}
                </motion.button>
              ))}
              
              <motion.div 
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 }
                }}
              >
                <Link 
                  to="/instagram" 
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2 mt-8"
                  aria-label="Instagram Feed"
                >
                  <Instagram size={20} />
                  Instagram
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default React.memo(Navbar);
