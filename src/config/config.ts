import { getAssetPath } from '../utils/staticDataLoader';
import configData from '../../config.yaml';

// Utility function for building URLs with baseUrl
function buildUrl(path: string): string {
  if (!path) return '';
  
  // Use the shared getAssetPath utility from staticDataLoader
  return getAssetPath(path);
}

// Removed buildImagePath - using buildUrl for all paths

// Process configuration to convert all relative URLs to absolute URLs
function processConfig(rawConfig: any): Config {
  const processed = { ...rawConfig };
  
  // Process backgrounds
  if (processed.backgrounds) {
    processed.backgrounds = {
      global: buildUrl(processed.backgrounds.global || 'background/about.jpg'),
      hero: buildUrl(processed.backgrounds.hero || 'background/hero.jpg')
    };
  }
  
  // Process content default header backgrounds
  if (processed.content) {
    if (processed.content.blogs?.defaultHeaderBackground) {
      processed.content.blogs.defaultHeaderBackground = buildUrl(processed.content.blogs.defaultHeaderBackground);
    }
    if (processed.content.projects?.defaultHeaderBackground) {
      processed.content.projects.defaultHeaderBackground = buildUrl(processed.content.projects.defaultHeaderBackground);
    }
    if (processed.content.archive?.defaultHeaderBackground) {
      processed.content.archive.defaultHeaderBackground = buildUrl(processed.content.archive.defaultHeaderBackground);
    }
    if (processed.content.logs?.defaultHeaderBackground) {
      processed.content.logs.defaultHeaderBackground = buildUrl(processed.content.logs.defaultHeaderBackground);
    }
  }

  // Process footer background
  if (processed.footer?.background) {
    processed.footer.background = buildUrl(processed.footer.background);
  }
  
  // Process home navigation photos and image sources
  if (processed.home?.navigation) {
    Object.keys(processed.home.navigation).forEach(key => {
      const section = processed.home.navigation[key];
      
      // Process photo in about section
      if (section.photo) {
        section.photo = buildUrl(section.photo);
      }
       // Process items with logo, border, tag, coverImage
      if (section.items) {
        section.items.forEach((item: any) => {
          // Process logo.src
          if (item.logo && item.logo.src) {
            item.logo.src = buildUrl(item.logo.src);
          }
          
          // Handle coverImage for projects
          if (item.coverImage) {
            item.coverImage = buildUrl(item.coverImage);
          }
          
        });
      }
      
      // Process defaultCover for projects
      if (section.defaultCover) {
        section.defaultCover = buildUrl(section.defaultCover);
      }
    });
  }
  
  // Process profileCard avatar
  if (processed.home?.profileCard?.avatar) {
    processed.home.profileCard.avatar = buildUrl(processed.home.profileCard.avatar);
  }

  if (processed.website?.favicon) {
    processed.website.favicon = buildUrl(processed.website.favicon);
  }

  // Process resume filename to build full URL
  if (processed.resume?.filename) {
    processed.resume.filename = buildUrl(processed.resume.filename);
  }
  
  return processed;
}

// Define types for audio player configuration
export interface AudioPlayerConfig {
  enabled: boolean;
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  theme: string;
  autoplay: boolean;
  volume: number;
  mini: boolean;
  showLrc: boolean;
  fixed: boolean;
  meting?: {
    enabled: boolean;
    server: 'netease' | 'tencent' | 'kugou' | 'xiami' | 'baidu';
    type: 'song' | 'playlist' | 'album' | 'search' | 'artist';
    id: string | number;
    mutex?: boolean;
    listFolded?: boolean;
    listMaxHeight?: string;
    order?: string;
    loop?: string;
    preload?: string;
  };
  audio: Array<{
    name: string;
    artist: string;
    url: string;
    cover: string;
    lrc?: string;
  }>;
}

// Define website metadata configuration
export interface WebsiteConfig {
  title: string;
  titleSeparator?: string;
  favicon?: string;
  description?: string;
}

// Define background configuration
export interface BackgroundConfig {
  global: string;
  hero: string;
}

// Define footer configuration
export interface FooterConfig {
  copyright?: string;
  message?: string;
  background?: string;
}

// Define resume configuration
export interface ResumeConfig {
  filename: string;
}

// Define contact color configuration
export interface ContactConfig {
  textColor?: string;
}

// Define content configuration interfaces
export interface CategoryColor {
  textColor: string;
}

export interface TagColor {
  backgroundColor: string;
  textColor: string;
  icon?: string; // SVG icon as string or path to SVG file
}

export interface ContentConfig {
  blogs?: {
    defaultCover?: string;
    defaultHeaderBackground?: string;
  };
  projects?: {
    defaultCover?: string;
    defaultHeaderBackground?: string;
  };
  archive?: {
    defaultCover?: string;
    defaultHeaderBackground?: string;
  };
  logs?: {
    defaultHeaderBackground?: string;
  };
  categoryColors?: {
    [key: string]: CategoryColor;
  };
  tagColors?: {
    [key: string]: TagColor;
  };
}

// Define config interface
export interface Config {
  website?: WebsiteConfig;
  backgrounds?: BackgroundConfig;
  footer?: FooterConfig;
  resume?: ResumeConfig;
  audioPlayer?: AudioPlayerConfig;
  content?: ContentConfig;
  [key: string]: any; // Allow other config properties
}

// The YAML file is imported, parsed, and processed to convert relative URLs to absolute URLs
export const config: Config = processConfig(configData);

// Helper functions to get category and tag colors
export function getCategoryColor(category: string): string {
  const categoryColors = config.content?.categoryColors;
  if (!categoryColors) return '#6b7280'; // Default gray
  
  // First try to find exact match
  const categoryColor = categoryColors[category];
  if (categoryColor) {
    return categoryColor.textColor;
  }
  
  // Fall back to default
  const defaultColor = categoryColors['default'];
  return defaultColor ? defaultColor.textColor : '#6b7280';
}

export function getTagColor(tag: string): { backgroundColor: string; textColor: string; icon?: string } {
  const tagColors = config.content?.tagColors;
  const defaultColors = { backgroundColor: '#f3f4f6', textColor: '#374151' };
  
  if (!tagColors) return defaultColors;
  
  // First try to find exact match
  const tagColor = tagColors[tag];
  if (tagColor) {
    return {
      backgroundColor: tagColor.backgroundColor,
      textColor: tagColor.textColor,
      icon: tagColor.icon
    };
  }
  
  // Fall back to default
  const defaultColor = tagColors['default'];
  return defaultColor ? {
    backgroundColor: defaultColor.backgroundColor,
    textColor: defaultColor.textColor,
    icon: defaultColor.icon
  } : defaultColors;
}

export default config;
