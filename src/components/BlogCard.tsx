import { useNavigate } from 'react-router-dom';
import styles from '../styles/BlogCard.module.css';
import { formatDateForDisplay } from '../utils/dateFormatter';
import { getCategoryColor, getTagColor } from '../config/config';

interface BlogCardProps {
  title: string;
  date?: string;
  category?: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
}

export default function BlogCard({ 
  title, 
  date, 
  category, 
  description, 
  image, 
  link, 
  tags = []
}: BlogCardProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('BlogCard clicked:', { title, link });
    
    if (link) {
      // Extract the ID from the link
      const linkParts = link.split('/');
      const id = linkParts[linkParts.length - 1];
      console.log('Navigating to blog post:', id);
      
      // Use navigate to go to the blog detail page
      const targetPath = `/my-portfolio/blogs/${id}`;
      navigate(targetPath);
    } else {
      console.log('No link provided for blog card');
    }
  };

  return (
    <div 
      className={`${styles.blogCard} ${link ? styles.clickable : ''}`}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <img 
          src={image || `${import.meta.env.BASE_URL}default_cover.jpg`} 
          alt={title} 
          className={styles.cardImage}
        />
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <div className={styles.cardMeta}>
            {date && (
              <span className={styles.cardDate}>
                <i className="fas fa-calendar"></i>
                {formatDateForDisplay(date)}
              </span>
            )}
            {category && (
              <span 
                className={styles.cardCategory}
                style={{ color: getCategoryColor(category) }}
              >
                <i className="fas fa-tag"></i>
                {category}
              </span>
            )}
          </div>
        </div>
        
        <p className={styles.cardDescription}>{description}</p>
        
        {tags.length > 0 && (
          <div className={styles.cardTags}>
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className={styles.tag}
                style={{
                  backgroundColor: getTagColor(tag).backgroundColor,
                  color: getTagColor(tag).textColor
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
