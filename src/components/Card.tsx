import { useNavigate } from 'react-router-dom';
import styles from '../styles/Card.module.css';
import { formatDateForDisplay } from '../utils/dateFormatter';
import { getCategoryColor, getTagColor } from '../config/config';

interface CardProps {
  title: string;
  date?: string;
  category?: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
  type?: 'project' | 'blog' | 'archive';
  id?: string;
}

export default function Card({ 
  title, 
  date, 
  category, 
  description, 
  image, 
  link, 
  tags = [],
  type = 'project',
  id
}: CardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'project' && id) {
      // Navigate to project detail page
      navigate(`/my-portfolio/projects/${id}`);
    } else if (link) {
      // External link
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  const defaultImage = '/default_cover.jpg';
  
  return (
    <div 
      className={`${styles.card} ${styles[type]} ${(link || (type === 'project' && id)) ? styles.clickable : ''}`}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <img 
          src={image || defaultImage} 
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
            {tags.map((tag, index) => {
              const tagColors = getTagColor(tag);
              return (
                <span 
                  key={index} 
                  className={styles.tag}
                  style={{
                    backgroundColor: tagColors.backgroundColor,
                    color: tagColors.textColor
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
        
        {(link || (type === 'project' && id)) && (
          <div className={styles.cardFooter}>
            <span className={styles.readMore}>
              {type === 'project' ? 'View Details' : 'Read More'} <i className="fas fa-arrow-right"></i>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
