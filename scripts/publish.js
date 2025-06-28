#!/usr/bin/env node

/**
 * Simple Onigiri Press Publishing Script
 * 1. Update versions (package.json, package-user.json, bin/onigiri-press.js)
 * 2. Publish to npm
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m'
};

class Publisher {
    constructor() {
        this.versionType = '';
        this.dryRun = false;
    }

    log(message) {
        console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
    }

    success(message) {
        console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
    }

    error(message) {
        console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
    }

    showUsage() {
        console.log(`
Usage: node scripts/publish.js [patch|minor|major|prerelease] [--dry-run]

Examples:
  node scripts/publish.js patch          # Bump patch version and publish
  node scripts/publish.js minor --dry-run # Show what would happen
        `);
    }

    parseArgs(args) {
        for (const arg of args) {
            if (['patch', 'minor', 'major', 'prerelease'].includes(arg)) {
                this.versionType = arg;
            } else if (arg === '--dry-run') {
                this.dryRun = true;
            } else if (arg === '--help') {
                this.showUsage();
                process.exit(0);
            }
        }

        if (!this.versionType) {
            this.error('Version type is required!');
            this.showUsage();
            process.exit(1);
        }
    }

    execCommand(command, silent = false) {
        try {
            const result = execSync(command, { 
                encoding: 'utf8', 
                stdio: silent ? 'pipe' : 'inherit'
            });
            return result ? result.trim() : '';
        } catch (error) {
            throw error;
        }
    }

    updatePackageUser(newVersion) {
        const packageUserPath = 'package-user.json';
        
        if (!fs.existsSync(packageUserPath)) {
            return;
        }

        this.log('Updating package-user.json...');
        try {
            const packageUserContent = fs.readFileSync(packageUserPath, 'utf8');
            const packageUser = JSON.parse(packageUserContent);
            
            if (packageUser.dependencies && packageUser.dependencies['onigiri-press']) {
                packageUser.dependencies['onigiri-press'] = `^${newVersion}`;
                fs.writeFileSync(packageUserPath, JSON.stringify(packageUser, null, 2) + '\n');
                this.success(`Updated package-user.json to ^${newVersion}`);
            }
        } catch (error) {
            this.error(`Failed to update package-user.json: ${error.message}`);
        }
    }

    updateCLIVersion(newVersion) {
        const cliPath = 'bin/onigiri-press.js';
        
        if (!fs.existsSync(cliPath)) {
            return;
        }

        this.log('Updating CLI version...');
        try {
            const cliContent = fs.readFileSync(cliPath, 'utf8');
            const versionRegex = /\.version\(['"`]([^'"`]+)['"`]\)/;
            
            if (cliContent.match(versionRegex)) {
                const updatedContent = cliContent.replace(versionRegex, `.version('${newVersion}')`);
                fs.writeFileSync(cliPath, updatedContent);
                this.success(`Updated CLI version to ${newVersion}`);
            }
        } catch (error) {
            this.error(`Failed to update CLI version: ${error.message}`);
        }
    }

    updateVersions() {
        this.log(`Updating version from package.json...`);
        
        // Update package.json version
        const newVersion = this.execCommand(`npm version ${this.versionType} --no-git-tag-version`, true);
        const cleanVersion = newVersion.replace(/^v/, '');
        
        this.success(`Updated package.json to ${cleanVersion}`);
        
        // Update other files
        this.updatePackageUser(cleanVersion);
        this.updateCLIVersion(cleanVersion);
        
        return cleanVersion;
    }

    publish() {
        this.log('Publishing to npm...');
        try {
            this.execCommand('npm publish');
            this.success('🎉 Successfully published to npm!');
        } catch (error) {
            this.error('Failed to publish to npm!');
            throw error;
        }
    }

    run() {
        const args = process.argv.slice(2);
        this.parseArgs(args);

        const currentVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
        this.log(`Current version: ${currentVersion}`);

        if (this.dryRun) {
            // Calculate what the new version would be
            const versionParts = currentVersion.split('.');
            const major = parseInt(versionParts[0]);
            const minor = parseInt(versionParts[1]);
            const patch = parseInt(versionParts[2]);
            
            let newVersion;
            switch (this.versionType) {
                case 'major':
                    newVersion = `${major + 1}.0.0`;
                    break;
                case 'minor':
                    newVersion = `${major}.${minor + 1}.0`;
                    break;
                case 'patch':
                    newVersion = `${major}.${minor}.${patch + 1}`;
                    break;
                case 'prerelease':
                    newVersion = `${major}.${minor}.${patch + 1}-alpha.0`;
                    break;
            }
            
            this.log(`Would update to version: ${newVersion}`);
            this.log('DRY RUN - Would perform:');
            console.log('  1. Update package.json version');
            console.log('  2. Update package-user.json dependency');
            console.log('  3. Update CLI version in bin/onigiri-press.js');
            console.log('  4. Publish to npm');
            return;
        }

        try {
            const newVersion = this.updateVersions();
            this.publish();
            this.success(`🎉 Successfully released version ${newVersion}!`);
        } catch (error) {
            this.error(`Publish failed: ${error.message}`);
            process.exit(1);
        }
    }
}

// Run the publisher
if (import.meta.url === `file://${process.argv[1]}`) {
    const publisher = new Publisher();
    publisher.run();
}
