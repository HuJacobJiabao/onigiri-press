import { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '../components/Layout';
import MarkdownContent from '../components/MarkdownContent';
import { parseMarkdown, fetchMarkdownContent, type ParsedMarkdown } from '../utils/markdown';
import styles from '../styles/DetailPage.module.css';
import config from '../config/config';
import usePageTitle from '../hooks/usePageTitle';

export default function DeveloperLog() {
  // Set page title
  usePageTitle('Developer Logs');

  const [markdownData, setMarkdownData] = useState<ParsedMarkdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string>('');
  const [title, setTitle] = useState<string>('Developer Logs');

  // Create sidebar items from table of contents (memoized)
  const sidebarItems = useMemo(() => {
    return markdownData?.toc.map(item => ({
      title: item.title,
      id: item.id,
      level: item.level
    })) || [];
  }, [markdownData?.toc]);

  // Memoized callback for sidebar item clicks
  const handleSidebarItemClick = useCallback((index: number) => {
    const item = sidebarItems[index];
    if (item?.id) {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [sidebarItems]);

  // Function to check which section is currently in view
  const updateActiveSection = useCallback(() => {
    if (!markdownData?.toc.length) return;

    const sections = markdownData.toc.map(item => item.id).filter(Boolean);
    const offset = 100; // Offset from top to account for header

    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i]);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= offset) {
          setActiveItemId(sections[i]);
          return;
        }
      }
    }

    // If no section is in view, set to first section
    if (sections.length > 0) {
      setActiveItemId(sections[0]);
    }
  }, [markdownData?.toc]);

  // Set up scroll listener for active section tracking with throttling
  useEffect(() => {
    if (!markdownData?.toc.length) return;

    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateActiveSection, markdownData?.toc]);

  // Load the markdown content on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        setError(null);
        
        // Load the markdown content from the file
        const markdownPath = `${import.meta.env.BASE_URL}DEVELOPER_LOG.md`;
        const markdownContent = await fetchMarkdownContent(markdownPath);
        
        if (!markdownContent) {
          throw new Error('Markdown content not found');
        }
        
        // Parse the markdown content - don't remove main title as we need it for the page title
        const parsedMarkdown = await parseMarkdown(markdownContent, false);
        
        // Extract the title from the first h1 in the TOC
        if (parsedMarkdown.toc.length > 0 && parsedMarkdown.toc[0].level === 1) {
          setTitle(parsedMarkdown.toc[0].title);
        }
        
        setMarkdownData(parsedMarkdown);
        
      } catch (err) {
        console.error('Error loading markdown content:', err);
        setError('Failed to load content');
      }
    };

    loadContent();
  }, []);

  // Show error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Error Loading Content</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Determine the appropriate header background
  const getHeaderBackground = () => {
    return config.content?.logs?.defaultHeaderBackground || '/background/default_blog.png';
  };

  // Only render Layout when all data is ready
  return (
    <Layout
      title={title}
      headerBackground={getHeaderBackground()}
      sidebarItems={sidebarItems}
      sidebarItemType="toc"
      onSidebarItemClick={handleSidebarItemClick}
      activeItemId={activeItemId}
    >
      <div className={styles.detailPage}>
        <div className={styles.content}>
          {markdownData ? (
            <MarkdownContent
              markdownData={markdownData}
            />
          ) : (
            <div className={styles.loading}>
              <p>Loading content...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
