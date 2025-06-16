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
 * Load preprocessed blog posts from static JSON
 */
export async function loadStaticBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/blogs.json`);
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
    const response = await fetch(`${import.meta.env.BASE_URL}data/projects.json`);
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
 * @param contentPath - Path relative to content/ folder (from static data)
 */
export async function loadMarkdownContent(contentPath: string): Promise<string> {
  try {
    // Convert content path to public content path
    const publicPath = `${import.meta.env.BASE_URL}content/${contentPath}`;
    const response = await fetch(publicPath);
    
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
 * @param assetPath - Path relative to content/ folder
 */
export function getAssetUrl(assetPath: string): string {
  // Remove leading './' if present
  const cleanPath = assetPath.startsWith('./') ? assetPath.slice(2) : assetPath;
  return `${import.meta.env.BASE_URL}content/${cleanPath}`;
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
 * @param contentPath - Path relative to content/ folder (from static data) or devlogs/ for daily logs
 */
export async function getFileLastModifiedTime(contentPath: string): Promise<string> {
  try {
    // Try to load file metadata first (generated at build time with actual fs.statSync)
    try {
      const metadataResponse = await fetch(`${import.meta.env.BASE_URL}data/file-metadata.json`);
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        const fileMetadata = metadata[contentPath];
        
        if (fileMetadata && fileMetadata.lastModified) {
          return new Date(fileMetadata.lastModified).toLocaleDateString();
        }
      }
    } catch {
      console.warn('Could not load file metadata, falling back to other methods');
    }

    // For devlogs, extract date from path as fallback if metadata is not available
    if (contentPath.startsWith('devlogs/')) {
      const dateMatch = contentPath.match(/devlogs\/(\d{4}-\d{2}-\d{2})\//);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      }
    }

    // For blogs/projects, try to extract date from the filename if metadata not available
    if (contentPath.includes('blogs/') || contentPath.includes('projects/')) {
      const dateMatch = contentPath.match(/(\d{4}-\d{2}-\d{2})/);
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
    if (contentPath.startsWith('devlogs/')) {
      const dateMatch = contentPath.match(/devlogs\/(\d{4}-\d{2}-\d{2})\//);
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
