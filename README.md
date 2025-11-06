<div align="center">

  # 🍙 Onigiri Press
  <img src="public/favicon.png" alt="Onigiri Press Logo" width="120" height="120">
  
  **A Modern, Lightweight Portfolio & Blog Framework**
  
  *Built with React, TypeScript, and Vite*
  
  [![npm version](https://badge.fury.io/js/onigiri-press.svg)](https://www.npmjs.com/package/onigiri-press) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-19+-61dafb.svg)](https://reactjs.org/) [![Vite](https://img.shields.io/badge/Vite-6+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/) [![Markdown](https://img.shields.io/badge/Markdown-Support-000000.svg?logo=markdown)](https://github.com/markdown-it/markdown-it) [![Audio](https://img.shields.io/badge/🎵_Audio_Player-APlayer-FF6B35.svg)](https://github.com/MoePlayer/APlayer) [![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deploy-222222.svg?logo=github)](https://pages.github.com/)
  
</div>

---

## 🍙 What is Onigiri?

**Onigiri** (おにぎり) is a traditional Japanese rice ball - simple, portable, and satisfying. Just like the beloved food that inspired its name, Onigiri Press embodies the Japanese philosophy of simplicity, functionality, and thoughtful design.

Much like how onigiri wraps nutritious ingredients in perfectly seasoned rice, **Onigiri Press** wraps your content, projects, and ideas in a clean, efficient framework that's both beautiful and functional.

## 🚀 What is Onigiri Press?

**Onigiri Press** is a modern, lightweight portfolio and blog framework designed for developers, designers, and content creators who value:

- **Simplicity**: Clean, intuitive design that puts your content first
- **Performance**: Lightning-fast loading with optimized static generation
- **Flexibility**: Easy customization without compromising functionality
- **Developer Experience**: Modern tooling with TypeScript, React, and Vite

### ✨ Key Features

🎨 **Beautiful & Responsive Design**
- Modern, clean interface that works on all devices
- Customizable themes and layouts
- Smooth animations and transitions

📝 **Powerful Content Management**
- Markdown-based content with advanced features
- Support for blogs, projects, and portfolios
- Rich text formatting with syntax highlighting

⚡ **Performance Optimized**
- Static site generation for lightning-fast loading
- Optimized images and assets
- SEO-friendly structure

🛠️ **Developer Friendly**
- TypeScript support out of the box
- Hot reload development server
- Easy deployment to GitHub Pages, Netlify, Vercel

🎵 **Rich Media Support**
- Audio player integration (APlayer/MetingJS)
- Image galleries and carousels
- Video embedding support

📊 **Advanced Features**
- Math equations with KaTeX
- Code syntax highlighting with Prism
- Table of contents generation
- Tag and category filtering

---

## 🚀 Quick Start

### Global Installation

```bash
# Install Onigiri Press globally
npm install -g onigiri-press
```

### Create Your First Project

```bash
# Initialize a new project
ongr init my-awesome-portfolio

# Navigate to your project
cd my-awesome-portfolio

# Install dependencies
npm install

# Start development server
ongr dev
```

Your site will be available at `http://localhost:5173` 🎉

---

## 📖 Usage Guide

### Essential Commands

```bash
# Development
ongr dev              # Start development server
ongr build            # Build for production

# Content Creation
ongr generate blog "My First Post"     # Create a new blog post
ongr g b "Another Post"                # Short form
ongr generate project "Cool App"       # Create a new project
ongr g p "My Project"                  # Short form

# Content Processing
ongr load             # Preprocess content files
ongr l                # Short form

# Daily Logging
ongr log              # Create a new daily log entry

# Framework Management
ongr update           # Update OnigiriPress to latest version
ongr u --check        # Check for updates without installing
ongr u --beta         # Include beta versions

# Deployment
ongr deploy           # Deploy to GitHub Pages
ongr d                # Short form
ongr deploy-vercel    # Deploy to Vercel
ongr dv --prod        # Deploy to Vercel production
```

### Content Structure

```
my-portfolio/
├── README.md
├── config.yaml
├── onigiri.config.json
├── package.json
├── public/
│   ├── 404.html
│   ├── content/
│   │   ├── assets/
│   │   │   └── markdown.png
│   │   ├── blogs/
│   │   │   └── markdown-demo/
│   │   │       └── index.md
│   │   └── projects/
│   │       └── sample-project/
│   │           └── index.md
│   ├── data/
│   │   ├── blogs.json
│   │   ├── file-metadata.json
│   │   ├── projects.json
│   │   └── types.ts
│   ├── default_cover.jpg
│   ├── favicon.png
│   └── vite.svg
└── templates/
    ├── blog-template.md
    └── project-template.md
```

---

## ⚙️ Configuration

### Main Configuration (`config.yaml`)

```yaml
# Website configuration
website:
  title: "Your Title"
  titleSeparator: " | "
  favicon: "/favicon.png"
  description: "Portfolio website of Your Name. Customize this description with your own information."

# Background configuration
backgrounds:
  global: "your website background"  # Global background (supports images and videos)
  hero: "your hero image"   # Hero section background (images only)

# Video Background Support
# The global background supports both images and videos
# Supported video formats: .mp4, .webm, .ogg, .mov, .avi
# Examples:
# backgrounds:
#   global: "background/video.mp4"      # Local video file
#   global: "https://example.com/bg.mp4" # External video URL

# Home page configuration
home:
  hero:
    name: "YOUR NAME"
    quote: "Your inspiring quote or tagline here."

  profileCard:
    name: "Your Name"
    title: "Your Job Title"
    subtitle: "Your Subtitle"
    avatar: "favicon.png"

# ...

# Footer configuration
footer:
  copyright: "© yyyy by Your Name. All rights reserved."
  message: "Welcome to my portfolio website!"
```

### Build Configuration (`onigiri.config.json`)

```json
{
  "baseUrl": "/",
  "dev": {
    "port": 5173,
    "open": true
  }
}
```

---

## 📝 Writing Content

### Blog Post Example

```markdown
---
title: "My Amazing Blog Post"
createTime: "2025-06-17T10:00:00.000Z"
category: "Technology"
description: "A comprehensive guide to..."
tags: ["React", "TypeScript", "Web Development"]
coverImage: "./cover.jpg"  <!-- Relative path to public folder -->
---

# My Amazing Blog Post

Your content goes here...

## Features

- Markdown support
- Code highlighting
- Math equations: $E = mc^2$
- And much more!
```

### Project Example

```markdown
---
title: "Awesome Project"
createTime: "2025-06-17T10:00:00.000Z"
category: "Web Development"
description: "A revolutionary web application"
tags: ["React", "Node.js", "MongoDB"]
coverImage: "./screenshot.png"
---

# Awesome Project

Project description and documentation...
```

---

## 🚀 Deployment

### GitHub Pages (Recommended)

**Free static hosting for open source projects:**

1. **Configure your repository**:
   ```json
   // onigiri.config.json
   {
     "baseUrl": "/your-repo-name/"
   }
   ```

2. **Build and deploy**:
   ```bash
   ongr build
   ongr deploy
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Enable GitHub Pages from the `gh-pages` branch

**Troubleshooting**
1. After `ongr deploy`, if you get the error `ProcessError: fatal: a branch named 'gh-pages' already exists`, you may try the following commands:
  ```
  cd node_modules/.cache
  sudo rm -rf gh-pages
  cd ../..
  ```
  Then run `ongr deploy` again. 

2. If you get the error:
  ```
  ProcessError: error: RPC failed; HTTP 400 curl 22 The requested URL returned error: 400
  fatal: the remote end hung up unexpectedly
  Everything up-to-date
  ```
  you probably need to enlarge the buffer size with the command `git config --global http.postBuffer 157286400`, then rerun `ongr deploy`.  
  If it the command above does not work, you have to check your authentication information to see if your personal access token is still valid. 

### Vercel

**Modern deployment platform with advanced features:**

1. **Configure for Vercel**:
   ```json
   // onigiri.config.json
   {
     "baseUrl": "/"
   }
   ```

2. **Deploy with CLI**:
   ```bash
   # Install Vercel CLI if not already installed
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy (preview)
   ongr deploy-vercel
   
   # Deploy to production
   ongr dv --prod
   ```

3. **Or deploy via Vercel Dashboard**:
   - Connect your GitHub repository at [vercel.com](https://vercel.com)
   - Vercel will automatically detect and deploy your project
   - Set `baseUrl: "/"` in your `onigiri.config.json`

### Other Platforms

You can deploy to any static hosting service like **Netlify**, **Surge**, or **Firebase Hosting**:

1. **Build your project**:
   ```bash
   # Set baseUrl to "/" for most platforms
   ongr build
   ```

2. **Deploy the `dist/` folder** to your chosen platform following their documentation.

---

## 🌐 Social Media Integration

Onigiri Press supports extensive social media integration in the contact section. The following platforms are supported:

### Western Platforms
- **Email** - `email`: Direct email links
- **GitHub** - `github`: Developer portfolio integration  
- **LinkedIn** - `linkedin`: Professional networking
- **Twitter** - `twitter`: Microblogging platform
- **Instagram** - `instagram`: Photo and story sharing
- **Discord** - `discord`: Gaming and community platform
- **YouTube** - `youtube`: Video content platform

### Chinese Platforms
- **微博 (Weibo)** - `weibo`: Chinese microblogging platform
- **小红书 (Xiaohongshu)** - `xiaohongshu`: Lifestyle and shopping platform
- **微信 (WeChat)** - `wechat`: Displays WeChat ID (no direct link)
- **QQ** - `qq`: Displays QQ number (no direct link)
- **哔哩哔哩 (Bilibili)** - `bilibili`: Chinese video platform
- **知乎 (Zhihu)** - `zhihu`: Chinese Q&A platform

### Configuration Example

```yaml
home:
  navigation:
    contact:
      title: "Get In Touch"
      icon: "📬"
      type: "contact"
      # Add any combination of the following social media links
      email: "your-email@example.com"
      github: "https://github.com/yourusername"
      linkedin: "https://linkedin.com/in/yourusername"
      twitter: "https://twitter.com/yourusername"
      instagram: "https://instagram.com/yourusername"
      weibo: "https://weibo.com/yourusername"
      xiaohongshu: "https://xiaohongshu.com/yourusername"
      wechat: "your-wechat-id"  # Will display as text
      qq: "your-qq-number"      # Will display as text
      discord: "https://discord.com/users/yourusername"
      youtube: "https://youtube.com/@yourusername"
      bilibili: "https://space.bilibili.com/youruid"
      zhihu: "https://zhihu.com/people/yourusername"
      textColor: "#2958e7"  # Customize icon and text colors
```

**Note**: Only add the platforms you actually use. Empty or undefined fields will not be displayed.

---

## 🎨 Customization

### Themes and Styling

Onigiri Press uses CSS modules for styling. You can customize:

- Colors and typography in CSS files
- Layout components in React
- Background images and assets
- Component styles and animations

### Advanced Configuration

- Custom Vite plugins
- Additional markdown-it plugins
- Custom React components
- Build optimizations

---

## 🤝 Contributing

Contributions are welcomed! Feel free to open issues or submit pull requests to help improve Onigiri Press.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/HuJacobJiabao/onigiri-press.git

# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by the simplicity and elegance of Japanese design philosophy
- Built with modern web technologies and best practices

---

## 📞 Support
- 🐛 [Issue Tracker](https://github.com/HuJacobJiabao/onigiri-press/issues)

---

<div align="center">
  
  **Made with 🍙 and ❤️**
  
  *Onigiri Press - Simple. Beautiful. Functional.*
  
</div>
