
import React from "react";
import { motion } from "framer-motion";

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mb-10">
      <ul className="space-y-6">
        {tabs.map((tab) => (
          <li key={tab}>
            <button 
              onClick={() => onTabChange(tab)}
              className={`relative flex items-center text-lg transition-colors group ${
                activeTab === tab 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {activeTab === tab && (
                <div className="absolute -left-8 w-5 h-[1px] bg-white"></div>
              )}
              {tab}
              <div className={`absolute -left-8 w-0 h-[1px] bg-white transition-all duration-300 ${
                activeTab !== tab ? "group-hover:w-5" : "w-5"
              }`}></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabNavigation;
