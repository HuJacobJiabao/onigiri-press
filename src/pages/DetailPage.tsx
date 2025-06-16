import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import MarkdownContent from '../components/MarkdownContent';
import { loadStaticProjects, loadStaticBlogPosts, loadMarkdownContent, getFileLastModifiedTime, type Project, type BlogPost } from '../utils/staticDataLoader';
import { parseMarkdown, type ParsedMarkdown } from '../utils/markdown';
import config from '../config/config';
import styles from '../styles/DetailPage.module.css';
import usePageTitle from '../hooks/usePageTitle';

type ContentType = 'project' | 'blog' | 'dailylog';

interface ContentItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string; // Make image optional to match blog posts
  link: string;
  tags: string[];
  contentPath: string; // Add contentPath for markdown loading
}

export default function DetailPage() {
  const { id, date, logType } = useParams<{ id?: string; date?: string; logType?: string }>();
  const location = useLocation();
  const [markdownData, setMarkdownData] = useState<ParsedMarkdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string>('');
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load blog posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await loadStaticBlogPosts();
        setBlogPosts(posts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
      }
    };

    loadPosts();
  }, []);

  // Load projects on component mount
  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        const projectsData = await loadStaticProjects();
        setProjects(projectsData);
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    };

    loadProjectsData();
  }, []);

  // Determine if this is a project, blog, or daily log based on the URL path
  const contentType: ContentType = useMemo(() => {
    if (location.pathname.includes('/projects/')) return 'project';
    if (location.pathname.includes('/devlogs/') && date && logType) return 'dailylog';
    return 'blog';
  }, [location.pathname, date, logType]);
  
  // Find the content item (project, blog post, or create daily log item)
  const contentItem: ContentItem | undefined = useMemo(() => {
    if (contentType === 'project') {
      const found = projects.find(p => p.id === id);
      return found;
    } else if (contentType === 'dailylog') {
      // Create a mock content item for daily logs
      if (date && logType) {
        const title = logType === 'developer-log' ? `Developer Log - ${date}` : `Change Log - ${date}`;
        const mockItem = {
          id: `${date}-${logType}`,
          title,
          date: date, // Keep the original date string from URL params
          category: 'Daily Log',
          description: `Daily ${logType.replace('-', ' ')} for ${date}`,
          link: `/my-portfolio/devlogs/${date}/${logType}`,
          tags: ['Development', 'Daily Log'],
          contentPath: `devlogs/${date}/${logType}.md`
        };
        return mockItem;
      }
      return undefined;
    } else {
      const found = blogPosts.find(b => b.id === id);
      return found;
    }
  }, [contentType, id, date, logType, blogPosts, projects]);

  // Set dynamic page title based on content
  usePageTitle(contentItem?.title || 'Content');

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

  useEffect(() => {
    if (!contentItem) return;

    const loadContent = async () => {
      try {
        setError(null);
        
        console.log('Loading markdown content for:', {
          contentType,
          contentItemId: contentItem.id,
          contentPath: contentItem.contentPath
        });
        
        // Load the markdown content from the file
        let markdownContent: string;
        
        if (contentType === 'dailylog') {
          // For daily logs, load directly from frame-logs directory
          const dailyLogPath = `${import.meta.env.BASE_URL}${contentItem.contentPath}`;
          const response = await fetch(dailyLogPath);
          
          if (!response.ok) {
            throw new Error(`Daily log not found: ${dailyLogPath}`);
          }
          
          markdownContent = await response.text();
        } else {
          // For regular content, use the existing loading method
          markdownContent = await loadMarkdownContent(contentItem.contentPath);
          
          if (!markdownContent) {
            throw new Error('Markdown content not found');
          }
        }
        
        // Parse the markdown content at runtime
        const parsedMarkdown = await parseMarkdown(markdownContent, true);
        
        // Get the file's last modification time
        const lastModified = await getFileLastModifiedTime(contentItem.contentPath);
        
        setMarkdownData(parsedMarkdown);
        setLastUpdateTime(lastModified);
        
      } catch (err) {
        console.error('Error loading markdown content:', err);
        setError('Failed to load content');
      }
    };

    loadContent();
  }, [contentItem, contentType]);

  // If content not found, redirect to appropriate page
  if (!contentItem && blogPosts.length > 0 && projects.length > 0) {
    let redirectPath: string;
    if (contentType === 'project') {
      redirectPath = '/my-portfolio/projects/';
    } else if (contentType === 'dailylog') {
      redirectPath = '/my-portfolio/devlogs/';
    } else {
      redirectPath = '/my-portfolio/blogs/';
    }
    console.log('Content item not found, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

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

  // Ensure contentItem and markdownData are available before rendering
  if (!contentItem || !markdownData) {
    console.log('DetailPage: Not rendering due to missing data', {
      hasContentItem: !!contentItem,
      hasMarkdownData: !!markdownData,
      contentType,
      date,
      logType,
      blogPostsLength: blogPosts.length,
      projectsLength: projects.length
    });
    return null; // Return null instead of loading UI
  }

  // Determine the appropriate header background
  const getHeaderBackground = () => {
    // Get default backgrounds from config
    const defaultBlogBackground = config.content?.blogs?.defaultHeaderBackground || '/background/default_blog.png';
    const defaultProjectBackground = config.content?.projects?.defaultHeaderBackground || '/background/default_proj.jpg';
    
    // For daily logs, use the blog background
    if (contentType === 'dailylog') {
      return defaultBlogBackground;
    }
    
    // If contentItem.image is empty/undefined or contains default_cover, use content-type-specific background
    if (!contentItem.image || contentItem.image.includes('default_cover')) {
      return contentType === 'project' ? defaultProjectBackground : defaultBlogBackground;
    }
    
    // Otherwise use the contentItem.image as is
    return contentItem.image;
  };

  // Only render Layout when all data is ready
  return (
    <Layout
      title={contentItem.title}
      headerBackground={getHeaderBackground()}
      sidebarItems={sidebarItems}
      sidebarItemType="toc"
      onSidebarItemClick={handleSidebarItemClick}
      activeItemId={activeItemId}
      contentItemDate={contentType === 'dailylog' ? contentItem.date : new Date(contentItem.date).toLocaleDateString()}
      contentItemTags={contentItem.tags}
      contentType={contentType}
      contentItemCategory={contentItem.category}
      contentItemLastUpdate={lastUpdateTime || undefined}
    >
      <div className={styles.detailPage}>
        <div className={styles.content}>
          <MarkdownContent
            markdownData={markdownData}
          />
        </div>
      </div>
    </Layout>
  );
}
