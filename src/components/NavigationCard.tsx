import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/NavigationCard.module.css';
import config from '../config/config';
import { useNavbarState } from '../hooks/useNavbarState';

interface NavigationCardProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  items?: { title: string; id?: string; level?: number }[];
  itemType?: 'project' | 'blog' | 'archive' | 'toc';
  onItemClick?: (index: number) => void;
  activeItemId?: string;
  isVisible?: boolean; // For mobile TOC visibility control
  isMobileFloating?: boolean; // For mobile floating behavior
}

const NavigationCard: React.FC<NavigationCardProps> = React.memo(({ 
  activeSection, 
  onSectionChange, 
  items = [], 
  itemType,
  onItemClick,
  activeItemId,
  isVisible = true,
  isMobileFloating = false
}) => {
  // Get navbar state for synchronized positioning
  const { visible: navbarVisible } = useNavbarState();
  
  // State for sticky navigation card
  const [isSticky, setIsSticky] = useState(false);
  const [originalCardTop, setOriginalCardTop] = useState<number | null>(null); // D: original absolute position (constant)
  const [currentCardTop, setCurrentCardTop] = useState<number | null>(null); // d1: current absolute position (changes with animation)
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const [cardLeft, setCardLeft] = useState<number | null>(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0); // Track previous scroll position
  const navigationCardRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  
  // Throttling variable for scroll events
  const scrollTickingRef = useRef(false);

  // Scroll to active item when mobile floating mode is enabled
  useEffect(() => {
    if (isMobileFloating && activeItemId && navigationCardRef.current) {
      // Use requestAnimationFrame to ensure DOM is fully rendered and avoid the flash
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!navigationCardRef.current) return;
          
          console.log('Attempting to scroll to active item:', activeItemId);
          
          // Step 1: First, we need to find the hierarchyId for the activeItemId
          // This requires running through the same grouping logic to get the correct hierarchyId
          let targetHierarchyId: string | null = null;
          
          // Recreate the grouping logic to find the hierarchyId
          const groupedItems: { key: string; hierarchyId: string; items: any[] }[] = [];
          let currentLevel2: string | null = null;
          let currentLevel2Index = -1;
          const levelCounters: Record<number, number> = {};

          items.forEach((item, index) => {
            const level = item.level || 1; // Default to level 1 if undefined
            
            if (levelCounters[level] === undefined) {
              levelCounters[level] = 0;
            }
            
            if (level === 1) {
              const key = `level1-${index}`;
              const hierarchyId = `L1-${levelCounters[level]}`;
              levelCounters[level]++;
              
              const itemWithHierarchy = { ...item, originalIndex: index, hierarchyId };
              groupedItems.push({ key, hierarchyId, items: [itemWithHierarchy] });
              
              // Check if this is our target item
              if (item.id === activeItemId) {
                targetHierarchyId = hierarchyId;
              }
            } else if (level === 2) {
              currentLevel2 = item.id || `item-${index}`;
              const hierarchyId = `L2-${levelCounters[level]}`;
              levelCounters[level]++;
              
              currentLevel2Index = groupedItems.length;
              const itemWithHierarchy = { ...item, originalIndex: index, hierarchyId };
              groupedItems.push({ key: currentLevel2!, hierarchyId, items: [itemWithHierarchy] });
              
              // Check if this is our target item
              if (item.id === activeItemId) {
                targetHierarchyId = hierarchyId;
              }
              
              // Reset child level counters
              Object.keys(levelCounters).forEach(levelKey => {
                if (parseInt(levelKey) > 2) {
                  levelCounters[parseInt(levelKey)] = 0;
                }
              });
            } else if (level > 2 && currentLevel2 && currentLevel2Index >= 0) {
              const currentGroup = groupedItems[currentLevel2Index];
              if (currentGroup) {
                const parentHierarchyId = currentGroup.hierarchyId;
                const hierarchyId = `${parentHierarchyId}.${level}-${levelCounters[level]}`;
                levelCounters[level]++;
                
                const itemWithHierarchy = { ...item, originalIndex: index, hierarchyId };
                currentGroup.items.push(itemWithHierarchy);
                
                // Check if this is our target item
                if (item.id === activeItemId) {
                  targetHierarchyId = hierarchyId;
                }
              }
            }
          });
          
          console.log('Target hierarchyId found:', targetHierarchyId);
          
          // Step 2: Now find the button with this hierarchyId
          let activeElement: Element | null = null;
          
          if (targetHierarchyId) {
            // Find by exact hierarchyId match
            activeElement = navigationCardRef.current.querySelector(`[data-hierarchy-id="${targetHierarchyId}"]`);
            console.log('Found by exact hierarchyId match:', !!activeElement);
          }
          
          // Fallback: Find by active class
          if (!activeElement) {
            activeElement = navigationCardRef.current.querySelector('.active');
            console.log('Fallback - Found by active class:', !!activeElement);
          }
          
          console.log('Final active element found:', !!activeElement);
          
          if (activeElement && navigationCardRef.current) {
            const container = navigationCardRef.current;
            const containerHeight = container.clientHeight;
            
            // Calculate the actual offset position within the scrollable container
            let elementTop = 0;
            let element = activeElement as HTMLElement;
            
            // Walk up the DOM tree to find the cumulative offset
            while (element && element !== container) {
              elementTop += element.offsetTop;
              element = element.offsetParent as HTMLElement;
            }
            
            const elementHeight = (activeElement as HTMLElement).offsetHeight;
            
            // Calculate the center position
            const elementCenter = elementTop + (elementHeight / 2);
            const containerCenter = containerHeight / 2;
            
            // Calculate the scroll position needed to center the element
            const targetScrollTop = elementCenter - containerCenter;
            
            console.log('Scroll calculation:', {
              containerHeight,
              elementTop,
              elementHeight,
              elementCenter,
              containerCenter,
              targetScrollTop,
              finalScrollTop: Math.max(0, targetScrollTop)
            });
            
            // Set scroll position immediately without animation
            container.scrollTop = Math.max(0, targetScrollTop);
          } else {
            console.warn('Active element not found for activeItemId:', activeItemId);
            // Debug: list all available buttons
            const allButtons = navigationCardRef.current?.querySelectorAll('button');
            console.log('Available buttons:', Array.from(allButtons || []).map(btn => ({
              hierarchyId: btn.getAttribute('data-hierarchy-id'),
              title: btn.getAttribute('title'),
              textContent: btn.textContent?.trim().substring(0, 50)
            })));
          }
        });
      });
    }
  }, [isMobileFloating, activeItemId, items]);

  // Function to scroll an element to center when clicked
  const scrollToCenter = (element: HTMLElement) => {
    if (isMobileFloating && navigationCardRef.current) {
      const cardHeight = navigationCardRef.current.clientHeight;
      const elementHeight = element.offsetHeight;
      
      // Get the element's position relative to the scrollable container
      let elementTop = 0;
      let currentElement = element;
      
      while (currentElement && currentElement !== navigationCardRef.current) {
        elementTop += currentElement.offsetTop;
        currentElement = currentElement.offsetParent as HTMLElement;
        if (currentElement === navigationCardRef.current) break;
      }
      
      // Calculate scroll position to center the element
      const scrollTop = elementTop - (cardHeight / 2) + (elementHeight / 2);
      
      navigationCardRef.current.scrollTop = Math.max(0, scrollTop);
    }
  };

  // Define available sections for navigation - dynamically generate from config
  const generateSections = () => {
    const availableSections: { id: string; title: string; icon: string }[] = [];
    
    // Dynamically read from config.home.navigation and only include non-commented sections
    const navigation = config.home.navigation;
    
    // Iterate through all keys in navigation and add them if they exist and are not commented
    Object.keys(navigation || {}).forEach(key => {
      const section = navigation[key];
      if (section && section.title && section.icon) {
        availableSections.push({ 
          id: key, 
          title: section.title, 
          icon: section.icon 
        });
      }
    });
    
    return availableSections;
  };
  
  const sections = generateSections();

  // Helper function to prepare TOC items without adding numbers
  const prepareTocItems = (items: any[]) => {
    return items.map(item => ({
      ...item,
      level: item.level || 1
    }));
  };

  // Sticky navigation card effect
  useEffect(() => {
    const measureCardPosition = () => {
      if (!navigationCardRef.current) return;
      
      // Only measure when card is in its natural (non-sticky) position
      if (isSticky) return;
      
      const cardRect = navigationCardRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // D: original absolute position from page top (constant)
      const absoluteTop = cardRect.top + scrollTop;
      
      // Get computed style to ensure we capture the actual rendered width
      const actualWidth = navigationCardRef.current.offsetWidth;
      
      // Use parent container's left position for alignment
      const leftPosition = cardRect.left;
      
      if (originalCardTop === null) {
        setOriginalCardTop(absoluteTop); // D: 只设置一次，作为常量
      }
      setCurrentCardTop(absoluteTop); // d1: 当前绝对位置，会因动画而改变
      setCardWidth(actualWidth);
      setCardLeft(leftPosition);
    };

    const handleScroll = () => {
      if (window.innerWidth <= 768 || isMobileFloating) {
        // Disable sticky on mobile or when in floating mode
        if (isSticky) {
          setIsSticky(false);
        }
        return;
      }

      if (!navigationCardRef.current) return;

      // If we don't have the original measurements yet, try to measure them now
      if (originalCardTop === null || cardLeft === null) {
        // Only try to measure if we're not in sticky mode
        if (!isSticky) {
          measureCardPosition();
        }
        return;
      }

      // Throttle scroll events using requestAnimationFrame
      if (!scrollTickingRef.current) {
        requestAnimationFrame(() => {
          const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
          
          // Detect scroll direction
          const scrollingUp = currentScrollPos < prevScrollPos;
          setPrevScrollPos(currentScrollPos);

          // 重新测量当前card的位置（d1），因为动画会改变位置
          if (isSticky && navigationCardRef.current) {
            const rect = navigationCardRef.current.getBoundingClientRect();
            const newCurrentTop = rect.top + currentScrollPos;
            setCurrentCardTop(newCurrentTop);
          }

          // 使用最新的currentCardTop或初始测量值
          const cardTopToUse = currentCardTop || originalCardTop;
          if (!cardTopToUse) return;

          // d2: current distance from viewport top
          const d2 = cardTopToUse - currentScrollPos;
          
          // Required minimum distances
          const minDistanceDown = 20; // 下拉时最小距离
          const minDistanceUp = 80;   // 上拉时最小距离（为navbar预留空间）
          
          const requiredDistance = scrollingUp ? minDistanceUp : minDistanceDown;
          
          // Should be sticky when d2 becomes less than required distance
          const shouldBeSticky = d2 <= requiredDistance;
          
          // Should stop being sticky when scrolled back to original position
          // 检查是否回到了原始位置（D）附近
          const distanceFromOriginal = originalCardTop - currentScrollPos;
          const shouldStopSticky = distanceFromOriginal > requiredDistance;

          if (!isSticky && shouldBeSticky) {
            setIsSticky(true);
          } else if (isSticky && shouldStopSticky) {
            setIsSticky(false);
          }
          
          scrollTickingRef.current = false;
        });
        scrollTickingRef.current = true;
      }
    };

    const handleResize = () => {
      // Reset sticky state and remeasure on resize
      setIsSticky(false);
      setOriginalCardTop(null);
      setCurrentCardTop(null);
      setCardWidth(null);
      setCardLeft(null);
      
      // Remeasure after a short delay to allow layout to stabilize
      setTimeout(measureCardPosition, 100);
    };

    // Initial measurement with better timing
    // Use multiple attempts to ensure we get the correct measurement
    const performInitialMeasurement = () => {
      // Wait for layout to stabilize, then measure multiple times
      setTimeout(() => {
        measureCardPosition();
        // Second measurement to ensure consistency
        setTimeout(measureCardPosition, 50);
        // Third measurement after a longer delay for complex layouts
        setTimeout(measureCardPosition, 200);
      }, 50);
    };

    performInitialMeasurement();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Also listen for DOMContentLoaded and load events to ensure proper measurement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', performInitialMeasurement);
    }
    window.addEventListener('load', performInitialMeasurement);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('DOMContentLoaded', performInitialMeasurement);
      window.removeEventListener('load', performInitialMeasurement);
    };
  }, [isSticky, originalCardTop, currentCardTop, prevScrollPos, navbarVisible]);

  // Function to render nested TOC with visual hierarchy and connection lines
  const renderNestedTOC = (items: any[]): React.ReactElement | null => {
    if (!items || items.length === 0) return null;

    // Group items by level 2 sections while preserving order
    const groupedItems: { key: string; hierarchyId: string; items: any[] }[] = [];
    let currentLevel2: string | null = null;
    let currentLevel2Index = -1;
    
    // Create counters for each level to create consistent hierarchical IDs
    const levelCounters: Record<number, number> = {};

    items.forEach((item, index) => {
      // Initialize counter for this level if not exists
      if (levelCounters[item.level] === undefined) {
        levelCounters[item.level] = 0;
      }
      
      if (item.level === 1) {
        // Level 1 items are always shown independently
        const key = `level1-${index}`;
        const hierarchyId = `L1-${levelCounters[item.level]}`;
        levelCounters[item.level]++;
        
        groupedItems.push({
          key,
          hierarchyId,
          items: [{ ...item, originalIndex: index, hierarchyId }]
        });
      } else if (item.level === 2) {
        // Start a new level 2 group with an incrementing counter
        currentLevel2 = item.id || `item-${index}`;
        const hierarchyId = `L2-${levelCounters[item.level]}`;
        levelCounters[item.level]++;
        
        currentLevel2Index = groupedItems.length;
        groupedItems.push({
          key: currentLevel2!,
          hierarchyId,
          items: [{ ...item, originalIndex: index, hierarchyId }]
        });
        
        // Reset counters for child levels when a new parent is encountered
        Object.keys(levelCounters).forEach(level => {
          if (parseInt(level) > 2) {
            levelCounters[parseInt(level)] = 0;
          }
        });
      } else if (item.level > 2 && currentLevel2 && currentLevel2Index >= 0) {
        // Add to current level 2 group with hierarchical ID
        const currentGroup = groupedItems[currentLevel2Index];
        if (currentGroup) {
          // Extract the L2 base ID (e.g., "L2-0")
          const parentHierarchyId = currentGroup.hierarchyId;
          
          // Create hierarchical ID based on parent and current counters
          const hierarchyId = `${parentHierarchyId}.${item.level}-${levelCounters[item.level]}`;
          levelCounters[item.level]++;
          
          currentGroup.items.push({ ...item, originalIndex: index, hierarchyId });
        }
      }
    });

    // Create an index of headers by their text content
    // This allows us to find all headers with the same text while maintaining hierarchy
    const headerTextIndex: Map<string, { items: any[], hierarchyIds: string[] }> = new Map();
    
    // Build the index from grouped items
    groupedItems.forEach(group => {
      group.items.forEach(item => {
        const normalizedTitle = item.title.toLowerCase().trim();
        if (!headerTextIndex.has(normalizedTitle)) {
          headerTextIndex.set(normalizedTitle, { items: [], hierarchyIds: [] });
        }
        const entry = headerTextIndex.get(normalizedTitle)!;
        entry.items.push(item);
        entry.hierarchyIds.push(item.hierarchyId);
      });
    });

    // Find which level 2 section should be expanded based on activeItemId
    const expandedLevel2HierarchyIds: Set<string> = new Set();
    let activeItemTitle: string | null = null;
    
    if (activeItemId) {
      // More robust approach to find the active item's hierarchical ID
      let activeHierarchyId: string | null = null;
      let activeItem: any = null;
      let activeItemIndex = -1;
      
      // Get the active item details first
      activeItemIndex = items.findIndex(item => item.id === activeItemId);
      activeItem = activeItemIndex >= 0 ? items[activeItemIndex] : null;
      
      // Store the active item's title for matching with same-text headers
      if (activeItem) {
        activeItemTitle = activeItem.title.toLowerCase().trim();
      }
      
      // First try to find the active item's hierarchical ID from the grouped items
      for (const group of groupedItems) {
        const foundItem = group.items.find(item => item.id === activeItemId);
        if (foundItem) {
          activeHierarchyId = foundItem.hierarchyId;
          break;
        }
      }
      
      // Now find ALL sections that should be expanded based on the active item's text content
      if (activeItemTitle && headerTextIndex.has(activeItemTitle)) {
        const sameTextHeaders = headerTextIndex.get(activeItemTitle)!;
        
        // For each header with the same text, determine which L2 section it belongs to
        sameTextHeaders.items.forEach(sameTextItem => {
          const itemHierarchyId = sameTextItem.hierarchyId;
          
          if (itemHierarchyId) {
            if (itemHierarchyId.startsWith('L2-')) {
              // If it's a level 2 header, expand its section
              expandedLevel2HierarchyIds.add(itemHierarchyId);
            } else if (itemHierarchyId.includes('.')) {
              // If it's a child item (level 3+), extract and expand the parent L2 section
              const parentL2Id = itemHierarchyId.split('.')[0];
              expandedLevel2HierarchyIds.add(parentL2Id);
            }
          }
        });
      }
      
      // Also handle the original active item's hierarchy if we found it
      if (activeHierarchyId) {
        if (activeHierarchyId.startsWith('L2-')) {
          // If it's a level 2 header, use its hierarchy ID directly
          expandedLevel2HierarchyIds.add(activeHierarchyId);
        } else if (activeHierarchyId.includes('.')) {
          // If it's a child item (level 3+), extract the parent L2 part
          expandedLevel2HierarchyIds.add(activeHierarchyId.split('.')[0]);
        }
      }
      
      // Legacy fallback logic (keeping for safety)
      if (expandedLevel2HierarchyIds.size === 0 && activeItem) {
        if (activeItem.level === 2) {
          // For level 2 items, find their corresponding group
          const matchingGroup = groupedItems.find(group => 
            group.items.some(item => item.originalIndex === activeItemIndex)
          );
          if (matchingGroup) {
            expandedLevel2HierarchyIds.add(matchingGroup.hierarchyId);
          }
        } else if (activeItem.level > 2) {
          // For level 3+ items, check if they're directly in a group first
          const parentGroup = groupedItems.find(group => 
            group.items.some(item => item.originalIndex === activeItemIndex)
          );
          
          if (parentGroup) {
            expandedLevel2HierarchyIds.add(parentGroup.hierarchyId);
          } else {
            // If not found in a group, search backward for the closest level 2 parent
            for (let i = activeItemIndex - 1; i >= 0; i--) {
              if (items[i].level === 2) {
                // Find the matching group for this level 2 item
                const matchingGroup = groupedItems.find(group => 
                  group.items.some(item => item.originalIndex === i)
                );
                if (matchingGroup) {
                  expandedLevel2HierarchyIds.add(matchingGroup.hierarchyId);
                  break;
                }
              } else if (items[i].level === 1) {
                // Stop if we encounter a level 1 header (different section)
                break;
              }
            }
          }
        }
      }
      
      // Final fallback: Check ALL groups for the active item
      if (expandedLevel2HierarchyIds.size === 0) {
        for (const group of groupedItems) {
          // Skip level 1 groups since they don't need expansion
          if (group.key.startsWith('level1-')) continue;
          
          // Check if this group contains the active item
          if (group.items.some(item => item.id === activeItemId)) {
            expandedLevel2HierarchyIds.add(group.hierarchyId);
            break;
          }
        }
      }
    }

    return (
      <div className={styles.tocNestedContainer}>
        {groupedItems.map(({ key: groupKey, hierarchyId, items: groupItems }) => {
          const isLevel1Group = groupKey.startsWith('level1-');
          
          // Check if this group should be expanded based on hierarchy IDs
          let isExpanded = !isLevel1Group && expandedLevel2HierarchyIds.has(hierarchyId);
          
          // Also check if this group contains the active item as a backup method
          if (!isExpanded && !isLevel1Group && activeItemId) {
            isExpanded = groupItems.some(item => item.id === activeItemId);
          }
          
          if (isLevel1Group) {
            // Render level 1 items independently
            const item = groupItems[0];
            // Only highlight the exact item by ID (not by text content)
            const isActive = activeItemId === item.id;
            
            return (
              <div key={groupKey} className={styles.tocLevel1Container}>
                <button
                  className={`${styles.navItem} ${styles.tocItem} ${styles.tocLevel1} ${isActive ? styles.active : ''}`}
                  onClick={(e) => {
                    if (onItemClick) onItemClick(item.originalIndex);
                    if (isMobileFloating) scrollToCenter(e.currentTarget);
                  }}
                  title={item.title}
                  data-hierarchy-id={item.hierarchyId}
                >
                  <div className={styles.tocItemContent}>
                    <span className={styles.tocTitle}>{item.title}</span>
                  </div>
                </button>
              </div>
            );
          } else {
            // Render level 2 groups with potential expansion
            const level2Item = groupItems.find(item => item.level === 2);
            const childItems = groupItems.filter(item => item.level > 2);
            // Only highlight the exact level 2 item by ID (not by text content)
            const isLevel2Active = activeItemId === level2Item?.id;
            
            return (
              <div key={groupKey} className={`${styles.tocLevel2Container} ${isExpanded ? styles.expanded : ''}`} data-group-id={hierarchyId}>
                {/* Level 2 heading */}
                <button
                  className={`${styles.navItem} ${styles.tocItem} ${styles.tocLevel2} ${isLevel2Active ? styles.active : ''}`}
                  onClick={(e) => {
                    if (level2Item && onItemClick) onItemClick(level2Item.originalIndex);
                    if (isMobileFloating) scrollToCenter(e.currentTarget);
                  }}
                  title={level2Item?.title}
                  data-hierarchy-id={level2Item?.hierarchyId}
                >
                  <div className={styles.tocItemContent}>
                    <span className={styles.tocTitle}>{level2Item?.title}</span>
                  </div>
                </button>
                
                {/* Child items (level 3+) with connection line */}
                {isExpanded && childItems.length > 0 && (
                  <div className={styles.tocChildContainer}>
                    <div className={styles.tocConnectionLine}></div>
                    <div className={styles.tocChildItems}>
                      {childItems.map((childItem) => {
                        // Only highlight the exact child item by ID (not by text content)
                        const isChildActive = activeItemId === childItem.id;
                        return (
                          <button
                            key={childItem.originalIndex}
                            className={`${styles.navItem} ${styles.tocItem} ${styles[`tocLevel${childItem.level}`]} ${isChildActive ? styles.active : ''}`}
                            onClick={(e) => {
                              if (onItemClick) onItemClick(childItem.originalIndex);
                              if (isMobileFloating) scrollToCenter(e.currentTarget);
                            }}
                            title={childItem.title}
                            data-hierarchy-id={childItem.hierarchyId}
                            data-parent-id={hierarchyId}
                          >
                            <div className={styles.tocItemContent}>
                              <span className={styles.tocTitle}>{childItem.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Determine what to show in navigation based on context
  const showItems = items.length > 0 && itemType;

  // Determine if we should show the navigation card at all
  const shouldShowNavigationCard = showItems || (!itemType && sections.length > 0);

  // Prepare TOC items without automatic numbering
  const preparedItems = itemType === 'toc' && items ? prepareTocItems(items) : items;

  if (!shouldShowNavigationCard || !isVisible) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Placeholder to maintain layout when sticky */}
      {isSticky && cardWidth && (
        <div 
          ref={placeholderRef}
          style={{ 
            height: '250px', // Approximate height to maintain layout
            width: `${cardWidth}px`
          }} 
        />
      )}
      
      <div 
        ref={navigationCardRef}
        className={`${styles.navigationCard} ${isSticky ? styles.stickyNavigationCard : ''} ${isMobileFloating ? styles.mobileFloatingCard : ''}`}
        style={isSticky && cardWidth && cardLeft !== null && !isMobileFloating ? {
          position: 'fixed',
          top: (() => {
            // More precise positioning based on navbar visibility
            if (navbarVisible) {
              // Navbar is visible, leave space for it
              return '80px';
            } else {
              // Navbar is hidden, use minimal top space
              return '20px';
            }
          })(),
          left: `${cardLeft}px`,
          width: `${cardWidth}px`,
          zIndex: 1001, // Higher than navbar to avoid conflicts
          boxSizing: 'border-box',
          transition: 'top 0.3s ease' // Smooth transition synchronized with navbar
        } : undefined}
      >
        {showItems ? (
          <>
            <h4>{itemType === 'project' ? 'Projects' : itemType === 'blog' ? 'Blog Posts' : itemType === 'toc' ? 'Catalog' : 'Archive Items'}</h4>
            <nav className={styles.navList}>
              {itemType === 'toc' ? (
                // Enhanced TOC with nested structure and visual hierarchy
                <div className={styles.tocContainer}>
                  {renderNestedTOC(preparedItems || [])}
                </div>
              ) : (
                // Default rendering for other item types
                items?.map((item, index) => (
                  <button
                    key={index}
                    className={`${styles.navItem} ${styles.itemNavItem}`}
                    onClick={(e) => {
                      if (onItemClick) onItemClick(index);
                      if (isMobileFloating) scrollToCenter(e.currentTarget);
                    }}
                    title={item.title}
                  >
                    <span className={styles.navIcon}>
                      {itemType === 'project' ? '💻' : itemType === 'blog' ? '📝' : '📁'}
                    </span>
                    <span className={styles.itemTitle}>{item.title}</span>
                  </button>
                ))
              )}
            </nav>
          </>
        ) : (
          <>
            <h4>Navigation</h4>
            <nav className={styles.navList}>
              {sections.map(section => (
                <button
                  key={section.id}
                  className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                  onClick={(e) => {
                    onSectionChange(section.id);
                    if (isMobileFloating) scrollToCenter(e.currentTarget);
                  }}
                >
                  <span className={styles.navIcon}>{section.icon}</span>
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </>
        )}
      </div>
    </div>
  );
});

NavigationCard.displayName = 'NavigationCard';

export default NavigationCard;
