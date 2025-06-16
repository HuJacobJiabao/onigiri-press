import { useNavigate } from 'react-router-dom';
import styles from '../styles/TimelineItem.module.css';
import { formatDateForDisplay } from '../utils/dateFormatter';
import { getCategoryColor } from '../config/config';

interface TimelineItemProps {
  title: string;
  date: string;
  image: string | undefined; // Make image optional to match blog posts
  type: 'project' | 'blog';
  link?: string;
  category?: string;
  id?: string; // Add id for project navigation
}

export default function TimelineItem({ 
  title, 
  date, 
  image, 
  type,
  link,
  category,
  id
}: TimelineItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'project' && id) {
      // Navigate to project detail page
      navigate(`/my-portfolio/projects/${id}`);
    } else if (type === 'blog' && id) {
      // Navigate to blog detail page
      navigate(`/my-portfolio/blogs/${id}`);
    } else if (link) {
      // External link
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div className={styles.timelineItem} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img 
          src={image || `${import.meta.env.BASE_URL}default_cover.jpg`} 
          alt={title} 
          className={styles.itemImage}
        />
      </div>
      
      <div className={styles.itemInfo}>
        <div className={styles.itemHeader}>
          <h3 className={styles.itemTitle}>{title}</h3>
            <span className={`${styles.typeIndicator} ${styles[type]}`}>
            {type === 'project' ? 'Proj' : type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        </div>
        <div className={styles.itemMeta}>
          <span className={styles.itemDate}>
            <i className="fas fa-calendar"></i>
            {formatDateForDisplay(date)}
          </span>
          {category && (
            <span 
              className={styles.itemCategory}
              style={{ color: getCategoryColor(category) }}
            >
              <i className="fas fa-tag"></i>
              {category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
