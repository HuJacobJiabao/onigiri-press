import React from 'react';

interface TagIconProps {
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function TagIcon({ icon, className = '', style = {} }: TagIconProps) {
  if (!icon) return null;

  // Check if icon is an SVG string (starts with <svg)
  if (icon.trim().startsWith('<svg')) {
    return (
      <span
        className={`tag-icon ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  }

  // Check if icon is a URL/path to an SVG file
  if (icon.includes('.svg') || icon.startsWith('http')) {
    return (
      <img
        src={icon}
        alt=""
        className={`tag-icon ${className}`}
        style={{ width: '16px', height: '16px', marginRight: '4px', ...style }}
      />
    );
  }

  // If icon doesn't match expected formats, treat as FontAwesome class
  return <i className={`${icon} ${className}`} style={style} />;
}
