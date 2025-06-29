import type { ReactNode } from 'react';
import { useState } from 'react';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import TocButton from './TocButton';
import NavigationCard from './NavigationCard';
import Tag from './Tag';
import styles from '../styles/Layout.module.css';
import ScrollToTop from './ScrollToTop';
import { formatDateForDisplay } from '../utils/dateFormatter';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  headerBackground?: string;
  sidebarItems?: { title: string; id?: string }[];
  sidebarItemType?: 'project' | 'blog' | 'archive' | 'toc';
  onSidebarItemClick?: (index: number) => void;
  activeItemId?: string;
  contentType?: 'project' | 'blog' | 'dailylog';
  // Metadata props for project/blog pages
  contentItemDate?: string;
  contentItemTags?: string[];
  contentItemCategory?: string;
  contentItemLastUpdate?: string;
  // Tag folding props
  maxVisibleTags?: number;
}

export default function Layout({ 
  children, 
  title, 
  headerBackground,
  sidebarItems, 
  sidebarItemType, 
  onSidebarItemClick,
  activeItemId,
  contentItemDate,
  contentItemTags,
  contentType,
  contentItemCategory,
  contentItemLastUpdate,
  maxVisibleTags = 8  // Default to showing 8 tags
}: LayoutProps) {
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileNavigationVisible, setIsMobileNavigationVisible] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Toggle mobile navigation visibility
  const toggleMobileNavigation = () => {
    setIsMobileNavigationVisible(!isMobileNavigationVisible);
  };

  // Toggle between showing all tags or limited tags
  const toggleTagsVisibility = () => {
    setShowAllTags(!showAllTags);
  };

  // Determine current page type for TOC button
  const getCurrentPageType = (): 'blog' | 'project' | 'archive' | 'detail' | 'home' => {
    if (sidebarItemType === 'toc') return 'detail';
    if (sidebarItemType === 'blog') return 'blog';
    if (sidebarItemType === 'project') return 'project';
    if (sidebarItemType === 'archive') return 'archive';
    return 'home';
  };

  const headerStyle = headerBackground ? {
    backgroundImage: `url('${headerBackground}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : undefined;

  // Function to get dynamic title class based on title length
  const getTitleClasses = () => {
    if (!title || !contentType) return `${styles.pageTitle}`;
    
    const baseClass = `${styles.pageTitle} ${styles.articleTitle}`;
    const titleLength = title.length;
    
    // 提高阈值，让标题更多时候保持大字体，优先分行显示
    if (titleLength > 120) return `${baseClass} ${styles.superLong}`;  // 从80提高到120
    if (titleLength > 100) return `${baseClass} ${styles.extraLong}`;  // 从60提高到100
    if (titleLength > 80) return `${baseClass} ${styles.veryLong}`;    // 从40提高到80
    
    return baseClass;
  };

  // Determine if we need to show the "show more/less" button
  const shouldShowToggleButton = contentItemTags && contentItemTags.length > maxVisibleTags;
  
  // Get the header tags container class based on expand state
  const getHeaderTagsClass = () => {
    let baseClass = styles.headerTags;
    if (shouldShowToggleButton) {
      baseClass += showAllTags ? ` ${styles.expanded}` : ` ${styles.collapsed}`;
    }
    return baseClass;
  };
  
  // Get the tags to display based on the showAllTags state
  const tagsToDisplay = contentItemTags && contentItemTags.length > 0 
    ? (showAllTags ? contentItemTags : contentItemTags.slice(0, maxVisibleTags))
    : [];
    
  const hiddenTagsCount = contentItemTags ? contentItemTags.length - maxVisibleTags : 0;

  return (
    <>
      <div className={styles.wrapper}>
        
        <NavBar />
        
        {title && (
          <header className={`${styles.pageHeader} ${!contentType ? styles.titleOnlyPageHeader : ''}`} style={headerStyle}>
            <div className={`${styles.headerContent} ${!contentType ? styles.titleOnlyHeader : ''}`}>
              <div className={`${styles.titleArea} ${!contentType ? styles.titleOnlyArea : ''}`}>
                <h1 className={getTitleClasses()}>{title}</h1>
              </div>
              {contentType && (
                <>
                  <div className={styles.metadataArea}>
                    <div className={styles.headerMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Category:</span>
                        <span className={styles.metaValue}>{contentItemCategory}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Created:</span>
                        <span className={styles.metaValue}>
                          {contentType === 'dailylog' ? contentItemDate : formatDateForDisplay(contentItemDate)}
                        </span>
                      </div>
                      {contentItemLastUpdate && (
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Last Update:</span>
                          <span className={styles.metaValue}>{formatDateForDisplay(contentItemLastUpdate)}</span>
                        </div>
                      )}
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Type:</span>
                        <span className={styles.metaValue}>
                          {contentType === 'project' ? '💻 Project' : 
                           contentType === 'dailylog' ? '📝 Daily Log' : 
                           '📝 Blog Post'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {contentItemTags && contentItemTags.length > 0 && (
                    <div className={styles.tagsArea}>
                      <div 
                        className={getHeaderTagsClass()}
                      >
                        {tagsToDisplay.map((tag, index) => (
                          <Tag key={index} tag={tag} />
                        ))}
                        
                        {shouldShowToggleButton && (
                          <button 
                            className={styles.toggleTagsButton}
                            onClick={(e) => {
                              toggleTagsVisibility();
                              e.currentTarget.blur();
                            }}
                            aria-expanded={showAllTags}
                          >
                            {showAllTags ? (
                              <>
                                <i className="fa-solid fa-caret-up"></i>
                                Hide
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-caret-down"></i>
                                Show +{hiddenTagsCount}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </header>
        )}
        
        <main className={styles.main}>
          <div className={styles.aboutWrapper}>
            <div className={styles.aboutContainer}>
              {/* Desktop Sidebar - Hidden on mobile */}
              <div className={styles.desktopSidebar}>
                <Sidebar 
                  activeSection={activeSection} 
                  onSectionChange={setActiveSection}
                  items={sidebarItems}
                  itemType={sidebarItemType}
                  onItemClick={onSidebarItemClick}
                  activeItemId={activeItemId}
                />
              </div>
              
              <div className={styles.rightContentArea}>
                <div className={styles.rightContent}>
                  <div className={styles.content}>
                    {children}
                  </div>
                </div>
              </div>
              
              {/* Mobile Sidebar - Only visible on mobile, placed below content */}
              <div className={styles.mobileSidebar}>
                <Sidebar 
                  activeSection={activeSection} 
                  onSectionChange={setActiveSection}
                  items={sidebarItems}
                  itemType={sidebarItemType}
                  onItemClick={onSidebarItemClick}
                  activeItemId={activeItemId}
                />
              </div>
            </div>
          </div>
        </main>      <Footer />
      <ScrollToTop currentPageType={getCurrentPageType()} />
    </div>
      
      {/* TOC Button for mobile - placed outside wrapper for true global positioning */}
      <TocButton 
        onToggle={toggleMobileNavigation}
        isNavigationVisible={isMobileNavigationVisible}
        currentPageType={getCurrentPageType()}
      />
      
      {/* Floating Navigation Card for mobile TOC - also outside wrapper */}
      {isMobileNavigationVisible && sidebarItems && sidebarItems.length > 0 && (
        <div className={styles.floatingNavigationOverlay} onClick={toggleMobileNavigation}>
          <div className={styles.floatingNavigationCard} onClick={(e) => e.stopPropagation()}>
            <NavigationCard
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              items={sidebarItems}
              itemType={sidebarItemType}
              onItemClick={(index) => {
                onSidebarItemClick?.(index);
                setIsMobileNavigationVisible(false); // Close after selection
              }}
              activeItemId={activeItemId}
              isVisible={true}
              isMobileFloating={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
