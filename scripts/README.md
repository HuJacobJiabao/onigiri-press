# Publishing Scripts

This directory contains automated scripts for version management and npm publishing.

## Available Scripts

### 1. Bash Script (`publish.sh`)
Cross-platform bash script for automated publishing.

```bash
# Make executable (first time only)
chmod +x scripts/publish.sh

# Usage examples
./scripts/publish.sh patch                    # Bump patch version and publish
./scripts/publish.sh minor --dry-run          # Show what would happen
./scripts/publish.sh major --tag beta         # Publish with custom tag
./scripts/publish.sh prerelease --skip-tests  # Skip tests during publish
```

### 2. Node.js Script (`publish.js`)
Node.js version for better cross-platform compatibility.

```bash
# Usage examples
node scripts/publish.js patch                 # Bump patch version and publish
node scripts/publish.js minor --dry-run       # Show what would happen
node scripts/publish.js major --tag beta      # Publish with custom tag
node scripts/publish.js prerelease --skip-tests # Skip tests during publish
```

### 3. NPM Scripts (Recommended)
Use the predefined npm scripts for common tasks:

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

## Version Types

- **patch**: Bug fixes and small improvements (1.0.0 → 1.0.1)
- **minor**: New features that don't break existing functionality (1.0.0 → 1.1.0)
- **major**: Breaking changes (1.0.0 → 2.0.0)
- **prerelease**: Pre-release versions for testing (1.0.0 → 1.0.1-0)

## Available Options

- `--dry-run`: Show what would be done without executing
- `--skip-tests`: Skip running tests before publishing
- `--skip-build`: Skip building the project
- `--tag <tag>`: Specify npm tag (default: latest)
- `--help`: Show help message

## What the Scripts Do

1. **Version Validation**: Checks current version and calculates new version
2. **Prerequisites Check**: Ensures git repository and package.json exist
3. **Uncommitted Changes**: Warns about uncommitted changes
4. **Testing**: Runs `npm run test` or `npm run test:ci` (unless skipped)
5. **Building**: Runs `npm run build` (unless skipped)
6. **Distribution**: Runs `scripts/create-distribution.sh` if it exists
7. **Package User Update**: Updates `package-user.json` with new onigiri-press version
8. **Git Operations**: 
   - Commits version bump (includes package.json and package-user.json)
   - Creates git tag
   - Pushes to origin
9. **NPM Publishing**: Publishes to npm registry
10. **Success Notification**: Shows completion message and package URL

## Key Features

### Automatic Package User Update
The scripts automatically update the `onigiri-press` dependency version in `package-user.json` when publishing. This ensures that the example project configuration stays in sync with the latest published version.

**What gets updated:**
- `package.json` - Main package version
- `package-user.json` - Example project's onigiri-press dependency version
- Both files are committed together in the same release commit

## Examples

### Quick Patch Release
```bash
npm run publish:patch
```

### Test What Would Happen
```bash
npm run publish:dry
```

### Major Release with Custom Tag
```bash
node scripts/publish.js major --tag next
```

### Skip Tests for Quick Fix
```bash
./scripts/publish.sh patch --skip-tests
```

### Manual Version Bump Only
```bash
npm run version:minor
git add package.json
git commit -m "chore: bump version"
```

## Troubleshooting

### Common Issues

1. **"Not a git repository"**: Initialize git first with `git init`
2. **"Build failed"**: Fix build errors before publishing
3. **"Tests failed"**: Fix tests or use `--skip-tests` flag
4. **"Uncommitted changes"**: Commit changes or stash them first
5. **"Permission denied"**: Make sure you're logged into npm (`npm login`)

### Manual Recovery

If a publish fails partway through:

```bash
# Reset version if needed
git reset --hard HEAD~1
git tag -d v1.x.x  # Delete the tag if created

# Or continue from where it failed
git push origin main --tags  # If git operations succeeded
npm publish                  # If only npm publish failed
```

## Security Notes

- Never commit npm tokens to the repository
- Use `.npmrc` for authentication configuration
- Consider using npm 2FA for additional security
- Review changes before publishing with `--dry-run`
