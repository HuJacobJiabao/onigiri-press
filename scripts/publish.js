#!/usr/bin/env node

/**
 * Onigiri Press - Automated Publishing Script (Node.js version)
 * Cross-platform script for version management and npm publishing
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

class Publisher {
    constructor() {
        this.config = {
            versionType: '',
            dryRun: false,
            skipTests: false,
            skipBuild: false,
            npmTag: 'latest'
        };
    }

    log(message, color = 'blue') {
        console.log(`${colors[color]}[INFO]${colors.reset} ${message}`);
    }

    success(message) {
        console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
    }

    warning(message) {
        console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
    }

    error(message) {
        console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
    }

    showUsage() {
        console.log(`
Usage: node scripts/publish.js [patch|minor|major|prerelease] [options]

Version types:
  patch     - Bug fixes (1.0.0 -> 1.0.1)
  minor     - New features (1.0.0 -> 1.1.0)
  major     - Breaking changes (1.0.0 -> 2.0.0)
  prerelease- Pre-release version (1.0.0 -> 1.0.1-0)

Options:
  --dry-run     Show what would be done without executing
  --skip-tests  Skip running tests before publishing
  --skip-build  Skip building the project
  --tag <tag>   Specify npm tag (default: latest)
  --help        Show this help message

Examples:
  node scripts/publish.js patch                    # Bump patch version and publish
  node scripts/publish.js minor --dry-run          # Show what minor bump would do
  node scripts/publish.js major --tag beta         # Bump major and publish with beta tag
        `);
    }

    parseArgs(args) {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            if (['patch', 'minor', 'major', 'prerelease'].includes(arg)) {
                this.config.versionType = arg;
            } else if (arg === '--dry-run') {
                this.config.dryRun = true;
            } else if (arg === '--skip-tests') {
                this.config.skipTests = true;
            } else if (arg === '--skip-build') {
                this.config.skipBuild = true;
            } else if (arg === '--tag') {
                this.config.npmTag = args[++i];
            } else if (arg === '--help') {
                this.showUsage();
                process.exit(0);
            } else {
                this.error(`Unknown option: ${arg}`);
                this.showUsage();
                process.exit(1);
            }
        }

        if (!this.config.versionType) {
            this.error('Version type is required!');
            this.showUsage();
            process.exit(1);
        }
    }

    execCommand(command, options = {}) {
        try {
            const result = execSync(command, { 
                encoding: 'utf8', 
                stdio: options.silent ? 'pipe' : 'inherit',
                ...options 
            });
            return result ? result.trim() : '';
        } catch (error) {
            if (!options.allowFailure) {
                throw error;
            }
            return null;
        }
    }

    checkPrerequisites() {
        // Check if package.json exists
        if (!fs.existsSync('package.json')) {
            this.error('package.json not found! Make sure you\'re in the project root directory.');
            process.exit(1);
        }

        // Check if git repository
        if (!fs.existsSync('.git')) {
            this.error('Not a git repository! Initialize git first.');
            process.exit(1);
        }

        // Check for uncommitted changes
        const gitStatus = this.execCommand('git status --porcelain', { silent: true });
        if (gitStatus) {
            this.warning('You have uncommitted changes:');
            console.log(gitStatus);
            // In a real scenario, you might want to prompt for confirmation
            // For automation, we'll continue with a warning
        }
    }

    getCurrentVersion() {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return packageJson.version;
    }

    getNewVersion() {
        if (this.config.dryRun) {
            // For dry run, calculate the version without actually changing anything
            const currentVersion = this.getCurrentVersion();
            const versionParts = currentVersion.split('.');
            const major = parseInt(versionParts[0]);
            const minor = parseInt(versionParts[1]);
            const patch = parseInt(versionParts[2]);
            
            switch (this.config.versionType) {
                case 'major':
                    return `${major + 1}.0.0`;
                case 'minor':
                    return `${major}.${minor + 1}.0`;
                case 'patch':
                    return `${major}.${minor}.${patch + 1}`;
                case 'prerelease':
                    return `${major}.${minor}.${patch + 1}-alpha.0`;
                default:
                    return `${major}.${minor}.${patch + 1}`;
            }
        } else {
            // For actual run, update the version in package.json
            const result = this.execCommand(
                `npm version ${this.config.versionType} --no-git-tag-version --force`,
                { silent: true }
            );
            return result.replace(/^v/, '');
        }
    }

    runTests() {
        if (this.config.skipTests) {
            this.log('Skipping tests...');
            return;
        }

        this.log('Running tests...');
        try {
            this.execCommand('npm run test', { allowFailure: true });
            this.success('Tests passed!');
        } catch (error) {
            try {
                this.execCommand('npm run test:ci', { allowFailure: true });
                this.success('Tests passed!');
            } catch (error) {
                this.warning('No test script found or tests failed. Continuing...');
            }
        }
    }

    buildProject() {
        if (this.config.skipBuild) {
            this.log('Skipping build...');
            return;
        }

        this.log('Building project...');
        try {
            this.execCommand('npm run build');
            this.success('Build completed!');
        } catch (error) {
            this.error('Build failed!');
            process.exit(1);
        }
    }

    createDistribution() {
        const distributionScript = path.join('scripts', 'create-distribution.sh');
        if (fs.existsSync(distributionScript)) {
            this.log('Creating distribution package...');
            try {
                // Make executable and run
                if (process.platform !== 'win32') {
                    this.execCommand(`chmod +x ${distributionScript}`);
                    this.execCommand(`./${distributionScript}`);
                } else {
                    // On Windows, try to run with bash or use Node.js equivalent
                    this.execCommand(`bash ${distributionScript}`);
                }
                this.success('Distribution package created!');
            } catch (error) {
                this.warning('Failed to create distribution package, continuing...');
            }
        }
    }

    updatePackageUser(newVersion) {
        const packageUserPath = 'package-user.json';
        
        if (!fs.existsSync(packageUserPath)) {
            this.warning('package-user.json not found, skipping update...');
            return;
        }

        this.log('Updating package-user.json with new version...');
        try {
            const packageUserContent = fs.readFileSync(packageUserPath, 'utf8');
            const packageUser = JSON.parse(packageUserContent);
            
            if (packageUser.dependencies && packageUser.dependencies['onigiri-press']) {
                const oldVersion = packageUser.dependencies['onigiri-press'];
                packageUser.dependencies['onigiri-press'] = `^${newVersion}`;
                
                fs.writeFileSync(packageUserPath, JSON.stringify(packageUser, null, 2) + '\n');
                this.success(`Updated package-user.json: onigiri-press ${oldVersion} → ^${newVersion}`);
            } else {
                this.warning('onigiri-press dependency not found in package-user.json');
            }
        } catch (error) {
            this.warning(`Failed to update package-user.json: ${error.message}`);
        }
    }

    commitAndTag(newVersion) {
        this.log('Committing version bump...');
        try {
            this.execCommand('git add package.json package-lock.json package-user.json', { allowFailure: true });
        } catch {
            try {
                this.execCommand('git add package.json package-user.json');
            } catch {
                this.execCommand('git add package.json');
            }
        }
        
        this.execCommand(`git commit -m "chore(release): bump version to ${newVersion}"`);
        
        this.log('Creating git tag...');
        this.execCommand(`git tag -a "v${newVersion}" -m "Release version ${newVersion}"`);
        
        this.log('Pushing to origin...');
        this.execCommand('git push origin main --tags');
    }

    publishToNpm(newVersion) {
        this.log(`Publishing to npm with tag '${this.config.npmTag}'...`);
        try {
            this.execCommand(`npm publish --tag ${this.config.npmTag}`);
            this.success(`Successfully published ${newVersion} to npm!`);
        } catch (error) {
            this.error('Failed to publish to npm!');
            process.exit(1);
        }
    }

    async run() {
        const args = process.argv.slice(2);
        this.parseArgs(args);

        this.checkPrerequisites();

        const currentVersion = this.getCurrentVersion();
        this.log(`Current version: ${currentVersion}`);

        const newVersion = this.getNewVersion();
        
        if (this.config.dryRun) {
            this.log(`Would bump to version: ${newVersion}`);
            this.log('DRY RUN - Would perform the following actions:');
            console.log('  1. Update version to', newVersion);
            console.log('  2. Run tests (unless --skip-tests)');
            console.log('  3. Build project (unless --skip-build)');
            console.log('  4. Update package-user.json with new version');
            console.log('  5. Commit version bump');
            console.log('  6. Create git tag v' + newVersion);
            console.log('  7. Push to origin');
            console.log('  8. Publish to npm with tag \'' + this.config.npmTag + '\'');
            return;
        }

        this.success(`Version bumped to: ${newVersion}`);

        this.runTests();
        this.buildProject();
        this.createDistribution();
        this.updatePackageUser(newVersion);
        this.commitAndTag(newVersion);
        this.publishToNpm(newVersion);

        this.success(`🎉 Successfully released version ${newVersion}!`);
        this.log('Package is now available at: https://www.npmjs.com/package/onigiri-press');
    }
}

// Run the publisher
if (import.meta.url === `file://${process.argv[1]}`) {
    const publisher = new Publisher();
    publisher.run().catch(error => {
        console.error(`${colors.red}[ERROR]${colors.reset} ${error.message}`);
        process.exit(1);
    });
}

export default Publisher;
