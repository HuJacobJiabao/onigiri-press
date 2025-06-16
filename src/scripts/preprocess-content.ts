#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

function colorize(text: string, color: string): string {
  return `${color}${text}${colors.reset}`;
}

// Get project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

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
 * Parse frontmatter manually without YAML dependency
 */
function parseFrontmatter(content: string): { metadata: ContentMetadata; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {} as ContentMetadata, content };
  }

  const [, frontmatterStr, bodyContent] = match;
  const metadata: any = {};

  // Parse YAML-like frontmatter manually
  const lines = frontmatterStr.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle arrays (basic support for tags)
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      if (arrayContent.trim()) {
        metadata[key] = arrayContent
          .split(',')
          .map(item => item.trim().replace(/['"]/g, ''))
          .filter(item => item);
      } else {
        metadata[key] = [];
      }
    } else {
      metadata[key] = value;
    }
  }

  return { metadata: metadata as ContentMetadata, content: bodyContent };
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
  itemPath: string,
  basePath: string
): Promise<BlogPost | Project | null> {
  try {
    const itemName = path.basename(itemPath);
    const indexPath = path.join(itemPath, 'index.md');
    
    // Only process folders that contain index.md
    if (!fs.existsSync(indexPath) || !fs.statSync(indexPath).isFile()) {
      return null;
    }
    
    const markdownPath = indexPath;
    const markdownContent = fs.readFileSync(indexPath, 'utf-8');

    const { metadata } = parseFrontmatter(markdownContent);
    
    const id = generateIdFromTitle(metadata.title || itemName);
    const link = `/my-portfolio/${contentType}/${id}`;
    const contentPath = path.relative(basePath, markdownPath);

    // Find assets in the same directory (for projects)
    const assetPaths = contentType === 'projects' ? findAssets(itemPath) : [];
    
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

    // Handle cover image resolution - all paths should be relative to BASE_URL
    const resolveImagePath = (coverImage: string | undefined): string | undefined => {
      if (!coverImage || coverImage === 'default') {
        // Use content-type specific default cover image from config
        const defaultCover = getDefaultCoverImage(contentType);
        return `${process.env.BASE_URL || '/my-portfolio/'}${defaultCover}`;
      }
      
      // Skip if it's already an absolute URL
      if (coverImage.startsWith('http') || coverImage.startsWith(process.env.BASE_URL || '/my-portfolio/')) {
        return coverImage;
      }
      
      // For all relative paths, convert them to be relative to BASE_URL
      let cleanPath = coverImage;
      
      // Remove leading './' if present
      if (cleanPath.startsWith('./')) {
        cleanPath = cleanPath.slice(2);
      }
      
      // Remove leading '../' patterns and treat as relative to BASE_URL
      cleanPath = cleanPath.replace(/^(\.\.\/)+/, '');
      
      // If path starts with '/', treat it as absolute from BASE_URL
      if (cleanPath.startsWith('/')) {
        return `${process.env.BASE_URL || '/my-portfolio/'}${cleanPath.slice(1)}`;
      }
      
      // Otherwise, assume it's a path relative to BASE_URL
      return `${process.env.BASE_URL || '/my-portfolio/'}${cleanPath}`;
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
        const item = await processContentItem(contentType, entryPath, path.join(projectRoot, 'public', 'content'));
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

export { generateStaticData };
