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
```

## Project Structure

After initialization, users only need to interact with:

- `config.yaml` - Main configuration file
- `public/` - Content and assets
- `templates/` - Content templates

The framework handles the rest automatically!
