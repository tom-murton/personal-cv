
import React from "react";
import { useNavigate, useLocation } from "react-router";

const SideNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: "hero", label: "Home", number: "01", isRoute: false },
    { id: "about", label: "About", number: "02", isRoute: false },
    { id: "projects", label: "Projects", number: "03", isRoute: true },
    { id: "experience", label: "Experience", number: "04", isRoute: false },
    { id: "articles", label: "Articles", number: "05", isRoute: false },
    { id: "talks", label: "Talks", number: "06", isRoute: false }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.isRoute) {
      // Regular route navigation
      navigate(`/${item.id}`);
    } else if (location.pathname === '/') {
      // On home page - scroll directly to section
      scrollToSection(item.id);
    } else {
      // On other page - navigate to home with section state
      navigate('/', { state: { scrollTo: item.id } });
    }
  };

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item)}
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
