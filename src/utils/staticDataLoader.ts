/**
 * Static data loading utilities for preprocessed content
 * This replaces dynamic loading with fast static JSON data
 */

// Import types from the generated static data
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  link: string;
  tags: string[];
  contentPath: string; // Path to markdown file relative to content/
}

export interface Project {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  link: string;
  tags: string[];
  contentPath: string; // Path to markdown file relative to content/
  assetPaths: string[]; // Paths to assets relative to content/
}

/**
 * Ensures the BASE_URL has a trailing slash
 */
function getFormattedBaseUrl(): string {
  return import.meta.env.BASE_URL.endsWith('/') 
    ? import.meta.env.BASE_URL 
    : `${import.meta.env.BASE_URL}/`;
}

/**
 * Builds a properly formatted asset path by adding the base URL if needed
 * @param path - The asset path (either relative or absolute)
 * @returns Properly formatted asset path with base URL
 */
export function getAssetPath(path: string): string {
  if (!path) return '';
  
  // If it's already a complete URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // For local paths, prepend the base URL, but make sure to avoid double slashes
  const baseUrl = getFormattedBaseUrl();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Load preprocessed blog posts from static JSON
 */
export async function loadStaticBlogPosts(): Promise<BlogPost[]> {
  try {
    const baseUrl = getFormattedBaseUrl();
    const response = await fetch(`${baseUrl}data/blogs.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load blogs: ${response.statusText}`);
    }
    const blogs: BlogPost[] = await response.json();
    return blogs;
  } catch (error) {
    console.error('Error loading static blog posts:', error);
    return [];
  }
}

/**
 * Load preprocessed projects from static JSON
 */
export async function loadStaticProjects(): Promise<Project[]> {
  try {
    const baseUrl = getFormattedBaseUrl();
    const response = await fetch(`${baseUrl}data/projects.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load projects: ${response.statusText}`);
    }
    const projects: Project[] = await response.json();
    return projects;
  } catch (error) {
    console.error('Error loading static projects:', error);
    return [];
  }
}

/**
 * Load markdown content for a specific blog or project
 * @param contentPath - Full path including baseUrl (from static data)
 */
export async function loadMarkdownContent(contentPath: string): Promise<string> {
  try {
    // Use the contentPath directly as it now includes the baseUrl
    const response = await fetch(contentPath);
    
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error loading markdown content from ${contentPath}:`, error);
    return '';
  }
}

/**
 * Get asset URL for a given asset path
 * @param assetPath - Path relative to content/ folder or already including baseUrl
 */
export function getAssetUrl(assetPath: string): string {
  // If it's already a complete URL or already has baseUrl, return as is
  if (assetPath.startsWith('http') || assetPath.startsWith(import.meta.env.BASE_URL)) {
    return assetPath;
  }
  
  // Remove leading './' if present
  const cleanPath = assetPath.startsWith('./') ? assetPath.slice(2) : assetPath;
  // Add baseUrl and content/ prefix if needed
  const baseUrl = getFormattedBaseUrl();
  return `${baseUrl}content/${cleanPath}`;
}

/**
 * Find a blog post by ID
 */
export async function findBlogPostById(id: string): Promise<BlogPost | null> {
  const blogs = await loadStaticBlogPosts();
  return blogs.find(blog => blog.id === id) || null;
}

/**
 * Find a project by ID
 */
export async function findProjectById(id: string): Promise<Project | null> {
  const projects = await loadStaticProjects();
  return projects.find(project => project.id === id) || null;
}

/**
 * Get the last modification time of a content file
 * @param contentPath - Full path including baseUrl
 */
export async function getFileLastModifiedTime(contentPath: string): Promise<string> {
  try {
    // Extract the relative path from the full URL
    const baseUrl = getFormattedBaseUrl();
    let relativePath = contentPath;
    
    // Remove baseUrl prefix if present
    if (relativePath.startsWith(baseUrl)) {
      relativePath = relativePath.slice(baseUrl.length);
    }
    
    // Try to load file metadata first (generated at build time with actual fs.statSync)
    try {
      const metadataResponse = await fetch(`${baseUrl}data/file-metadata.json`);
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        const fileMetadata = metadata[relativePath];
        
        if (fileMetadata && fileMetadata.lastModified) {
          return new Date(fileMetadata.lastModified).toLocaleDateString();
        }
      }
    } catch {
      console.warn('Could not load file metadata, falling back to other methods');
    }

    // For devlogs, extract date from path as fallback if metadata is not available
    if (relativePath.includes('devlogs/')) {
      const dateMatch = relativePath.match(/devlogs\/(\d{4}-\d{2}-\d{2})\//);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      }
    }

    // For blogs/projects, try to extract date from the filename if metadata not available
    if (relativePath.includes('blogs/') || relativePath.includes('projects/')) {
      const dateMatch = relativePath.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      }
    }
    
    // Final fallback to current date
    return new Date().toLocaleDateString();
  } catch (error) {
    console.error(`Error getting last modified time for ${contentPath}:`, error);
    
    // Even in error case, try to extract date from path for devlogs
    // Extract the relative path from the full URL for error handling
    const baseUrl = getFormattedBaseUrl();
    let relativePath = contentPath;
    
    // Remove baseUrl prefix if present
    if (relativePath.startsWith(baseUrl)) {
      relativePath = relativePath.slice(baseUrl.length);
    }
    
    if (relativePath.includes('devlogs/')) {
      const dateMatch = relativePath.match(/devlogs\/(\d{4}-\d{2}-\d{2})\//);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      }
    }
    
    return new Date().toLocaleDateString();
  }
}
