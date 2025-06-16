import React from 'react';
import styles from '../styles/TocButton.module.css';

interface TocButtonProps {
  onToggle: () => void;
  isNavigationVisible: boolean;
  showOnPageTypes?: ('blog' | 'project' | 'archive' | 'detail')[];
  currentPageType?: 'blog' | 'project' | 'archive' | 'detail' | 'home';
}

const TocButton: React.FC<TocButtonProps> = ({ 
  onToggle, 
  isNavigationVisible,
  showOnPageTypes = ['blog', 'project', 'archive', 'detail'],
  currentPageType
}) => {
  // Only show on specific page types
  const allowedPageTypes = ['blog', 'project', 'archive', 'detail'] as const;
  const isAllowedPageType = (type: string | undefined): type is typeof allowedPageTypes[number] =>
    !!type && allowedPageTypes.includes(type as typeof allowedPageTypes[number]);
  const shouldShowButton = isAllowedPageType(currentPageType) && showOnPageTypes.includes(currentPageType);

  if (!shouldShowButton) {
    return null;
  }

  return (
    <div className={styles.tocButton}>
      <button
        type="button"
        onClick={onToggle}
        className={`${styles.tocBtn} ${isNavigationVisible ? styles.active : ''}`}
        aria-label={isNavigationVisible ? "Hide table of contents" : "Show table of contents"}
        title={isNavigationVisible ? "Hide table of contents" : "Show table of contents"}
      >
        <i className={isNavigationVisible ? "fas fa-times" : "fas fa-list"}></i>
      </button>
    </div>
  );
};

export default TocButton;
