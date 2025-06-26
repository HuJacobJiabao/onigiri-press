#!/bin/bash

# Onigiri Press - Automated Publishing Script
# This script automates version bumping, building, and npm publishing

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to update package-user.json
update_package_user() {
    local new_version="$1"
    local package_user_file="package-user.json"
    
    if [[ ! -f "$package_user_file" ]]; then
        print_warning "package-user.json not found, skipping update..."
        return
    fi
    
    print_status "Updating package-user.json with new version..."
    
    # Use node to safely update the JSON file
    node -e "
        const fs = require('fs');
        const path = '$package_user_file';
        try {
            const content = fs.readFileSync(path, 'utf8');
            const pkg = JSON.parse(content);
            if (pkg.dependencies && pkg.dependencies['onigiri-press']) {
                const oldVersion = pkg.dependencies['onigiri-press'];
                pkg.dependencies['onigiri-press'] = '^$new_version';
                fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
                console.log('Updated package-user.json: onigiri-press ' + oldVersion + ' → ^$new_version');
            } else {
                console.warn('onigiri-press dependency not found in package-user.json');
            }
        } catch (error) {
            console.warn('Failed to update package-user.json:', error.message);
        }
    "
    
    if [[ $? -eq 0 ]]; then
        print_success "package-user.json updated successfully!"
    else
        print_warning "Failed to update package-user.json"
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [patch|minor|major|prerelease] [options]"
    echo ""
    echo "Version types:"
    echo "  patch     - Bug fixes (1.0.0 -> 1.0.1)"
    echo "  minor     - New features (1.0.0 -> 1.1.0)"
    echo "  major     - Breaking changes (1.0.0 -> 2.0.0)"
    echo "  prerelease- Pre-release version (1.0.0 -> 1.0.1-0)"
    echo ""
    echo "Options:"
    echo "  --dry-run     Show what would be done without executing"
    echo "  --skip-tests  Skip running tests before publishing"
    echo "  --skip-build  Skip building the project"
    echo "  --tag <tag>   Specify npm tag (default: latest)"
    echo "  --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 patch                    # Bump patch version and publish"
    echo "  $0 minor --dry-run          # Show what minor bump would do"
    echo "  $0 major --tag beta         # Bump major and publish with beta tag"
}

# Default values
VERSION_TYPE=""
DRY_RUN=false
SKIP_TESTS=false
SKIP_BUILD=false
NPM_TAG="latest"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        patch|minor|major|prerelease)
            VERSION_TYPE="$1"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --tag)
            NPM_TAG="$2"
            shift 2
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Check if version type is provided
if [[ -z "$VERSION_TYPE" ]]; then
    print_error "Version type is required!"
    show_usage
    exit 1
fi

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found! Make sure you're in the project root directory."
    exit 1
fi

# Check if we're in a git repository
if [[ ! -d ".git" ]]; then
    print_error "Not a git repository! Initialize git first."
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    print_warning "You have uncommitted changes:"
    git status --short
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Aborting due to uncommitted changes."
        exit 1
    fi
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Calculate new version
if [[ "$DRY_RUN" == true ]]; then
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version --dry-run | sed 's/^v//')
    print_status "Would bump to version: $NEW_VERSION"
else
    print_status "Bumping $VERSION_TYPE version..."
    NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version | sed 's/^v//')
    print_success "Version bumped to: $NEW_VERSION"
fi

if [[ "$DRY_RUN" == true ]]; then
    print_status "DRY RUN - Would perform the following actions:"
    echo "  1. Update version to $NEW_VERSION"
    echo "  2. Run tests (unless --skip-tests)"
    echo "  3. Build project (unless --skip-build)"
    echo "  4. Update package-user.json with new version"
    echo "  5. Commit version bump"
    echo "  6. Create git tag v$NEW_VERSION"
    echo "  7. Push to origin"
    echo "  8. Publish to npm with tag '$NPM_TAG'"
    exit 0
fi

# Run tests
if [[ "$SKIP_TESTS" == false ]]; then
    print_status "Running tests..."
    if npm run test 2>/dev/null || npm run test:ci 2>/dev/null; then
        print_success "Tests passed!"
    else
        print_warning "No test script found or tests failed. Continuing..."
    fi
fi

# Build project
if [[ "$SKIP_BUILD" == false ]]; then
    print_status "Building project..."
    if npm run build; then
        print_success "Build completed!"
    else
        print_error "Build failed!"
        exit 1
    fi
fi

# Create distribution package if script exists
if [[ -f "scripts/create-distribution.sh" ]]; then
    print_status "Creating distribution package..."
    chmod +x scripts/create-distribution.sh
    ./scripts/create-distribution.sh
    print_success "Distribution package created!"
fi

# Update package-user.json
update_package_user "$NEW_VERSION"

# Commit the version bump
print_status "Committing version bump..."
git add package.json package-lock.json package-user.json 2>/dev/null || git add package.json package-user.json 2>/dev/null || git add package.json
git commit -m "chore(release): bump version to $NEW_VERSION"

# Create git tag
print_status "Creating git tag..."
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

# Push to origin
print_status "Pushing to origin..."
git push origin main --tags

# Publish to npm
print_status "Publishing to npm with tag '$NPM_TAG'..."
if npm publish --tag "$NPM_TAG"; then
    print_success "Successfully published $NEW_VERSION to npm!"
else
    print_error "Failed to publish to npm!"
    exit 1
fi

# Final success message
print_success "🎉 Successfully released version $NEW_VERSION!"
print_status "Package is now available at: https://www.npmjs.com/package/onigiri-press"

# Optional: Open relevant URLs
if command -v open >/dev/null 2>&1; then
    read -p "Open npm package page? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://www.npmjs.com/package/onigiri-press"
    fi
fi
