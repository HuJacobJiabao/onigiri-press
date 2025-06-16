import styles from '../styles/WorkCard.module.css';

interface Position {
  title: string;
  duration: string;
  highlights: string[];
}

interface WorkCardProps {
  companyName: string;
  positions: Position[]; // Changed from single position to array of positions
  location: string;
  logoSrc?: string;
  logoAlt?: string;
  borderColor?: string;
  borderHoverColor?: string;
  logoBackgroundColor?: string;
  highlightColor?: string; // For li::before color
}

const WorkCard = ({
  companyName,
  positions,
  location,
  logoSrc,
  logoAlt,
  borderColor,
  borderHoverColor,
  logoBackgroundColor,
  highlightColor,
}: WorkCardProps) => {
  // Create style object with CSS variables for dynamic colors
  const cardStyle = {
    '--border-color': borderColor || '#e74c3c',
    '--border-hover-color': borderHoverColor || '#c0392b',
    '--logo-background-color': logoBackgroundColor || 'transparent',
    '--highlight-color': highlightColor || '#e74c3c',
  } as React.CSSProperties;

  return (
    <div className={styles.workCard} style={cardStyle}>
      {logoSrc && (
        <div className={styles.companyLogo}>
          <img src={logoSrc} alt={logoAlt} className={styles.logoImage} />
        </div>
      )}
      <div className={styles.workContent}>
        <h3 className={styles.companyName}>{companyName}</h3>
        <p className={styles.location}>{location}</p>
        
        {positions.map((position, index) => (
          <div key={index} className={styles.positionGroup}>
            <div className={styles.positionHeader}>
              <p className={styles.position}>{position.title}</p>
              <p className={styles.workDuration}>{position.duration}</p>
            </div>
            <ul className={styles.workHighlights}>
              {position.highlights.map((highlight, highlightIndex) => (
                <li key={highlightIndex}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkCard;
