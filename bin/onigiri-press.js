#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('ongr')
  .description('OnigiriPress - A modern portfolio framework')
  .version('1.2.8');

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
    const configTemplate = path.join(packageDir, 'config.template.yaml');
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

    // Copy gitignore
    const gitignoreTemplate = path.join(packageDir, 'gitignore.template');
    const gitignoreTarget = path.join(projectPath, '.gitignore');
    if (fs.existsSync(gitignoreTemplate)) {
      fs.copyFileSync(gitignoreTemplate, gitignoreTarget);
      console.log('   ✓ Created .gitignore');
    }
    
    // Copy README
    const readmeTemplate = path.join(packageDir, 'README.template.md');
    const readmeTarget = path.join(projectPath, 'README.md');
    if (fs.existsSync(readmeTemplate)) {
      fs.copyFileSync(readmeTemplate, readmeTarget);
      console.log('   ✓ Created README.md');
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
        // console.log(`📍 Using baseUrl from onigiri.config.json: ${configJson.baseUrl}`);
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
        // console.log(`📍 Using baseUrl from config.yaml: ${baseUrl}`);
        return baseUrl;
      }
    } catch (error) {
      console.log('⚠️ Error reading baseUrl from config.yaml');
    }
  }
  
  // Default fallback
  // console.log('📍 Using default baseUrl: /');
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
      const preprocessScript = path.join(packageDir, 'src', 'scripts', 'preprocess-content.ts');
      
      // First run preprocessing from global package location
      console.log('🔄 Step 1: Preprocessing content...');
      execSync(`npx tsx "${preprocessScript}"`, { 
        stdio: 'inherit', 
        cwd: userDir,
        env: { ...process.env, NODE_PATH: packageDir }
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
  .action(async () => {
    console.log('🔨 Building for production...');
    try {
      const userDir = process.cwd();
      const packageDir = path.dirname(__dirname);
      const preprocessScript = path.join(packageDir, 'src', 'scripts', 'preprocess-content.ts');
      
      // First run preprocessing from global package location
      console.log('🔄 Step 1: Preprocessing content...');
      execSync(`npx tsx "${preprocessScript}"`, { 
        stdio: 'inherit', 
        cwd: userDir,
        env: { ...process.env, NODE_PATH: packageDir }
      });
      
      // Get baseUrl from config for production build
      const baseUrl = getBaseUrl(userDir);
      
      console.log('🔨 Step 2: Building with Vite...');
      
      // Run vite build from the package directory (where all dependencies exist)
      // but output to the user directory
      const viteBuild = spawn('npx', ['vite', 'build'], {
        cwd: packageDir,
        env: { 
          ...process.env, 
          VITE_USER_DIR: userDir,
          VITE_BASE_URL: baseUrl,
          NODE_ENV: 'production',
          FORCE_COLOR: '1' // Preserve terminal colors
        },
        stdio: ['inherit', 'pipe', 'pipe']
      });
      
      // Process stdout line by line to clean paths in real-time
      viteBuild.stdout.on('data', (data) => {
        const output = data.toString();
        // Replace long absolute paths and relative paths with cleaner ones
        let cleanedOutput = output
          // Remove complex relative paths like ../../../../../../../portfolio/dist/
          .replace(/(?:\.\.\/)+[^/\s]*\/dist\//g, 'dist/')
          // Also clean any remaining complex paths
          .replace(/.*?onigiri-test.*?\/dist\//g, 'dist/')
          // Clean paths that start with many ../
          .replace(/(?:\.\.\/){3,}[^/\s]*\//g, '')
          // Clean any remaining long absolute paths to user directories
          .replace(/\/[^/\s]*\/[^/\s]*\/[^/\s]*\/portfolio\/dist\//g, 'dist/');
        process.stdout.write(cleanedOutput);
      });
      
      // Pass stderr through unchanged
      viteBuild.stderr.on('data', (data) => {
        process.stderr.write(data);
      });
      
      // Wait for build to complete
      await new Promise((resolve, reject) => {
        viteBuild.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Build failed with exit code ${code}`));
          }
        });
      });
      
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
  .command('load')
  .alias('l')
  .description('Load and preprocess content files (blogs and projects)')
  .action(() => {
    console.log('🔄 Loading and preprocessing content...');
    
    // Find the onigiri-press package directory
    const packageDir = path.dirname(__dirname);
    const preprocessScript = path.join(packageDir, 'src', 'scripts', 'preprocess-content.ts');
    
    try {
      // Use tsx to run the preprocessing script directly
      execSync(`npx tsx "${preprocessScript}"`, { 
        stdio: 'inherit', 
        cwd: process.cwd(),
        env: { ...process.env, NODE_PATH: packageDir }
      });
      console.log('✅ Content preprocessing completed!');
    } catch (error) {
      console.error('❌ Content preprocessing failed');
      console.error('Error details:', error.message);
      process.exit(1);
    }
  });

program
  .command('deploy')
  .alias('d')
  .description('Deploy to GitHub Pages (requires manual build first)')
  .option('-b, --base <url>', 'Override base URL for deployment')
  .action(async (options) => {
    console.log('🚀 Deploying to GitHub Pages...');
    
    try {
      // Check if dist directory exists
      if (!fs.existsSync('dist')) {
        console.error('❌ No dist directory found!');
        console.error('💡 Please run "ongr build" first to create the production build');
        process.exit(1);
      }
      
      // Read config to get deployment settings
      let baseUrl = '/';
      let repoName = 'my-portfolio';
      let isUserRepo = false;
      
      // First, try to read from onigiri.config.json
      if (fs.existsSync('onigiri.config.json')) {
        const onigiriConfigContent = fs.readFileSync('onigiri.config.json', 'utf8');
        const onigiriConfig = JSON.parse(onigiriConfigContent);
        
        if (onigiriConfig.baseUrl) {
          baseUrl = onigiriConfig.baseUrl;
          console.log(`📍 Using base URL from onigiri.config.json: ${baseUrl}`);
        }
        
        // Extract repository name from baseUrl if it follows GitHub Pages pattern
        if (baseUrl !== '/' && baseUrl.startsWith('/') && baseUrl.endsWith('/')) {
          const pathPart = baseUrl.slice(1, -1); // Remove leading and trailing slashes
          if (pathPart && !pathPart.includes('/')) {
            repoName = pathPart;
            console.log(`📦 Detected repository name from baseUrl: ${repoName}`);
          }
        }
      } else {
        console.log('⚠️  No onigiri.config.json found, using default settings');
      }
      
      // Allow command line override
      if (options.base) {
        baseUrl = options.base;
        console.log(`📍 Using custom base URL from command line: ${baseUrl}`);
      }
      
      // Check if this looks like a user/organization repository
      isUserRepo = baseUrl === '/';
      
      if (isUserRepo) {
        console.log(`📍 Detected user/org repository, using base URL: /`);
      } else {
        console.log(`📍 Detected project repository, using base URL: ${baseUrl}`);
      }
      
      // Deploy with gh-pages
      console.log('🌐 Deploying to GitHub Pages...');
      // Use nojekyll option to add .nojekyll without including other dotfiles like .gitignore
      execSync('npx gh-pages -d dist --nojekyll --remove ".*"', { stdio: 'inherit', cwd: process.cwd() });
      
      console.log('✅ Deployment completed successfully!');
      if (isUserRepo) {
        console.log(`🎉 Your site should be available at: https://<username>.github.io/`);
        console.log('💡 Replace <username> with your actual GitHub username');
      } else {
        console.log(`🎉 Your site should be available at: https://<username>.github.io${baseUrl}`);
        console.log('💡 Replace <username> with your actual GitHub username');
      }
    } catch (error) {
      console.error('❌ Deployment failed');
      console.error('💡 Make sure you have:');
      console.error('   • Run "ongr build" to create a production build');
      console.error('   • Initialized a git repository');
      console.error('   • Set up GitHub Pages in your repository settings');
      console.error('   • Pushed your code to GitHub');
      console.error('   • Configured baseUrl in onigiri.config.json (if needed)');
      process.exit(1);
    }
  });

program
  .command('deploy-vercel')
  .alias('dv')
  .description('Deploy to Vercel')
  .option('--prod', 'Deploy to production (default: preview)')
  .action(async (options) => {
    console.log('🚀 Deploying to Vercel...');
    
    try {
      // Check if user has vercel CLI installed
      try {
        execSync('vercel --version', { stdio: 'pipe' });
      } catch (error) {
        console.error('❌ Vercel CLI not found!');
        console.error('💡 Please install it first:');
        console.error('   npm install -g vercel');
        console.error('   # or');
        console.error('   pnpm add -g vercel');
        process.exit(1);
      }
      
      // Create vercel.json if it doesn't exist
      if (!fs.existsSync('vercel.json')) {
        console.log('📝 Creating vercel.json configuration...');
        const vercelConfig = {
          buildCommand: "npm run build",
          outputDirectory: "dist",
          installCommand: "npm install",
          framework: null,
          rewrites: [
            {
              source: "/(.*)",
              destination: "/index.html"
            }
          ],
          headers: [
            {
              source: "/assets/(.*)",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable"
                }
              ]
            }
          ]
        };
        fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
        console.log('✅ Created vercel.json with optimized settings');
      }
      
      // Deploy to Vercel
      console.log('🌐 Deploying to Vercel...');
      
      if (options.prod) {
        console.log('� Deploying to production...');
        execSync('vercel --prod', { stdio: 'inherit', cwd: process.cwd() });
      } else {
        console.log('🔍 Deploying preview...');
        execSync('vercel', { stdio: 'inherit', cwd: process.cwd() });
      }
      
      console.log('✅ Vercel deployment completed successfully!');
      console.log('💡 Tips:');
      console.log('   • Use --prod flag for production deployment');
      console.log('   • Vercel will automatically build your project');
      console.log('   • Make sure baseUrl is set to "/" in onigiri.config.json for Vercel');
      
    } catch (error) {
      console.error('❌ Vercel deployment failed');
      console.error('💡 Make sure you have:');
      console.error('   • Installed Vercel CLI: npm install -g vercel');
      console.error('   • Logged in to Vercel: vercel login');
      console.error('   • Set baseUrl to "/" in onigiri.config.json');
      console.error('Error details:', error.message);
      process.exit(1);
    }
  });

program
  .command('log [date]')
  .description('Create a new daily log entry (date format: yyyy-mm-dd, defaults to today)')
  .action((date) => {
    if (date) {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        console.error('❌ Invalid date format. Please use yyyy-mm-dd format (e.g., 2025-06-18)');
        process.exit(1);
      }
      
      // Validate that it's a valid date
      const [year, month, day] = date.split('-').map(Number);
      const testDate = new Date(year, month - 1, day);
      if (testDate.getFullYear() !== year || testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
        console.error('❌ Invalid date. Please provide a valid date in yyyy-mm-dd format');
        process.exit(1);
      }
      
      console.log(`📝 Creating daily log entry for ${date}...`);
    } else {
      console.log('📝 Creating daily log entry for today...');
    }
    
    // Find the onigiri-press package directory
    const packageDir = path.dirname(__dirname);
    const logScript = path.join(packageDir, 'src', 'scripts', 'create-daily-log.ts');
    
    try {
      // Pass the date argument to the script if provided
      const command = date 
        ? `npx tsx "${logScript}" "${date}"` 
        : `npx tsx "${logScript}"`;
        
      execSync(command, { 
        stdio: 'inherit', 
        cwd: process.cwd(),
        env: { ...process.env, NODE_PATH: packageDir }
      });
      console.log('✅ Daily log entry created successfully!');
    } catch (error) {
      console.error('❌ Failed to create daily log entry');
      console.error('Error details:', error.message);
      process.exit(1);
    }
  });

program
  .command('update')
  .alias('u')
  .description('Update OnigiriPress to the latest version')
  .option('--check', 'Check for updates without installing')
  .option('--beta', 'Include beta/prerelease versions')
  .action(async (options) => {
    console.log('🔍 Checking for OnigiriPress updates...');
    
    try {
      // Get current version
      const packageDir = path.dirname(__dirname);
      const packageJsonPath = path.join(packageDir, 'package.json');
      const currentPackage = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const currentVersion = currentPackage.version;
      
      console.log(`📦 Current version: ${currentVersion}`);
      
      // Check latest version from npm
      console.log('🌐 Fetching latest version from npm...');
      let versionFlag = options.beta ? '--tag beta' : '';
      const npmViewCmd = `npm view onigiri-press version ${versionFlag}`.trim();
      
      let latestVersion;
      try {
        latestVersion = execSync(npmViewCmd, { 
          encoding: 'utf8',
          stdio: 'pipe'
        }).trim();
      } catch (error) {
        if (options.beta) {
          console.log('⚠️ No beta version found, checking stable...');
          latestVersion = execSync('npm view onigiri-press version', { 
            encoding: 'utf8',
            stdio: 'pipe'
          }).trim();
        } else {
          throw error;
        }
      }
      
      console.log(`🚀 Latest version: ${latestVersion}`);
      
      // Compare versions
      if (currentVersion === latestVersion) {
        console.log('✅ You are already on the latest version!');
        return;
      }
      
      // Show version comparison
      const isNewer = compareVersions(latestVersion, currentVersion);
      if (isNewer) {
        console.log(`📈 Update available: ${currentVersion} → ${latestVersion}`);
        
        // Show changelog if available
        try {
          console.log('\n📝 Recent changes:');
          const changelogCmd = `npm view onigiri-press --json`;
          const packageInfo = JSON.parse(execSync(changelogCmd, { 
            encoding: 'utf8',
            stdio: 'pipe'
          }));
          
          if (packageInfo.description) {
            console.log(`   ${packageInfo.description}`);
          }
          if (packageInfo.homepage) {
            console.log(`   📚 Docs: ${packageInfo.homepage}`);
          }
        } catch (error) {
          // Ignore changelog errors
        }
        
        if (options.check) {
          console.log('\n💡 Run "ongr update" to install the latest version');
          return;
        }
        
        // Confirm update
        console.log('\n🔄 Updating OnigiriPress...');
        
        // Update globally if installed globally, otherwise update locally
        let updateCmd;
        try {
          // Check if installed globally
          execSync('npm list -g onigiri-press', { stdio: 'pipe' });
          updateCmd = `npm install -g onigiri-press@${latestVersion}`;
          console.log('📦 Updating global installation...');
        } catch (error) {
          // Not installed globally, update locally
          updateCmd = `npm install onigiri-press@${latestVersion}`;
          console.log('📦 Updating local installation...');
        }
        
        execSync(updateCmd, { stdio: 'inherit' });
        
        console.log('✅ OnigiriPress updated successfully!');
        console.log(`🎉 Updated from ${currentVersion} to ${latestVersion}`);
        console.log('\n💡 Tips:');
        console.log('   • Run "ongr --version" to verify the update');
        console.log('   • Check the documentation for any breaking changes');
        console.log('   • Consider updating your project dependencies');
        
      } else {
        console.log(`⚠️ You are running a newer version than the latest release`);
        console.log(`   Current: ${currentVersion}, Latest: ${latestVersion}`);
      }
      
    } catch (error) {
      console.error('❌ Failed to check for updates');
      console.error('💡 Make sure you have internet connection and npm is working');
      console.error('Error details:', error.message);
      process.exit(1);
    }
  });

// Helper function to compare semantic versions
function compareVersions(version1, version2) {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part > v2part) return true;
    if (v1part < v2part) return false;
  }
  
  return false;
}

program.parse();
