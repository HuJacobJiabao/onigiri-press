import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yamlPlugin from '@rollup/plugin-yaml'
import path from 'path'
import fs from 'fs'
import type { Plugin } from 'vite'

// Custom plugin to replace asset paths in HTML
function htmlAssetPathsPlugin(baseUrl: string): Plugin {
  return {
    name: 'html-asset-paths',
    enforce: 'post',
    configResolved(config) {
      console.log('DEBUG - Plugin config resolved. Base:', config.base);
      baseUrl = config.base;
    },
    transformIndexHtml(html) {
      console.log('DEBUG - Transform HTML called with baseUrl:', baseUrl);
      // 确保路径正确
      const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
      console.log('DEBUG - Final base path:', base);
      
      // 使用更精确的替换
      return html.replace(
        /<link[^>]*rel="icon"[^>]*href="\/favicon\.png"[^>]*>/,
        `<link rel="icon" type="image/png" href="${base}favicon.png" />`
      );
    }
  };
}

// Read config from onigiri.config.json
function readOnigiriConfig(): any {
  // Try to read from user directory if specified
  const userDir = process.env.VITE_USER_DIR || process.cwd();
  const configPath = path.join(userDir, 'onigiri.config.json');
  
  try {
    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configFile);
    }
  } catch (error) {
    console.warn('⚠️ Error reading onigiri.config.json:', error);
  }
  
  // Default config
  return {
    baseUrl: '/',
    dev: {
      port: 5173,
      open: true
    }
  };
}

// Read base URL from config or environment variable
function getBaseUrl(): string {
  let baseUrl: string;
  // Priority: 1. Environment variable, 2. onigiri.config.json, 3. default
  if (process.env.VITE_BASE_URL) {
    baseUrl = process.env.VITE_BASE_URL;
  } else {
    const config = readOnigiriConfig();
    baseUrl = config.baseUrl || '/';
  }
  console.log('DEBUG - getBaseUrl returned:', baseUrl);
  return baseUrl;
}

// Get output directory - build to user directory if specified
function getOutDir(): string {
  const userDir = process.env.VITE_USER_DIR;
  return userDir ? path.join(userDir, 'dist') : 'dist';
}

// https://vite.dev/config/
export default defineConfig({
  base: getBaseUrl(),
  plugins: [
    htmlAssetPathsPlugin(getBaseUrl()),
    react(),
    yamlPlugin()
  ],
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: getOutDir(),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1MB
    rollupOptions: {
      external: ['fs', 'path']
    }
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    }
  },
  server: {
    fs: {
      // Allow serving files from user directory
      allow: process.env.VITE_USER_DIR ? [process.cwd(), process.env.VITE_USER_DIR] : [process.cwd()],
    },
    port: (() => {
      const config = readOnigiriConfig();
      return config.dev?.port || 5173;
    })(),
    open: (() => {
      const config = readOnigiriConfig();
      return config.dev?.open ?? true;
    })()
  }
})
