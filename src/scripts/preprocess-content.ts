#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { getDefaultCoverImage } from './content-config-loader';
import generateFileMetadata from './generate-file-metadata';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

// Read baseUrl from onigiri.config.json
function getBaseUrl(): string {
  // Try to get user directory from environment variable first (CLI usage)
  const userDir = process.cwd();
  
  try {
    const configPath = path.join(userDir, 'onigiri.config.json');
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);
      
      // Format baseUrl properly
      let baseUrl = config.baseUrl || '/';
      if (!baseUrl.startsWith('/')) baseUrl = '/' + baseUrl;
      if (!baseUrl.endsWith('/')) baseUrl = baseUrl + '/';
      
      // console.log(`📍 Reading baseUrl from user config: ${configPath}`);
      return baseUrl;
    }
  } catch (error) {
    console.warn(`⚠️ Error reading onigiri.config.json from user directory:`, error);
  }
  
  // Fallback to package directory for development
  try {
    const configPath = path.join(projectRoot, 'onigiri.config.json');
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);
      
      let baseUrl = config.baseUrl || '/';
      if (!baseUrl.startsWith('/')) baseUrl = '/' + baseUrl;
      if (!baseUrl.endsWith('/')) baseUrl = baseUrl + '/';
      
      console.log(`📍 Reading baseUrl from package config: ${configPath}`);
      return baseUrl;
    }
  } catch (error) {
    console.warn(`⚠️ Error reading onigiri.config.json from package directory:`, error);
  }
  
  return '/';
}

function colorize(text: string, color: string): string {
  return `${color}${text}${colors.reset}`;
}

// Get the actual project root (user directory when running via CLI)
function getProjectRoot(): string {
  return  process.cwd();
}

const projectRoot = getProjectRoot();

interface ContentMetadata {
  type: 'blog' | 'project';
  title: string;
  createTime: string;
  description?: string;
  tags?: string[];
  category: string;
  coverImage?: string;
}

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
 * Parse frontmatter using YAML library
 */
import { parse as parseYAML } from 'yaml';

function parseFrontmatter(content: string): { metadata: ContentMetadata; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {} as ContentMetadata, content };
  }

  const [, frontmatterStr, bodyContent] = match;
  
  try {
    // Parse YAML frontmatter with the yaml library
    const metadata = parseYAML(frontmatterStr);
    
    // Ensure tags is always an array
    if (metadata.tags && !Array.isArray(metadata.tags)) {
      metadata.tags = [metadata.tags];
    } else if (!metadata.tags) {
      metadata.tags = [];
    }
    
    return { metadata: metadata as ContentMetadata, content: bodyContent };
  } catch (error) {
    console.warn(`⚠️ Error parsing frontmatter YAML:`, error);
    // Fallback to empty metadata on error
    return { metadata: {} as ContentMetadata, content: bodyContent };
  }
}

/**
 * Generate ID from title
 */
function generateIdFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Find all assets in a directory
 */
function findAssets(dirPath: string): string[] {
  const assets: string[] = [];
  const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
  
  if (!fs.existsSync(dirPath)) {
    return assets;
  }

  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (extensions.includes(ext)) {
        assets.push(item);
      }
    } else if (stat.isDirectory()) {
      // Recursively find assets in subdirectories
      const subAssets = findAssets(itemPath);
      assets.push(...subAssets.map(asset => path.join(item, asset)));
    }
  }
  
  return assets;
}

/**
 * Process a single content item with full markdown preprocessing
 */
async function processContentItem(
  contentType: 'blogs' | 'projects',
  itemPath: string
): Promise<BlogPost | Project | null> {
  try {
    const itemName = path.basename(itemPath);
    const indexPath = path.join(itemPath, 'index.md');
    
    // Only process folders that contain index.md
    if (!fs.existsSync(indexPath) || !fs.statSync(indexPath).isFile()) {
      return null;
    }
    
    const markdownContent = fs.readFileSync(indexPath, 'utf-8');

    const { metadata } = parseFrontmatter(markdownContent);
    
    const id = generateIdFromTitle(metadata.title || itemName);
    const baseUrl = getBaseUrl();
    const link = `${baseUrl}${contentType}/${id}`;
    // Add baseUrl to contentPath
    const contentPath = `${baseUrl}content/${contentType}/${path.basename(itemPath)}/index.md`;

    // Find assets in the same directory (for projects)
    let assetPaths: string[] = [];
    if (contentType === 'projects') {
      const rawPaths = findAssets(itemPath);
      // Add baseUrl to each asset path
      assetPaths = rawPaths.map(assetPath => {
        return `${baseUrl}content/${contentType}/${path.basename(itemPath)}/${assetPath}`;
      });
    }
    
    const baseItem = {
      id,
      title: metadata.title || itemName.replace(/-/g, ' '),
      date: metadata.createTime || new Date().toISOString(),
      category: metadata.category || 'General',
      description: metadata.description || '',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      link,
      contentPath
    };

    // Handle cover image resolution - Add baseUrl to paths
    const resolveImagePath = (coverImage: string | undefined): string | undefined => {
      if (!coverImage || coverImage === 'default') {
        // Use content-type specific default cover image from config
        const defaultCover = getDefaultCoverImage(contentType);
        
        // If it's already an absolute URL, return as is
        if (defaultCover.startsWith('http')) {
          return defaultCover;
        }
        
        // Otherwise, ensure it has the correct baseUrl prefix
        const baseUrl = getBaseUrl();
        
        // Strip any existing baseUrl or leading slash to prevent duplication
        let cleanPath = defaultCover;
        if (cleanPath.startsWith(baseUrl)) {
          cleanPath = cleanPath.slice(baseUrl.length);
        }
        if (cleanPath.startsWith('/')) {
          cleanPath = cleanPath.slice(1);
        }
        
        // Add baseUrl to the path
        return `${baseUrl}${cleanPath}`;
      }
      
      // If it's already an absolute URL, return as is
      if (coverImage.startsWith('http')) {
        return coverImage;
      }
      
      // Remove any baseUrl prefix to prevent duplication
      let cleanPath = coverImage;
      const baseUrl = getBaseUrl();
      if (cleanPath.startsWith(baseUrl)) {
        cleanPath = cleanPath.slice(baseUrl.length);
      }
      
      // Remove leading './' if present
      if (cleanPath.startsWith('./')) {
        cleanPath = cleanPath.slice(2);
      }
      
      // Remove leading '../' patterns
      cleanPath = cleanPath.replace(/^(\.\.\/)+/, '');
      
      // Remove leading '/' if present
      if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.slice(1);
      }
      
      // Add baseUrl to the clean path
      return `${baseUrl}${cleanPath}`;
    };

    if (contentType === 'blogs') {
      return {
        ...baseItem,
        image: resolveImagePath(metadata.coverImage)
      } as BlogPost;
    } else {
      return {
        ...baseItem,
        image: resolveImagePath(metadata.coverImage),
        assetPaths
      } as Project;
    }

  } catch (error) {
    console.warn(`⚠️ Error processing ${itemPath}:`, error);
    return null;
  }
}

