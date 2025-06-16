#!/usr/bin/env tsx

/**
 * Generate file metadata including last modification times
 * This runs at build time to capture actual file system modification times
 */

import fs from 'fs';
import path from 'path';

interface FileMetadata {
  path: string;
  lastModified: string;
  created: string;
}

function generateFileMetadata() {
  const metadata: Record<string, FileMetadata> = {};
  
  // Get devlog files
  const devlogsDir = path.join(process.cwd(), 'public/devlogs');
  if (fs.existsSync(devlogsDir)) {
    const dates = fs.readdirSync(devlogsDir);
    
    for (const date of dates) {
      const datePath = path.join(devlogsDir, date);
      if (fs.statSync(datePath).isDirectory()) {
        const files = fs.readdirSync(datePath);
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(datePath, file);
            const stats = fs.statSync(filePath);
            const relativePath = `devlogs/${date}/${file}`;
            
            metadata[relativePath] = {
              path: relativePath,
              lastModified: stats.mtime.toISOString(),
              created: stats.birthtime.toISOString()
            };
          }
        }
      }
    }
  }
  
  // Get content files (blogs/projects)
  const contentDir = path.join(process.cwd(), 'public/content');
  if (fs.existsSync(contentDir)) {
    function processContentDir(dir: string, baseDir: string = '') {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const relativePath = baseDir ? `${baseDir}/${item}` : item;
        
        if (fs.statSync(itemPath).isDirectory()) {
          processContentDir(itemPath, relativePath);
        } else if (item.endsWith('.md')) {
          const stats = fs.statSync(itemPath);
          
          metadata[relativePath] = {
            path: relativePath,
            lastModified: stats.mtime.toISOString(),
            created: stats.birthtime.toISOString()
          };
        }
      }
    }
    
    processContentDir(contentDir);
  }
  
  // Write metadata to public directory
  const outputPath = path.join(process.cwd(), 'public/data/file-metadata.json');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  console.log(`Generated file metadata for ${Object.keys(metadata).length} files`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateFileMetadata();
}

export default generateFileMetadata;
