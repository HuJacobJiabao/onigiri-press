# OnigiriPress CLI Usage

After installing OnigiriPress globally:

```bash
npm install -g onigiri-press
```

## Commands

### Initialize a new project
```bash
ongr init my-portfolio
cd my-portfolio
npm install
```

### Development
```bash
ongr dev          # Start development server
```

### Build for production
```bash
ongr build        # Build static files
```

### Generate content
```bash
ongr generate blog "My New Blog Post"
ongr generate project "Awesome Project"

# Aliases available:
ongr g blog "My Blog"     # g for generate
ongr g b "My Blog"        # b for blog
ongr g p "My Project"     # p for project
```

### Load and preprocess content
```bash
ongr load         # Load and preprocess all content files
ongr l            # Short alias for load
```

### Deploy to GitHub Pages
```bash
ongr deploy       # Build and deploy to GitHub Pages
ongr d            # Short alias for deploy
```

## Project Structure

After initialization, users only need to interact with:

- `config.yaml` - Main configuration file
- `public/` - Content and assets
- `templates/` - Content templates

The framework handles the rest automatically!
