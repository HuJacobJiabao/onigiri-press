#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('ongr')
  .description('OnigiriPress - A modern portfolio framework')
  .version('1.0.12');

program
  .command('init [project-name]')
  .description('Initialize a new OnigiriPress project')
  .action((projectName = 'my-portfolio') => {
    console.log(`🍙 Creating new OnigiriPress project: ${projectName}`);
    
    const projectPath = path.join(process.cwd(), projectName);
    
    // Create project directory
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }
    
    // Copy essential files
    const packageDir = path.dirname(__dirname);
    
    console.log('📁 Setting up project structure...');
    
    // Copy config files
    const configTemplate = path.join(packageDir, 'config.yaml');
    const configTarget = path.join(projectPath, 'config.yaml');
    if (fs.existsSync(configTemplate)) {
      fs.copyFileSync(configTemplate, configTarget);
      console.log('   ✓ Created config.yaml');
    }
    
    // Copy onigiri.config.json
    const onigiriConfigTemplate = path.join(packageDir, 'onigiri.config.json');
    const onigiriConfigTarget = path.join(projectPath, 'onigiri.config.json');
    if (fs.existsSync(onigiriConfigTemplate)) {
      fs.copyFileSync(onigiriConfigTemplate, onigiriConfigTarget);
      console.log('   ✓ Created onigiri.config.json');
    }

    // Note: We don't copy index.html - it will be used from the package itself

    // Copy package.json template
    const packageTemplate = path.join(packageDir, 'package-user.json');
    const packageTarget = path.join(projectPath, 'package.json');
    if (fs.existsSync(packageTemplate)) {
      fs.copyFileSync(packageTemplate, packageTarget);
      console.log('   ✓ Created package.json');
    }
    
    // Copy public directory
    const publicDir = path.join(packageDir, 'public');
    const publicTarget = path.join(projectPath, 'public');
    if (fs.existsSync(publicDir)) {
      fs.cpSync(publicDir, publicTarget, { recursive: true });
      console.log('   ✓ Copied public/ directory');
    }
    
    // Copy templates directory
    const templatesDir = path.join(packageDir, 'templates');
    const templatesTarget = path.join(projectPath, 'templates');
    if (fs.existsSync(templatesDir)) {
      fs.cpSync(templatesDir, templatesTarget, { recursive: true });
      console.log('   ✓ Copied templates/ directory');
    }
    
    console.log('✅ Project created successfully!');
    console.log(`📝 Next steps:`);
    console.log(`   cd ${projectName}`);
    console.log(`   npm install`);
    console.log(`   ongr dev`);
  });

// Read baseUrl from config files
function getBaseUrl(userDir) {
  // First try to read from onigiri.config.json (fastest)
  const configJsonPath = path.join(userDir, 'onigiri.config.json');
  if (fs.existsSync(configJsonPath)) {
    try {
      const configJson = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'));
      if (configJson.baseUrl) {
        console.log(`📍 Using baseUrl from onigiri.config.json: ${configJson.baseUrl}`);
        return configJson.baseUrl;
      }
    } catch (error) {
      console.log('⚠️ Error reading onigiri.config.json, trying config.yaml...');
    }
  }
  
  // Fall back to config.yaml if needed
  const configYamlPath = path.join(userDir, 'config.yaml');
  if (fs.existsSync(configYamlPath)) {
    try {
      const configContent = fs.readFileSync(configYamlPath, 'utf8');
      
      // This is a simple string search approach instead of full YAML parsing
      const baseUrlMatch = configContent.match(/baseUrl:\s*["']?([^"']+)["']?/);
      if (baseUrlMatch && baseUrlMatch[1]) {
        const baseUrl = baseUrlMatch[1];
        console.log(`📍 Using baseUrl from config.yaml: ${baseUrl}`);
        return baseUrl;
      }
    } catch (error) {
      console.log('⚠️ Error reading baseUrl from config.yaml');
    }
  }
  
  // Default fallback
  console.log('📍 Using default baseUrl: /');
  return '/';
}

