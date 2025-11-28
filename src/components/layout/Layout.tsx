import React, { memo, useMemo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import SocialLinks from "./SocialLinks";
import SideNavigation from "./SideNavigation";
import FloatingNav from "../mobile/FloatingNav";

interface LayoutProps {
  children: React.ReactNode;
}

// Memoized sidebar component to prevent unnecessary re-renders
const Sidebar = memo(() => {
  // Memoize the style object to prevent recreation on every render
  const sidebarStyle = useMemo(() => ({ 
    left: 'max(20px, calc(50% - 580px))',
    top: '120px'
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden md:block fixed z-10"
      style={sidebarStyle}
    >
      <SideNavigation />
    </motion.div>
  );
});
Sidebar.displayName = 'Sidebar';

// Memoized social links component to prevent unnecessary re-renders
const FixedSocialLinks = memo(() => {
  // Memoize the style object to prevent recreation on every render
  const socialLinksStyle = useMemo(() => ({ 
    left: 'max(20px, calc(50% - 580px))'
  }), []);

  return (
    <div 
      className="fixed bottom-0 hidden md:block z-10" 
      style={socialLinksStyle}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SocialLinks vertical={true} />
        <div className="w-[1px] h-24 bg-muted-foreground/30 mx-auto mt-6"></div>
      </motion.div>
    </div>
  );
});
FixedSocialLinks.displayName = 'FixedSocialLinks';

// Memoized Layout component to prevent unnecessary re-renders
const Layout = memo(({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-page text-white relative date-styling key-achievements-highlight">
      {/* Background pattern with increased opacity */}
      <div className="absolute inset-0 pointer-events-none bg-dot-pattern opacity-10"></div>
      
      <Navbar />
      
      <div className="flex-grow relative">
        <div className="container mx-auto md:pl-36 relative">
          {/* Sidebar with proper sticky positioning and no overlap */}
          <Sidebar />
          
          {/* Main content with left padding to provide space for sidebar */}
          <main className="w-full">
            {/* Left side social links aligned with sidebar but at bottom */}
            <FixedSocialLinks />
            
            {children}
          </main>
        </div>
      </div>
      
      <Footer />
      <Toaster />
      
      {/* Floating Navigation for Mobile */}
      <FloatingNav />
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
