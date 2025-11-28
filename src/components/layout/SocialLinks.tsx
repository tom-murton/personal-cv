
import React from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const SocialLinks: React.FC<{ className?: string; vertical?: boolean }> = ({ 
  className = "",
  vertical = false 
}) => {
  const isMobile = useIsMobile();
  const finalVertical = isMobile ? false : vertical;
  const iconSize = 22; // 10% larger than original 20px
  
  return (
    <div className={`flex ${finalVertical ? 'flex-col space-y-6' : 'space-x-4'} ${className}`}>
      <a
        href="https://github.com/tom-murton/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-white transition-colors"
        aria-label="GitHub"
      >
        <Github 
          size={iconSize} 
          className="transition-transform duration-200 hover:scale-110" 
        />
      </a>
      <a
        href="https://www.linkedin.com/in/tommurton/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-white transition-colors"
        aria-label="LinkedIn"
      >
        <Linkedin 
          size={iconSize} 
          className="transition-transform duration-200 hover:scale-110" 
        />
      </a>
      <a
        href="https://www.instagram.com/tom.murton"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-white transition-colors"
        aria-label="Instagram"
      >
        <Instagram 
          size={iconSize} 
          className="transition-transform duration-200 hover:scale-110" 
        />
      </a>
    </div>
  );
};

export default SocialLinks;
