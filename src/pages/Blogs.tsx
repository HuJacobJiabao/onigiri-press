import { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import styles from '../styles/Blog.module.css';
import { loadStaticBlogPosts, type BlogPost } from '../utils/staticDataLoader';
import config from '../config/config';
import usePageTitle from '../hooks/usePageTitle';

export default function Blog() {
  // Set page title
  usePageTitle('Blogs');

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load blog posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await loadStaticBlogPosts();
        setBlogPosts(posts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts');
      }
    };

    loadPosts();
  }, []);

  const handleSidebarItemClick = (index: number) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const sidebarItems = blogPosts.map(post => ({ title: post.title }));

  if (error) {
    return (
      <Layout 
        title="Blog"
        headerBackground={config.content?.blogs?.defaultHeaderBackground || '/background/default_blog.png'}
        sidebarItems={[]}
        sidebarItemType="blog"
        onSidebarItemClick={() => {}}
      >
        <div className={styles.blogContainer}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>❌</div>
            <h2>Error Loading Blog Posts</h2>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Blogs"
      headerBackground={config.content?.blogs?.defaultHeaderBackground || '/background/default_blog.png'}
      sidebarItems={sidebarItems}
      sidebarItemType="blog"
      onSidebarItemClick={handleSidebarItemClick}
    >
      <div className={styles.blogContainer}>
        {blogPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h2>No Blog Posts Yet</h2>
            <p>Blog posts will be displayed here once they are published.</p>
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {blogPosts.map((post, index) => (
              <div 
                key={post.id}
                ref={el => { cardRefs.current[index] = el; }}
                className={styles.blogCardWrapper}
              >
                <BlogCard
                  title={post.title}
                  date={post.date}
                  category={post.category}
                  description={post.description}
                  image={post.image}
                  link={post.link}
                  tags={post.tags}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
