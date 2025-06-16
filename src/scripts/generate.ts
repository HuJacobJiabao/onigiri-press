#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
function updateFrontmatter(content: string, title: string): string {
  const now = new Date();
  const preciseTimestamp = now.toISOString(); // Precise timestamp for frontmatter
  
  // Only replace frontmatter placeholders, not body content
  let updatedContent = content;
  
  // Replace title in frontmatter only
  updatedContent = updatedContent.replace(/^title: "\{\{title\}\}"/m, `title: "${title}"`);
  
  // Replace createTime in frontmatter with precise timestamp
  updatedContent = updatedContent.replace(/^createTime: "\{\{createTime\}\}"/m, `createTime: "${preciseTimestamp}"`);
  
  return updatedContent;
}

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

function showUsage() {
  console.log(colorize('🚀 Content Generator for Portfolio', colors.cyan + colors.bright));
  console.log('');
  console.log(colorize('Usage:', colors.yellow + colors.bright));
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('generate', colors.blue)} ${colorize('<type>', colors.magenta)} ${colorize('<article-name>', colors.green)}`);
  console.log('');
  console.log(colorize('Type shortcuts:', colors.yellow + colors.bright));
  console.log(`  ${colorize('g, generate', colors.blue)}   - Generate command`);
  console.log(`  ${colorize('b, blog', colors.magenta)}      - Create a blog post`);
  console.log(`  ${colorize('p, project', colors.magenta)}   - Create a project`);
  console.log('');
  console.log(colorize('Examples:', colors.yellow + colors.bright));
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('g', colors.blue)} ${colorize('b', colors.magenta)} ${colorize('my-new-blog-post', colors.green)}`);
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('generate', colors.blue)} ${colorize('blog', colors.magenta)} ${colorize('"Understanding React Hooks"', colors.green)}`);
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('g', colors.blue)} ${colorize('p', colors.magenta)} ${colorize('awesome-react-app', colors.green)}`);
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('generate', colors.blue)} ${colorize('project', colors.magenta)} ${colorize('"Portfolio Website"', colors.green)}`);
  console.log('');
  console.log(colorize('Note:', colors.yellow));
  console.log(`  • Quotes are ${colorize('optional', colors.cyan)} for article names`);
  console.log(`  • Names with spaces will be ${colorize('sanitized', colors.cyan)} (e.g., "My Blog!" → "my-blog")`);
}

function expandShortcuts(args: string[]): string[] {
  const expanded = [...args];
  
  // Expand type shortcuts (first argument when using npm run g)
  if (expanded[0] === 'b') {
    expanded[0] = 'blog';
  } else if (expanded[0] === 'p') {
    expanded[0] = 'project';
  }
  
  return expanded;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function generateContent(type: 'blog' | 'project', articleName: string) {
  const projectRoot = process.cwd();
  const templatesDir = path.join(projectRoot, 'templates');
  const contentDir = path.join(projectRoot, 'public', 'content', type === 'blog' ? 'blogs' : 'projects');
  
  // Sanitize the article name for use as folder name
  const folderName = sanitizeFilename(articleName);
  
  if (!folderName) {
    throw new Error('Invalid article name provided');
  }
  
  // Check if template exists
  const templatePath = path.join(templatesDir, `${type}-template.md`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  
  // Create content directory if it doesn't exist
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  // Create article folder
  const articleDir = path.join(contentDir, folderName);
  if (fs.existsSync(articleDir)) {
    throw new Error(`Article folder already exists: ${articleDir}`);
  }
  
  fs.mkdirSync(articleDir);
  
  // Read template content
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  
  // Update only frontmatter placeholders
  const updatedContent = updateFrontmatter(templateContent, articleName);
  
  // Copy template to article folder as index.md
  const articleFilePath = path.join(articleDir, 'index.md');
  fs.writeFileSync(articleFilePath, updatedContent, 'utf-8');
  
  // Convert to relative paths for display
  const relativeArticleDir = path.relative(projectRoot, articleDir);
  const relativeArticleFilePath = path.relative(projectRoot, articleFilePath);
  
  console.log('');
  console.log(colorize('✅ Successfully created:', colors.green + colors.bright));
  console.log(`   ${colorize('Type:', colors.yellow)} ${colorize(type, colors.magenta)}`);
  console.log(`   ${colorize('Folder:', colors.yellow)} ${colorize(relativeArticleDir, colors.blue)}`);
  console.log(`   ${colorize('File:', colors.yellow)} ${colorize(relativeArticleFilePath, colors.cyan)}`);
  console.log('');
  console.log(colorize('📝 Next steps:', colors.yellow + colors.bright));
  console.log(`   1. ${colorize('Edit your content:', colors.white)} ${colorize(relativeArticleFilePath, colors.cyan)}`);
  console.log(`   2. ${colorize('Add images/assets to:', colors.white)} ${colorize(relativeArticleDir, colors.blue)}`);
}

async function main() {
  let args = process.argv.slice(2);
  
  // Handle help command
  if (args.length === 1 && (args[0] === '--help' || args[0] === '-h' || args[0] === 'help')) {
    showUsage();
    process.exit(0);
  }
  
  // Expand shortcuts
  args = expandShortcuts(args);
  
  if (args.length !== 2) {
    console.error(colorize('❌ Error: Invalid number of arguments', colors.red + colors.bright));
    console.log('');
    showUsage();
    process.exit(1);
  }
  
  const [type, articleName] = args;
  
  if (type !== 'blog' && type !== 'project') {
    console.error(colorize('❌ Error: Type must be either "blog" or "project"', colors.red + colors.bright));
    console.log('');
    showUsage();
    process.exit(1);
  }
  
  if (!articleName || articleName.trim() === '') {
    console.error(colorize('❌ Error: Article name cannot be empty', colors.red + colors.bright));
    console.log('');
    showUsage();
    process.exit(1);
  }
  
  try {
    await generateContent(type as 'blog' | 'project', articleName);
  } catch (error) {
    console.error(colorize('❌ Error:', colors.red + colors.bright), (error as Error).message);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';

// Check if this file is being run directly
const __filename = fileURLToPath(import.meta.url);
const isMain = process.argv[1] === __filename;

if (isMain) {
  main();
}
