// Asset resolver utility for handling static asset resolution in markdown content
// Updated for the new preprocessing system that serves assets as static files

/**
 * Get all available static assets by scanning the entire public directory
 * This includes all files that can be served as static resources
 */
async function getAllStaticAssets(): Promise<string[]> {
  const assets: string[] = [];
  
  try {
    // Load from preprocessed static data first
    const [blogsResponse, projectsResponse] = await Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/blogs.json`),
      fetch(`${import.meta.env.BASE_URL}data/projects.json`)
    ]);
    
    // Add assets from blogs and projects data
    if (blogsResponse.ok) {
      const blogs = await blogsResponse.json();
      for (const blog of blogs) {
        if (blog.assetPaths) {
          assets.push(...blog.assetPaths.map((path: string) => `content/${path}`));
        }
      }
    }
    
    if (projectsResponse.ok) {
      const projects = await projectsResponse.json();
      for (const project of projects) {
        if (project.assetPaths) {
          assets.push(...project.assetPaths.map((path: string) => `content/${path}`));
        }
      }
    }
    
    // Try to load and parse config to extract asset references
    try {
      const configResponse = await fetch(`${import.meta.env.BASE_URL}config.yaml`);
      if (configResponse.ok) {
        const configText = await configResponse.text();
        
        // Extract asset references from config using regex patterns
        // This dynamically finds all assets referenced in the config
        
        // Extract image sources (src: "path/to/image")
        const srcMatches = configText.match(/src:\s*"([^"]+)"/g) || [];
        for (const match of srcMatches) {
          const asset = match.replace(/src:\s*"([^"]+)"/, '$1');
          if (asset && !assets.includes(asset)) {
            assets.push(asset);
          }
        }
        
        // Extract background images
        const backgroundMatches = configText.match(/(global|hero|defaultHeaderBackground|defaultCover):\s*"([^"]+)"/g) || [];
        for (const match of backgroundMatches) {
          const asset = match.replace(/[^:]+:\s*"([^"]+)"/, '$1');
          if (asset && !assets.includes(asset)) {
            assets.push(asset);
          }
        }
        
        // Extract resume filename
        const resumeMatch = configText.match(/filename:\s*"([^"]+\.pdf)"/);
        if (resumeMatch && !assets.includes(resumeMatch[1])) {
          assets.push(resumeMatch[1]);
        }
        
        // Extract audio files
        const audioMatches = configText.match(/url:\s*"\/audio\/([^"]+)"/g) || [];
        for (const match of audioMatches) {
          const audioFile = match.replace(/url:\s*"\/audio\/([^"]+)"/, 'audio/$1');
          if (!assets.includes(audioFile)) {
            assets.push(audioFile);
          }
        }
        
        // Extract photo references
        const photoMatches = configText.match(/photo:\s*"([^"]+)"/g) || [];
        for (const match of photoMatches) {
          const photo = match.replace(/photo:\s*"([^"]+)"/, '$1');
          if (photo && !assets.includes(photo)) {
            assets.push(photo);
          }
        }
      }
    } catch (error) {
      console.warn('Could not load config for asset extraction:', error);
    }

    // Add essential framework files that are always needed
    const frameworkEssentials = [
      'favicon.png',  // Browser favicon
      '404.html'      // Error page
    ];
    
    for (const essential of frameworkEssentials) {
      if (!assets.includes(essential)) {
        assets.push(essential);
      }
    }
    
    // Add content directory assets with common patterns
    const contentPatterns = [
      'content/blogs',
      'content/projects'
    ];
    
    for (const pattern of contentPatterns) {
      // Add common image extensions for each content directory
      const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
      const commonNames = ['image', 'cover', 'thumbnail', 'banner', 'hero'];
      
      for (const ext of imageExtensions) {
        for (const name of commonNames) {
          assets.push(`${pattern}/${name}.${ext}`);
        }
      }
    }
    
    // Remove duplicates and return
    return [...new Set(assets)];
    
  } catch (error) {
    console.warn('Could not load static asset data:', error);
    return [];
  }
}

/**
 * Convert asset path to BASE_URL-based static URL
 * All paths are resolved relative to the BASE_URL
 */
function getStaticAssetUrl(assetPath: string): string {
  // Remove leading './' if present
  let cleanPath = assetPath.startsWith('./') ? assetPath.slice(2) : assetPath;
  
  // Remove leading '../' patterns as we want everything relative to BASE_URL
  cleanPath = cleanPath.replace(/^(\.\.\/)+/, '');
  
  // If path starts with '/', treat it as absolute from BASE_URL
  if (cleanPath.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${cleanPath.slice(1)}`;
  }
  
  // For all other paths, treat them as relative to BASE_URL
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

/**
 * Create an asset map for markdown content
 * This resolves relative image paths to proper static URLs based on public directory
 * All paths are now treated as relative to the public directory root
 */
export async function createAssetMap(_markdownPath?: string): Promise<Map<string, string>> {
  const assetMap = new Map<string, string>();
  
  // Get all available assets from the static data
  const assetsFromStatic = await getAllStaticAssets();
  
  // For each asset, create mappings for common relative path patterns
  for (const assetPath of assetsFromStatic) {
    const staticUrl = getStaticAssetUrl(assetPath);
    
    // Map the original asset path
    assetMap.set(assetPath, staticUrl);
    
    // Extract filename for direct filename references
    const filename = assetPath.split('/').pop();
    if (filename) {
      assetMap.set(filename, staticUrl);
      assetMap.set(`./${filename}`, staticUrl);
    }
    
    // Create mapping for various relative path patterns that all resolve to public-based paths
    // This covers cases like ../folder/image.png, ./image.png, etc.
    const pathVariations = [
      assetPath,
      `./${assetPath}`,
      `../${assetPath}`,
      `../../${assetPath}`,
      `../../../${assetPath}`
    ];
    
    pathVariations.forEach(variation => {
      assetMap.set(variation, staticUrl);
    });
  }
  
  return assetMap;
}


/**
 * Global asset cache to avoid reloading assets for each markdown file
 */
const globalAssetCache = new Map<string, string>();
let globalAssetCachePromise: Promise<void> | null = null;

/**
 * Load all assets into a global cache once
 */
async function loadGlobalAssetCache(): Promise<void> {
  if (globalAssetCachePromise) {
    return globalAssetCachePromise;
  }
  
  globalAssetCachePromise = (async () => {
    try {
      const assetsFromStatic = await getAllStaticAssets();
      
      for (const assetPath of assetsFromStatic) {
        const staticUrl = getStaticAssetUrl(assetPath);
        globalAssetCache.set(assetPath, staticUrl);
      }
      
      // console.log('Loaded global asset cache:', Array.from(globalAssetCache.entries()));
    } catch (error) {
      console.warn('Could not load global asset cache:', error);
    }
  })();
  
  return globalAssetCachePromise;
}

/**
 * Create an asset map using the global cache (more efficient for multiple calls)
 * All paths are treated as relative to the public directory root
 */
export async function createAssetMapFromCache(_markdownPath?: string): Promise<Map<string, string>> {
  await loadGlobalAssetCache();
  
  const assetMap = new Map<string, string>();
  
  for (const [assetPath, assetUrl] of globalAssetCache) {
    // Map the original asset path
    assetMap.set(assetPath, assetUrl);
    
    // Extract filename for direct filename references
    const filename = assetPath.split('/').pop();
    if (filename) {
      assetMap.set(filename, assetUrl);
      assetMap.set(`./${filename}`, assetUrl);
    }
    
    // Create mapping for various relative path patterns that all resolve to public-based paths
    const pathVariations = [
      assetPath,
      `./${assetPath}`,
      `../${assetPath}`,
      `../../${assetPath}`,
      `../../../${assetPath}`
    ];
    
    pathVariations.forEach(variation => {
      assetMap.set(variation, assetUrl);
    });
  }
  
  return assetMap;
}
