import { useRef, useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import TimelineItem from '../components/TimelineItem';
import Pagination from '../components/Pagination';
import styles from '../styles/Archive.module.css';
import config from '../config/config';
import usePageTitle from '../hooks/usePageTitle';

// Import data from static loader
import { loadStaticBlogPosts, loadStaticProjects, type BlogPost, type Project } from '../utils/staticDataLoader';

// Combined archive item interface
interface ArchiveItem {
  title: string;
  date: string;
  image: string | undefined; // Make image optional to match blog posts
  type: 'project' | 'blog';
  link?: string;
  category?: string;
  year: number;
  id?: string; // Add id for projects
}

// Items per page
const ITEMS_PER_PAGE = 12;

export default function Archive() {
  // Set page title
  usePageTitle('Archive');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load blog posts and projects on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [blogData, projectData] = await Promise.all([
          loadStaticBlogPosts(),
          loadStaticProjects()
        ]);
        setBlogPosts(blogData);
        setProjects(projectData);
        console.log('Archive data loaded:', { blogs: blogData.length, projects: projectData.length });
      } catch (err) {
        console.error('Error loading archive data:', err);
      }
    };

    loadData();
  }, []);

  // Combine and sort all items by date (newest first)
  const allArchiveItems = useMemo<ArchiveItem[]>(() => {
    const combined: ArchiveItem[] = [
      // Add blog posts
      ...blogPosts.map(post => ({
        title: post.title,
        date: post.date,
        image: post.image,
        type: 'blog' as const,
        link: post.link,
        category: post.category,
        year: new Date(post.date).getFullYear(),
        id: post.id // Include id for navigation
      })),
      // Add projects
      ...projects.map(project => ({
        title: project.title,
        date: project.date,
        image: project.image,
        type: 'project' as const,
        link: project.link,
        category: project.category,
        year: new Date(project.date).getFullYear(),
        id: project.id // Include id for navigation
      }))
    ];

    // Sort by date (newest first)
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [blogPosts, projects]);

  // Calculate pagination
  const totalPages = Math.ceil(allArchiveItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = allArchiveItems.slice(startIndex, endIndex);

  // Group items by year for sidebar and timeline
  const currentItemsByYear = useMemo(() => {
    const grouped: { [year: number]: ArchiveItem[] } = {};
    currentItems.forEach(item => {
      if (!grouped[item.year]) {
        grouped[item.year] = [];
      }
      grouped[item.year].push(item);
    });
    return grouped;
  }, [currentItems]);

  // Create year-based sidebar items
  const yearRefs = useRef<{ [year: number]: HTMLDivElement | null }>({});
  const sidebarYears = Object.keys(currentItemsByYear)
    .map(Number)
    .sort((a, b) => b - a)
    .map(year => ({ 
      title: `${year} (${currentItemsByYear[year].length})`,
      year: year 
    }));

  const handleSidebarItemClick = (index: number) => {
    const year = sidebarYears[index].year;
    if (yearRefs.current[year]) {
      yearRefs.current[year]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarItems = sidebarYears.map(yearItem => ({ title: yearItem.title }));

  return (
    <Layout 
      title="Archive"
      headerBackground={config.content?.archive?.defaultHeaderBackground || '/background/default_blog.png'}
      sidebarItems={sidebarItems}
      sidebarItemType="archive"
      onSidebarItemClick={handleSidebarItemClick}
    >
      <div className={styles.archiveContainer}>

        <div className={styles.timelineWrapper}>
          <div className={styles.archiveHeader}>
            <h1 className={styles.archiveTitle}>
              <span className={styles.emojiIcon}>📚</span>
              Articles - {allArchiveItems.length}
            </h1>
          </div>
          <div className={styles.timeline}>
            {Object.keys(currentItemsByYear)
              .map(Number)
              .sort((a, b) => b - a)
              .map(year => (
                <div 
                  key={year} 
                  className={styles.yearSection}
                  ref={el => { yearRefs.current[year] = el; }}
                >
                  <div className={styles.yearHeader}>
                    <div className={styles.yearLine}></div>
                    <div className={styles.yearBadge}>
                      <span className={styles.yearText}>{year}</span>
                    </div>
                    <div className={styles.yearLine}></div>
                  </div>
                  
                  <div className={styles.timelineList}>
                    {currentItemsByYear[year].map((item, index) => (
                      <div 
                        key={`${item.type}-${index}`}
                        className={styles.timelineItemWrapper}
                      >
                        <div className={styles.timelineItemContent}>
                          <TimelineItem
                            title={item.title}
                            date={item.date}
                            image={item.image}
                            type={item.type}
                            link={item.type === 'blog' && !item.id ? item.link : undefined}
                            id={item.id}
                            category={item.category}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}
