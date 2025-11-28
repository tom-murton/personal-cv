
import React from "react";

const SideNavigation: React.FC = () => {
  const navigationItems = [
    { id: "hero", label: "Home", number: "01" },
    { id: "about", label: "About", number: "02" },
    { id: "experience", label: "Experience", number: "03" },
    { id: "articles", label: "Articles", number: "04" },
    { id: "talks", label: "Talks", number: "05" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate position with offset to account for header
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="group flex flex-col items-start text-muted-foreground hover:text-white transition-colors"
        >
          <span className="text-accent-teal mb-1 font-mono text-xs">{item.number}</span>
          <span className="text-base group-hover:text-white transition-colors">
            {item.label}
          </span>
          <div className="w-0 h-[1px] bg-accent-teal transition-all duration-300 group-hover:w-full mt-1"></div>
        </button>
      ))}
    </nav>
  );
};

export default SideNavigation;