/**
 * Process content directory
 */
async function processContentDirectory(contentType: 'blogs' | 'projects'): Promise<Array<BlogPost | Project>> {
  const contentDir = path.join(projectRoot, 'public', 'content', contentType);
  const items: Array<BlogPost | Project> = [];
  
  if (!fs.existsSync(contentDir)) {
    console.warn(`⚠️ Content directory not found: ${contentDir}`);
    return items;
  }

  const entries = fs.readdirSync(contentDir);
  
  for (const entry of entries) {
    const entryPath = path.join(contentDir, entry);
    const stat = fs.statSync(entryPath);
    
    if (stat.isDirectory()) {
      // Process folder-based content - only if it contains index.md
      const indexPath = path.join(entryPath, 'index.md');
      
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        const item = await processContentItem(contentType, entryPath);
        if (item) {
          items.push(item);
        }
      }
    }
    // Remove direct markdown file processing - only process index.md files in folders
  }
  
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Generate static data files
 */
async function generateStaticData() {
  console.log(colorize('🔍 Starting content preprocessing...', colors.cyan + colors.bright));
  
  // Get the baseUrl from onigiri.config.json
  const baseUrl = getBaseUrl();
  console.log(colorize(`🌐 Using baseUrl: ${baseUrl}`, colors.blue));
  
  try {
    // Process blogs
    console.log(colorize('📝 Processing blogs...', colors.blue));
    const blogs = await processContentDirectory('blogs') as BlogPost[];
    console.log(`   Found ${blogs.length} blog posts`);

    // Process projects
    console.log(colorize('💻 Processing projects...', colors.blue));
    const projects = await processContentDirectory('projects') as Project[];
    console.log(`   Found ${projects.length} projects`);

    // Create output directory in public folder
    const outputDir = path.join(projectRoot, 'public', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write static data files
    const blogsPath = path.join(outputDir, 'blogs.json');
    const projectsPath = path.join(outputDir, 'projects.json');
    
    fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2));
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));

    // Generate file metadata with actual modification times
    console.log('\n📄 Generating file metadata...');
    generateFileMetadata();

    console.log('');
    console.log(colorize('✅ Content preprocessing completed!', colors.green + colors.bright));
    console.log(`   ${colorize('Blogs:', colors.yellow)} ${colorize(blogs.length.toString(), colors.cyan)} posts → ${colorize(path.relative(projectRoot, blogsPath), colors.blue)}`);
    console.log(`   ${colorize('Projects:', colors.yellow)} ${colorize(projects.length.toString(), colors.cyan)} projects → ${colorize(path.relative(projectRoot, projectsPath), colors.blue)}`);

    // Generate type definitions
    const typesPath = path.join(outputDir, 'types.ts');
    const typesContent = `// Auto-generated types for static content data
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  link: string;
  tags: string[];
  contentPath: string;
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
  contentPath: string;
  assetPaths: string[];
}
`;

    fs.writeFileSync(typesPath, typesContent);
    console.log(`   ${colorize('Types:', colors.yellow)} Generated → ${colorize(path.relative(projectRoot, typesPath), colors.blue)}`);
    
    console.log('');
    console.log(colorize('📋 Summary:', colors.yellow + colors.bright));
    console.log(`   • ${blogs.length} blog posts processed`);
    console.log(`   • ${projects.length} projects processed`);
    console.log(`   • Static data files generated in ${colorize('public/data/', colors.cyan)}`);
    console.log(`   • Ready for fast static loading! 🚀`);

  } catch (error) {
    console.error(colorize('❌ Error during preprocessing:', colors.red + colors.bright), error);
    process.exit(1);
  }
}

// Main execution - only execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticData();
}

export { generateStaticData, getBaseUrl };
