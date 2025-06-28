# Publishing Scripts

Simple automated script for version management and npm publishing.

## Available Scripts

### NPM Scripts (Recommended)
```bash
# Version bumping and publishing
npm run publish:patch      # Patch version (1.0.0 -> 1.0.1)
npm run publish:minor      # Minor version (1.0.0 -> 1.1.0)
npm run publish:major      # Major version (1.0.0 -> 2.0.0)
npm run publish:prerelease # Prerelease version (1.0.0 -> 1.0.1-0)

# Dry run to see what would happen
npm run publish:dry

# Version bumping only (no publish)
npm run version:patch
npm run version:minor
npm run version:major
```

### Direct Script Usage
```bash
node scripts/publish.js patch          # Bump patch version and publish
node scripts/publish.js minor --dry-run # Show what would happen
```

## What the Script Does

**Simple and focused:**
1. **Update package.json version** using `npm version`
2. **Update package-user.json** onigiri-press dependency to match
3. **Update CLI version** in `bin/onigiri-press.js`  
4. **Publish to npm** using `npm publish`

That's it! No complex checks, no git operations, just version updates and publish.

## Version Types

- **patch**: Bug fixes and small improvements (1.0.0 → 1.0.1)
- **minor**: New features that don't break existing functionality (1.0.0 → 1.1.0)
- **major**: Breaking changes (1.0.0 → 2.0.0)
- **prerelease**: Pre-release versions for testing (1.0.0 → 1.0.1-0)

## Options

- `--dry-run`: Show what would be done without executing
- `--help`: Show help message

## Examples

### Quick Patch Release
```bash
npm run publish:patch
```

### Test What Would Happen
```bash
npm run publish:dry
```

### Major Release
```bash
npm run publish:major
```
