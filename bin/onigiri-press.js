#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const program = new Command();

program
  .name('onigiri-press')
  .description('OnigiriPress - A modern portfolio framework')
  .version('1.0.0');

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
    const templateFiles = [
      'config.yaml',
      'config.template.yaml',
      'public/',
      'templates/',
      'package.json'
    ];
    
    console.log('📁 Setting up project structure...');
    // Implementation for copying files would go here
    
    console.log('✅ Project created successfully!');
    console.log(`📝 Next steps:`);
    console.log(`   cd ${projectName}`);
    console.log(`   npm install`);
    console.log(`   onigiri-press dev`);
  });

program
  .command('dev')
  .description('Start development server')
  .action(() => {
    console.log('🚀 Starting development server...');
    try {
      execSync('npm run dev', { stdio: 'inherit', cwd: process.cwd() });
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
      execSync('npm run build', { stdio: 'inherit', cwd: process.cwd() });
      console.log('✅ Build completed!');
    } catch (error) {
      console.error('❌ Build failed');
      process.exit(1);
    }
  });

program
  .command('generate <type> <name>')
  .description('Generate new content (blog|project)')
  .action((type, name) => {
    console.log(`📝 Generating new ${type}: ${name}`);
    try {
      execSync(`npm run generate ${type} "${name}"`, { stdio: 'inherit', cwd: process.cwd() });
    } catch (error) {
      console.error(`❌ Failed to generate ${type}`);
      process.exit(1);
    }
  });

program.parse();
