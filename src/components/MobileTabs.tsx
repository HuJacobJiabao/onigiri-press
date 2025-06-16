import React, { useState, useEffect } from 'react';
import styles from '../styles/MobileTabs.module.css';
import config from '../config/config';

interface MobileTabsProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

interface NavigationSection {
  title: string;
  icon: string;
  type: string;
  content?: string;
  items?: any[];
}

const MobileTabs: React.FC<MobileTabsProps> = ({ activeSection, onSectionChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Get navigation sections from config
  const navigationSections = Object.entries(config.home.navigation) as [string, NavigationSection][];

  // Define tab spacing relative to toggle button at 50%
  const tabSpacing = 40; // 60px spacing between tabs
  const startOffset = 40; // 80px offset from toggle button

  useEffect(() => {
    // Show tabs when page is scrolled up to given distance (same as ScrollToTop)
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        if (!shouldRender) {
          setShouldRender(true);
        }
      } else {
        if (shouldRender) {
          setIsExpanded(false); // Reset expanded state when hiding
          setTimeout(() => setShouldRender(false), 300); // Wait for animation to complete
        }
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [shouldRender]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle tab icon click with scroll to content top
  const handleTabClick = (sectionId: string) => {
    // Change the section
    onSectionChange(sectionId);
    
    // Scroll to the right content area on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Find the right content area by looking for the section ID or the about section
      const targetElement = document.getElementById(`${sectionId}-section`) || 
                            document.getElementById('about') ||
                            document.querySelector('.rightContent') ||
                            document.querySelector('[class*="rightContent"]');
      
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'instant',
          block: 'start'
        });
      }
    }
  };

  // Only show when scrolled down enough (same condition as ScrollToTop button)
  if (!shouldRender) {
    return null;
  }

  return (
    <div className={styles.mobileTabsContainer}>
      {/* Toggle Button */}
      <button
        className={`${styles.toggleButton} ${isExpanded ? styles.expanded : ''}`}
        onClick={toggleExpanded}
        aria-label={isExpanded ? "Collapse navigation tabs" : "Expand navigation tabs"}
        title={isExpanded ? "Collapse tabs" : "Expand tabs"}
      >
        <span className={styles.toggleIcon}>
          {isExpanded ? '✕' : '☰'}
        </span>
      </button>

      {/* Navigation Tabs */}
      {isExpanded && (
        <div className={styles.tabsWrapper}>
          {navigationSections.map(([sectionId, section], index) => (
            <button
              key={sectionId}
              className={`${styles.tabIcon} ${activeSection === sectionId ? styles.active : ''}`}
              onClick={() => handleTabClick(sectionId)}
              aria-label={`Switch to ${section.title} section`}
              style={{ 
                top: `calc(40% + ${startOffset + index * tabSpacing}px)`,
                animationDelay: `${0.1 + index * 0.1}s`
              }}
              title={section.title}
            >
              {section.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileTabs;
