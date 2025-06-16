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
  .version('1.0.5');

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

program
  .command('dev')
  .description('Start development server')
  .action(() => {
    console.log('🚀 Starting development server...');
    try {
      // First run preprocessing
      execSync('npx tsx node_modules/onigiri-press/src/scripts/preprocess-content.ts', { stdio: 'inherit', cwd: process.cwd() });
      // Then start vite dev server
      execSync('npx vite --config node_modules/onigiri-press/vite.config.ts', { stdio: 'inherit', cwd: process.cwd() });
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
      // First run preprocessing
      execSync('npx tsx node_modules/onigiri-press/src/scripts/preprocess-content.ts', { stdio: 'inherit', cwd: process.cwd() });
      // Then build with vite
      execSync('npx vite build --config node_modules/onigiri-press/vite.config.ts', { stdio: 'inherit', cwd: process.cwd() });
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

program.parse();
