import React from 'react';
import { getTagColor } from '../config/config';
import styles from '../styles/Tag.module.css';

interface TagProps {
  tag: string;
  className?: string;
  style?: React.CSSProperties;
  iconOnly?: boolean;
}

/**
 * Universal Tag component for use across the application
 * Supports both image icons and SVG strings for icons
 */
export default function Tag({ tag, className = '', style = {}, iconOnly = false }: TagProps) {
  const tagStyle = getTagColor(tag);
  
  // Check if icon is an image URL
  const isImageIcon = tagStyle.icon && (
    tagStyle.icon.endsWith('.png') || 
    tagStyle.icon.endsWith('.jpg') || 
    tagStyle.icon.endsWith('.jpeg') || 
    tagStyle.icon.endsWith('.gif') ||
    tagStyle.icon.endsWith('.webp') ||
    tagStyle.icon.startsWith('http')
  );
  
  // Check if icon is an SVG string
  const isSvgIcon = tagStyle.icon && tagStyle.icon.trim().startsWith('<svg');
  
  // Check if icon is a Font Awesome class
  const isFontAwesomeIcon = tagStyle.icon && tagStyle.icon.includes('fa-');

  return (
    <span 
      className={`${styles.tag} ${className}`}
      style={{
        backgroundColor: tagStyle.backgroundColor,
        color: tagStyle.textColor,
        ...style
      }}
    >
      {isImageIcon && (
        <img 
          src={tagStyle.icon} 
          alt=""
          className={styles.tagIcon}
        />
      )}
      
      {isSvgIcon && (
        <span 
          className={styles.svgIcon} 
          dangerouslySetInnerHTML={{ __html: tagStyle.icon as string }} 
        />
      )}
      
      {isFontAwesomeIcon && (
        <i className={`${tagStyle.icon} ${styles.faIcon}`}></i>
      )}
      
      {!iconOnly && tag}
    </span>
  );
}
