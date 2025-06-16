#!/bin/bash

# OnigiriPress Distribution Builder
# This script creates a user-friendly distribution package

set -e

echo "🍙 Building OnigiriPress Distribution Package..."

# Define variables
DIST_DIR="onigiri-press-dist"
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="onigiri-press-v${VERSION}"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf $DIST_DIR
rm -rf ${PACKAGE_NAME}.zip

# Create distribution directory
echo "📁 Creating distribution structure..."
mkdir -p $DIST_DIR

# Build the project first
echo "🔨 Building OnigiriPress..."
npm run build

# Copy user-facing files
echo "📋 Copying user files..."
cp config.template.yaml $DIST_DIR/config.yaml
cp -r public/ $DIST_DIR/
cp -r templates/ $DIST_DIR/
cp README.md $DIST_DIR/
cp LICENSE $DIST_DIR/

# Copy framework files
echo "⚙️ Copying framework files..."
cp -r src/ $DIST_DIR/
cp -r dist/ $DIST_DIR/dist/
cp package-npm.json $DIST_DIR/package.json
cp -r bin/ $DIST_DIR/
cp *.config.* $DIST_DIR/ 2>/dev/null || true
cp index.html $DIST_DIR/

# Create user-friendly scripts
echo "📜 Creating user scripts..."

# Create install script
cat > $DIST_DIR/install.sh << 'EOF'
#!/bin/bash
echo "🍙 Installing OnigiriPress..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $REQUIRED_VERSION or higher is required."
    echo "Current version: $NODE_VERSION"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ OnigiriPress installed successfully!"
echo ""
echo "🚀 Quick start:"
echo "  npm run dev     # Start development server"
echo "  npm run build   # Build for production"
echo "  npm run generate blog 'My First Post'  # Create new blog post"
echo ""
echo "📝 Edit config.yaml to customize your site"
echo "📁 Add content to public/content/"
EOF

# Create start script
cat > $DIST_DIR/start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting OnigiriPress development server..."
npm run dev
EOF

# Create build script
cat > $DIST_DIR/build.sh << 'EOF'
#!/bin/bash
echo "🔨 Building OnigiriPress for production..."
npm run build
echo "✅ Build complete! Files are in the 'dist' directory."
EOF

# Make scripts executable
chmod +x $DIST_DIR/*.sh

# Create user documentation
cat > $DIST_DIR/QUICKSTART.md << 'EOF'
# 🍙 OnigiriPress Quick Start

## Installation

1. Run the install script:
   ```bash
   ./install.sh
   ```

2. Start development server:
   ```bash
   ./start.sh
   # or
   npm run dev
   ```

3. Visit http://localhost:5173

## Customization

1. **Edit your info**: Update `config.yaml`
2. **Add content**: Put markdown files in `public/content/`
3. **Add images**: Put images in `public/` folders
4. **Create posts**: Run `npm run generate blog "Post Title"`

## Building for Production

```bash
./build.sh
# or
npm run build
```

Files will be generated in the `dist/` directory.

## Structure

```
├── config.yaml         # 👈 Edit this to customize your site
├── public/             # 👈 Add your content and images here
│   ├── content/
│   │   ├── blogs/      # Your blog posts
│   │   └── projects/   # Your projects
│   ├── background/     # Background images
│   └── schools/        # Logo images
├── templates/          # Templates for new content
└── src/               # Framework code (don't edit)
```

## Need Help?

- Check the documentation: [GitHub Repository]
- Open an issue: [Issues Page]
EOF

# Create .gitignore for users
cat > $DIST_DIR/.gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json

# Build output
dist/

# Environment files
.env
.env.local
.env.production

# Editor files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/
EOF

echo "📦 Creating zip package..."
cd $DIST_DIR/..
zip -r ${PACKAGE_NAME}.zip $DIST_DIR/

echo "✅ Distribution package created: ${PACKAGE_NAME}.zip"
echo ""
echo "📋 Package contents:"
echo "  - User configuration: config.yaml"
echo "  - Content directory: public/"
echo "  - Templates: templates/"
echo "  - Framework source: src/"
echo "  - Installation scripts: install.sh, start.sh, build.sh"
echo "  - Documentation: QUICKSTART.md"
echo ""
echo "🚀 Users can now:"
echo "  1. Extract the zip file"
echo "  2. Run ./install.sh"
echo "  3. Run ./start.sh"
echo "  4. Edit config.yaml and add content"
