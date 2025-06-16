# 🍙 OnigiriPress

> A modern, lightweight portfolio and blog framework built with React, TypeScript, and Vite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646cff.svg)](https://vitejs.dev/)

**OnigiriPress** is a beautiful, responsive framework that makes it easy to create portfolios, blogs, and professional websites. Built with modern web technologies, it offers excellent performance, powerful content management, and a delightful developer experience.

## ✨ Features

- 🚀 **Modern Tech Stack**: React 19, TypeScript, Vite for lightning-fast development
- 📱 **Fully Responsive**: Beautiful on desktop, tablet, and mobile devices
- 📝 **Markdown Blog**: Write posts in markdown with syntax highlighting and math support
- 🎨 **Highly Customizable**: YAML configuration, CSS variables, and modular components
- 🔍 **SEO Optimized**: Meta tags, structured data, and social media integration
- ⚡ **Performance First**: Code splitting, lazy loading, and optimized builds
- 🌙 **Dark Mode Ready**: Easy to implement dark/light theme switching
- 🎵 **Audio Player**: Optional background music integration
- 📊 **Analytics Ready**: Google Analytics and other tracking tools support
- 🚀 **Deploy Anywhere**: GitHub Pages, Vercel, Netlify, and more

## 🎯 Perfect For

- **Developers** showcasing their projects and skills
- **Designers** displaying their portfolio and creative work
- **Students** creating academic and project portfolios
- **Professionals** building their personal brand online
- **Bloggers** sharing knowledge and experiences

## 🚀 Quick Start

Get your portfolio up and running in under 5 minutes!

### Option 1: Use This Template (Recommended)

1. Click the "Use this template" button on GitHub
2. Clone your new repository
3. Install dependencies and start developing

```bash
git clone https://github.com/yourusername/your-portfolio.git
cd your-portfolio
npm install
npm run dev
```

### Option 2: Fork or Download

```bash
git clone https://github.com/yourusername/onigiri-press.git
cd onigiri-press
npm install
npm run dev
```

Your portfolio will be running at `http://localhost:5173` 🎉

## 📖 Documentation

- 📚 **[Framework Overview](ONIGIRI_FRAMEWORK.md)** - Complete framework documentation
- 🚀 **[Quick Start Guide](docs/quick-start.md)** - Get started in minutes
- 🎨 **[Customization Guide](docs/customization.md)** - Make it your own
- 🌐 **[Deployment Guide](docs/deployment.md)** - Deploy to any platform

## 🎨 Customization

Onigiri is designed to be easily customizable. Here's how to make it yours:

### 1. Update Your Information

Edit `config.yaml`:

```yaml
website:
  title: "Your Name"
  description: "Your professional description"

home:
  hero:
    name: "Your Full Name"
    title: "Your Professional Title"
    quote: "Your inspiring quote"
```

### 2. Add Your Content

- **Blog Posts**: Add markdown files to `public/content/blogs/`
- **Projects**: Add project files to `public/content/projects/`
- **Assets**: Place images and files in `public/`

### 3. Customize Styling

Override CSS variables in `src/index.css`:

```css
:root {
  --primary-color: #your-brand-color;
  --secondary-color: #your-secondary-color;
  --accent-color: #your-accent-color;
}
```

## 🏗️ Project Structure

```
onigiri-press/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── styles/             # CSS modules
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── hooks/              # Custom React hooks
├── public/
│   ├── content/            # Markdown content
│   │   ├── blogs/         # Blog posts
│   │   └── projects/      # Project files
│   ├── data/              # Generated data files
│   └── assets/            # Static assets
├── docs/                   # Documentation
├── templates/              # Content templates
└── ...config files
```

## 🛠️ Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy

# Process content files
npm run preprocess

# Generate new content
npm run generate

# Create daily log entry
npm run log
```

## 📝 Content Creation

### Blog Posts

Create a new blog post:

```markdown
---
title: "Your Blog Post Title"
date: "2025-06-15"
description: "Brief description of your post"
tags: ["tag1", "tag2"]
category: "Category"
---

# Your Content Here

Write your blog post content in markdown...
```

### Projects

Showcase your projects:

```markdown
---
title: "Project Name"
date: "2025-06-15"
description: "Project description"
tags: ["React", "TypeScript"]
tech_stack: ["React", "Node.js", "MongoDB"]
github: "https://github.com/yourusername/project"
demo: "https://project-demo.com"
---

# Project Details

Describe your project, challenges, and solutions...
```

## 🚀 Deployment

Deploy your portfolio to various platforms with ease:

### GitHub Pages (Free)

```bash
npm run deploy
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/onigiri-press)

### Netlify

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

See the [Deployment Guide](docs/deployment.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/amazing-feature`
5. Make your changes and test thoroughly
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing React framework
- **Vite Team** for the lightning-fast build tool
- **TypeScript Team** for making JavaScript better
- **Open Source Community** for inspiration and tools

## 📞 Support & Community

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/onigiri-press/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/onigiri-press/discussions)
- 📧 **Email**: support@onigiri-press.dev
- 🐦 **Twitter**: [@OnigiriPress](https://twitter.com/OnigiriPress)

## 🌟 Showcase

Share your portfolio built with OnigiriPress! We'd love to feature it:

- Tag us on social media
- Open a discussion with your portfolio URL
- Submit a PR to add your site to our showcase

---

<p align="center">
  Made with ❤️ by the OnigiriPress community<br>
  <a href="https://github.com/yourusername/onigiri-press">⭐ Star us on GitHub</a>
</p>
