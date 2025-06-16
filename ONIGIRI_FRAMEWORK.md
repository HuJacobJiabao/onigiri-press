# 🍙 OnigiriPress - Modern Portfolio & Blog Framework

**OnigiriPress** is a lightweight, modern portfolio and blog framework built with React, TypeScript, and Vite. It provides everything you need to create beautiful, responsive websites with powerful content management capabilities and minimal setup.

## 🌟 Why OnigiriPress?

OnigiriPress combines the simplicity of Onigiri (おにぎり - "rice ball" in Japanese) with the power of a publishing platform. Just like its namesake, this framework is:

- **Simple**: Clean, intuitive structure that's easy to understand and customize
- **Portable**: Deploy anywhere with static hosting support
- **Satisfying**: Beautiful results with minimal effort

## ✨ Key Features

### 🏗️ **Modern Architecture**
- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast builds and hot reload
- **CSS Modules** for scoped styling
- **Component-driven** architecture

### 📝 **Content Management**
- **Markdown-first** blog and project system
- **Frontmatter support** for metadata
- **Automatic content preprocessing** and static generation
- **Asset co-location** with markdown files

### 🎨 **Rich Content Features**
- **Syntax highlighting** with Prism.js (Night Owl theme)
- **Math equations** with KaTeX support
- **Interactive code blocks** with copy-to-clipboard
- **Table of contents** auto-generation
- **Footnotes and task lists**

### 📱 **Responsive Design**
- **Mobile-first** approach
- **CSS Grid & Flexbox** layouts
- **Smooth animations** and transitions
- **Dark/light theme** support ready

### ⚡ **Performance Optimized**
- **Static site generation** for fast loading
- **Lazy loading** for images
- **Code splitting** and tree shaking
- **SEO optimized** with proper meta tags

### 🚀 **Developer Experience**
- **Hot reload** development
- **TypeScript** for better IDE support
- **ESLint** configuration included
- **Automated daily logging** system
- **GitHub Actions** CI/CD ready

## 📁 Project Structure

```
onigiri-portfolio/
├── public/                 # Static assets and content
│   ├── content/           # Markdown content
│   │   ├── blogs/         # Blog posts
│   │   └── projects/      # Project showcases
│   ├── background/        # Background images
│   └── data/              # Generated JSON data
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route components
│   ├── styles/           # CSS modules
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── config/           # Configuration files
│   └── scripts/          # Build and dev scripts
└── .github/
    └── workflows/        # GitHub Actions CI/CD
```

## 🚀 Quick Start

### 1. **Setup Your Portfolio**

```bash
# Clone the Onigiri framework
git clone https://github.com/your-username/onigiri-portfolio.git my-portfolio
cd my-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. **Configure Your Site**

Edit `config.yaml`:

```yaml
profile:
  name: "Your Name"
  title: "Your Title"
  description: "Your description"

navigation:
  - { name: "Home", path: "/" }
  - { name: "Projects", path: "/projects" }
  - { name: "Blogs", path: "/blogs" }

theme:
  primaryColor: "#your-color"
```

### 3. **Add Your Content**

Create blog posts in `public/content/blogs/`:

```markdown
---
title: "My First Post"
date: "2025-06-15"
description: "This is my first blog post"
tags: ["blog", "intro"]
---

# Welcome to My Blog

Your content here...
```

### 4. **Deploy**

```bash
# Build for production
npm run build

# Deploy to GitHub Pages (or any static host)
npm run deploy
```

## 🛠️ Customization

### **Styling**
- Modify CSS modules in `src/styles/`
- Update theme colors in `config.yaml`
- Add custom components in `src/components/`

### **Content Types**
- Add new content types by extending the preprocessing scripts
- Customize markdown rendering in `src/utils/markdown.ts`
- Configure routing in `src/App.tsx`

### **Components**
- All components are modular and customizable
- Use TypeScript interfaces for type safety
- Follow the existing component patterns

## 📚 Documentation

### **Content Creation**
- [Writing Blog Posts](docs/blog-posts.md)
- [Creating Projects](docs/projects.md)
- [Asset Management](docs/assets.md)

### **Customization**
- [Theme Configuration](docs/theming.md)
- [Component Development](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### **Development**
- [Development Workflow](docs/development.md)
- [Build Process](docs/build.md)
- [Contributing](docs/contributing.md)

## 🎯 Use Cases

**Perfect for:**
- 👨‍💻 Software developers
- 🎨 Designers and creatives
- 📝 Technical writers
- 🎓 Students and researchers
- 💼 Professionals needing a portfolio

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with love using:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [Prism.js](https://prismjs.com/)

---

**Made with 🍙 by [Your Name]**

*Onigiri - Simple, portable, satisfying portfolios for everyone.*
