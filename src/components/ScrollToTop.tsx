import React, { useState, useEffect } from 'react';
import styles from '../styles/ScrollToTop.module.css';

interface ScrollToTopProps {
  currentPageType?: 'blog' | 'project' | 'archive' | 'detail' | 'home';
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ currentPageType }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Check if we should always show on mobile for specific page types
  const shouldAlwaysShowOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      const allowedPageTypes = ['blog', 'project', 'archive', 'detail'];
      return currentPageType && allowedPageTypes.includes(currentPageType);
    }
    return false;
  };

  const shouldShow = isVisible || shouldAlwaysShowOnMobile();

  return (
    <div className={styles.scrollToTop}>
      {shouldShow && (
        <button
          type="button"
          onClick={scrollToTop}
          className={styles.scrollButton}
          aria-label="Scroll to top"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