program
  .command('dev')
  .description('Start development server')
  .action(() => {
    console.log('🚀 Starting development server...');
    try {
      const userDir = process.cwd();
      const packageDir = path.dirname(__dirname);
      
      // First run preprocessing in user directory
      console.log('🔄 Step 1: Preprocessing content...');
      execSync('npx tsx node_modules/onigiri-press/src/scripts/preprocess-content.ts', { 
        stdio: 'inherit', 
        cwd: userDir 
      });
      
      // Get baseUrl from config for development
      const baseUrl = getBaseUrl(userDir);
      
      console.log('🔥 Step 2: Starting development server...');
      execSync('npx vite', { 
        stdio: 'inherit', 
        cwd: packageDir,
        env: { 
          ...process.env, 
          VITE_USER_DIR: userDir,
          VITE_BASE_URL: baseUrl
        }
      });
    } catch (error) {
      console.error('❌ Failed to start development server');
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build for production')
  .action(() => {
    console.log('🔨 Building for production...');
    try {
      const userDir = process.cwd();
      const packageDir = path.dirname(__dirname);
      
      // First run preprocessing in user directory
      console.log('🔄 Step 1: Preprocessing content...');
      execSync('npx tsx node_modules/onigiri-press/src/scripts/preprocess-content.ts', { 
        stdio: 'inherit', 
        cwd: userDir 
      });
      
      // Get baseUrl from config for production build
      const baseUrl = getBaseUrl(userDir);
      
      console.log('🔨 Step 2: Building for production...');
      execSync('npx vite build', { 
        stdio: 'inherit', 
        cwd: packageDir,
        env: { 
          ...process.env, 
          VITE_USER_DIR: userDir,
          VITE_BASE_URL: baseUrl,
          NODE_ENV: 'production'
        }
      });
      
      // Copy dist to user directory
      console.log('📦 Step 3: Copying build output...');
      const distSource = path.join(packageDir, 'dist');
      const distTarget = path.join(userDir, 'dist');
      if (fs.existsSync(distSource)) {
        if (fs.existsSync(distTarget)) {
          fs.rmSync(distTarget, { recursive: true });
        }
        fs.cpSync(distSource, distTarget, { recursive: true });
        console.log('   ✓ Build output copied to ./dist');
      }
      
      console.log('✅ Build completed!');
    } catch (error) {
      console.error('❌ Build failed');
      process.exit(1);
    }
  });

program
  .command('generate <type> <name>')
  .alias('g')
  .description('Generate new content (blog|project). Use aliases: g for generate, b for blog, p for project')
  .action((type, name) => {
    // Support aliases for content types
    const typeMap = {
      'b': 'blog',
      'blog': 'blog',
      'p': 'project', 
      'project': 'project'
    };
    
    const actualType = typeMap[type.toLowerCase()];
    if (!actualType) {
      console.error(`❌ Invalid type: ${type}. Use 'blog' (or 'b') or 'project' (or 'p')`);
      process.exit(1);
    }
    
    console.log(`📝 Generating new ${actualType}: ${name}`);
    
    // Find the onigiri-press package directory
    const packageDir = path.dirname(__dirname);
    const generateScript = path.join(packageDir, 'src', 'scripts', 'generate.ts');
    
    try {
      // Use tsx to run the TypeScript script directly
      execSync(`npx tsx "${generateScript}" ${actualType} "${name}"`, { 
        stdio: 'inherit', 
        cwd: process.cwd(),
        env: { ...process.env, NODE_PATH: packageDir }
      });
    } catch (error) {
      console.error(`❌ Failed to generate ${actualType}`);
      process.exit(1);
    }
  });

program
  .command('deploy')
  .description('Build and deploy to GitHub Pages')
  .option('-b, --base <url>', 'Override base URL for deployment')
  .action(async (options) => {
    console.log('🚀 Building and deploying to GitHub Pages...');
    
    try {
      // Read config to get deployment settings
      let baseUrl = '/';
      let repoName = 'my-portfolio';
      let isUserRepo = false;
      
      if (fs.existsSync('config.yaml')) {
        const configContent = fs.readFileSync('config.yaml', 'utf8');
        const yaml = await import('yaml');
        const config = yaml.parse(configContent);
        
        if (config?.deployment?.github?.repository) {
          repoName = config.deployment.github.repository;
          // Check if this is a user/organization repository (username.github.io pattern)
          isUserRepo = repoName.endsWith('.github.io');
        }
        
        if (options.base) {
          baseUrl = options.base;
          console.log(`📍 Using custom base URL: ${baseUrl}`);
        } else if (config?.deployment?.baseUrl && config.deployment.baseUrl !== '') {
          baseUrl = config.deployment.baseUrl;
          console.log(`📍 Using configured base URL: ${baseUrl}`);
        } else if (isUserRepo) {
          baseUrl = '/';
          console.log(`📍 Detected user/org repository (${repoName}), using base URL: /`);
        } else {
          baseUrl = `/${repoName}/`;
          console.log(`📍 Detected project repository (${repoName}), using base URL: /${repoName}/`);
        }
      } else {
        console.log('⚠️  No config.yaml found, using default base URL: /');
      }
      
      console.log(`📦 Building with base URL: ${baseUrl}`);
      
      // First run preprocessing in user directory
      console.log('🔄 Step 1: Preprocessing content...');
      execSync('npx tsx node_modules/onigiri-press/src/scripts/preprocess-content.ts', { stdio: 'inherit', cwd: process.cwd() });
      
      // Then build with vite from onigiri-press directory but output to user directory
      console.log('🔨 Step 2: Building for production...');
      const packageDir = path.join(process.cwd(), 'node_modules', 'onigiri-press');
      execSync(`npx vite build`, { 
        stdio: 'inherit', 
        cwd: packageDir,
        env: { 
          ...process.env, 
          VITE_BASE_URL: baseUrl,
          VITE_USER_DIR: process.cwd(),
          NODE_ENV: 'production'
        }
      });
      
      // Finally deploy with gh-pages
      console.log('🌐 Step 3: Deploying to GitHub Pages...');
      execSync('npx gh-pages -d dist', { stdio: 'inherit', cwd: process.cwd() });
      
      console.log('✅ Deployment completed successfully!');
      if (isUserRepo) {
        console.log(`🎉 Your site should be available at: https://${repoName}/`);
      } else {
        console.log(`🎉 Your site should be available at: https://<username>.github.io${baseUrl}`);
        console.log('💡 Replace <username> with your actual GitHub username');
      }
    } catch (error) {
      console.error('❌ Deployment failed');
      console.error('💡 Make sure you have:');
      console.error('   • Initialized a git repository');
      console.error('   • Set up GitHub Pages in your repository settings');
      console.error('   • Pushed your code to GitHub');
      console.error('   • Configured deployment settings in config.yaml');
      process.exit(1);
    }
  });

program.parse();
