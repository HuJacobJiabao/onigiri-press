import styles from '../styles/EducationCard.module.css';

interface EducationCardProps {
  schoolName: string;
  degree: string;
  duration: string;
  location: string;
  logoSrc: string;
  logoAlt: string;
  highlights: string[];
  borderColor?: string;
  borderHoverColor?: string;
  logoBackgroundColor?: string;
  highlightColor?: string; // For li::before color
}

const EducationCard = ({
  schoolName,
  degree,
  duration,
  location,
  logoSrc,
  logoAlt,
  highlights,
  borderColor,
  borderHoverColor,
  logoBackgroundColor,
  highlightColor,
}: EducationCardProps) => {
  // Create CSS custom properties for border and hover effects
  const cssVariables: React.CSSProperties = {
    ...(borderColor && { '--border-color': borderColor } as React.CSSProperties),
    ...(borderHoverColor && { '--border-hover-color': borderHoverColor } as React.CSSProperties),
    ...(logoBackgroundColor && { '--logo-background-color': logoBackgroundColor } as React.CSSProperties),
    ...(highlightColor && { '--highlight-color': highlightColor } as React.CSSProperties),
  };

  const logoStyle: React.CSSProperties = {
    ...(logoBackgroundColor && { backgroundColor: logoBackgroundColor }),
  };

  return (
    <div 
      className={styles.educationCard} 
      style={cssVariables}
    >
      <div className={styles.schoolLogo}>
        <img 
          src={logoSrc} 
          alt={logoAlt} 
          className={styles.logoImage}
          style={logoStyle}
        />
      </div>
      <div className={styles.educationContent}>
        <div className={styles.schoolInfo}>
          <h3 className={styles.schoolName}>{schoolName}</h3>
          <p className={styles.degree}>{degree}</p>
          <p className={styles.duration}>{duration}</p>
          <p className={styles.location}>{location}</p>
        </div>
        <div className={styles.educationDetails}>
          <ul className={styles.highlights}>
            {highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EducationCard;
