import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yamlPlugin from '@rollup/plugin-yaml'
import path from 'path'
import fs from 'fs'

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
  // console.log('DEBUG - getBaseUrl returned:', baseUrl);
  return baseUrl;
}

// Get output directory - use user directory when building via CLI
function getOutDir(): string {
  const userDir = process.env.VITE_USER_DIR;
  if (userDir && userDir !== process.cwd()) {
    // Building via CLI - output to user directory
    return path.join(userDir, 'dist');
  }
  // Building in package root - use relative path
  return 'dist';
}

// Get public directory - use user directory when running via CLI
function getPublicDir(): string {
  const userDir = process.env.VITE_USER_DIR;
  if (userDir && userDir !== process.cwd()) {
    // Running via CLI - use user project's public directory
    const userPublicDir = path.join(userDir, 'public');
    if (fs.existsSync(userPublicDir)) {
      // console.log(`📂 Using public directory from user project: ${userPublicDir}`);
      return userPublicDir;
    }
  }
  // Running in package root or no user public dir - use package public
  const packagePublicDir = path.resolve(process.cwd(), 'public');
  console.log(`📂 Using public directory from package: ${packagePublicDir}`);
  return packagePublicDir;
}

// https://vite.dev/config/
export default defineConfig({
  base: getBaseUrl(),
  publicDir: getPublicDir(),
  plugins: [
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
      external: ['fs', 'path'],
      output: {
        // Ensure asset paths are calculated correctly relative to the base
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    // Custom build log to show cleaner paths
    reportCompressedSize: false
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      // Dynamic alias for config.yaml - use user directory if available, otherwise package directory
      '../../config.yaml': (() => {
        const userDir = process.env.VITE_USER_DIR;
        if (userDir && userDir !== process.cwd()) {
          const userConfigPath = path.join(userDir, 'config.yaml');
          if (fs.existsSync(userConfigPath)) {
            // console.log(`📍 Using config from user directory: ${userConfigPath}`);
            return userConfigPath;
          }
        }
        const packageConfigPath = path.resolve(process.cwd(), 'config.yaml');
        console.log(`📍 Using config from package directory: ${packageConfigPath}`);
        return packageConfigPath;
      })()
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
