# Onigiri-Press Project

Welcome to Onigiri-Press! This is a modern static site generation framework designed for creating personal portfolios and blogs.

## Installation & Setup

### Step 1: Install Onigiri-Press Globally

First, install Onigiri-Press globally on your system:

```bash
npm install -g onigiri-press
```

### Step 2: Initialize a New Project

Create a new Onigiri-Press project:

```bash
ongr init my-portfolio
cd my-portfolio
```

### Step 3: Install Dependencies

After initializing your project, install the necessary dependencies:

```bash
npm install
```

## Quick Start Commands

Here are some basic commands to get you started with Onigiri-Press:

### Development Server

Start a local development server to preview your site in real-time:

```bash
ongr dev
```

### Build Website

Generate a production build for deployment:

```bash
ongr build
```

### Deploy to GitHub Pages

Deploy your site to GitHub Pages:

```bash
ongr deploy
```

## Content Management

### Create a New Blog Post

```bash
ongr g b "My New Blog Post"
# or
ongr generate blog "My New Blog Post"
```

### Create a New Project

```bash
ongr g p "My New Project"
# or
ongr generate project "My New Project"
```

### Reload Content

After adding or modifying content, reload the content data:

```bash
ongr load
# or
ongr l
```

## Configuration

You can customize your site by editing:

- `config.yaml` - Main site configuration
- `onigiri.config.json` - Build and deployment settings

## Documentation

For more information about customizing your Onigiri-Press site, check the documentation in the `docs/` directory.

## Project Structure

- `public/` - Static assets and content
  - `content/blogs/` - Blog posts
  - `content/projects/` - Projects
  - `data/` - Generated data files
- `templates/` - Content templates
- `docs/` - Documentation

Happy creating with Onigiri-Press! 🍙

### Reprocess Content

When you modify content files, you need to reprocess them:

```bash
ongr load
```

## Configuration

You can configure your site by editing the following files:

- `config.yaml` - Main site configuration
- `onigiri.config.json` - Build and deployment configuration

## More Resources

- [Onigiri-Press Documentation](https://github.com/HuJacobJiabao/onigiri-press)
- [Issue Reporting](https://github.com/HuJacobJiabao/onigiri-press/issues)

---

Powered by [Onigiri-Press](https://github.com/HuJacobJiabao/onigiri-press) 🍙
