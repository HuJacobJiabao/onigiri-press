import React from 'react';
import styles from '../styles/ProjectCard.module.css';

interface ProjectCardProps {
  // Basic project information
  projectName: string;
  description: string;
  technologies: string[];
  duration: string;
  highlights: React.ReactNode[];
  imageSrc: string; // Will be used in component (compatibility with coverImage)
  imageAlt: string;
  
  // URLs and related styling
  projectUrl?: string;
  projectLinkTextColor?: string;
  // projectLinkBackgroundColor is removed as it's always transparent
  
  githubUrl?: string;
  githubLinkBackgroundColor?: string;
  githubLinkTextColor?: string;
  
  // Card styling
  borderColor?: string;
  borderHoverColor?: string;
  
  // Tag styling for technologies
  tagBackgroundColor?: string;
  tagTextColor?: string;
  
  // Highlight bullet points
  highlightColor?: string; // For li::before color
}

const ProjectCard = ({
  projectName,
  description,
  technologies,
  duration,
  projectUrl,
  githubUrl,
  imageSrc,
  imageAlt,
  highlights,
  borderColor,
  borderHoverColor,
  tagBackgroundColor,
  tagTextColor,
  highlightColor,
  projectLinkTextColor,
  githubLinkBackgroundColor,
  githubLinkTextColor,
}: ProjectCardProps) => {
  // Create style object with CSS variables for dynamic colors
  const cardStyle = {
    '--border-color': borderColor || '#9b59b6',
    '--border-hover-color': borderHoverColor || '#7d3c98',
    '--tag-background-color': tagBackgroundColor || 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    '--tag-text-color': tagTextColor || 'white',
    '--highlight-color': highlightColor || '#9b59b6',
    '--project-link-text-color': projectLinkTextColor || '#9b59b6',
    '--github-link-background-color': githubLinkBackgroundColor || 'rgba(155, 89, 182, 0.1)',
    '--github-link-text-color': githubLinkTextColor || '#9b59b6',
  } as React.CSSProperties;

  return (
    <div className={styles.projectCard} style={cardStyle}>
      <div className={styles.projectImageSection}>
        <div className={styles.projectImage}>
          <img src={imageSrc} alt={imageAlt} className={styles.image} />
        </div>
        {(projectUrl || githubUrl) && (
          <div className={styles.projectActions}>
            {projectUrl && (
              <a href={projectUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                <span className={styles.linkText}>Click to view →</span>
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
                <i className="fab fa-github" style={{ marginRight: '0.5em', fontSize: '1.1em' }}></i>
                <span className={styles.linkText}>View on GitHub</span>
              </a>
            )}
          </div>
        )}
      </div>
      <div className={styles.projectContent}>
        <div className={styles.projectInfo}>
          <h3 className={styles.projectName}>{projectName}</h3>
          <p className={styles.description}>{description}</p>
          <p className={styles.duration}>{duration}</p>
          <div className={styles.technologies}>
            {technologies.map((tech, index) => (
              <span key={index} className={styles.techTag}>{tech}</span>
            ))}
          </div>
        </div>
        <div className={styles.projectDetails}>
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

export default ProjectCard;
