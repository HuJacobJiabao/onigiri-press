import MarkdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItMark from 'markdown-it-mark';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItTaskLists from 'markdown-it-task-lists';
import Prism from 'prismjs';
import { safeMatter } from './safeMatter';
import { Buffer } from 'buffer';
import katex from 'katex';

// Make Buffer available globally for utilities
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Import essential language support (avoiding problematic dependencies)
import 'prismjs/components/prism-markup'; // Must be loaded first for HTML/XML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-latex';

// Import custom Night Owl theme
import '../styles/prism-night-owl-theme.css';
// Import KaTeX CSS for math rendering
import 'katex/dist/katex.min.css';

/**
 * Convert relative paths to BASE_URL-based paths
 * All markdown assets should be resolved relative to the BASE_URL
 */
function convertToBaseUrlPath(path: string): string {
  // Already absolute paths (http/https) or base URLs - return as is
  if (path.startsWith('http') || path.startsWith(import.meta.env.BASE_URL)) {
    return path;
  }
  
  // Skip anchors, mailto, tel links
  if (path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  
  // Remove leading './' if present
  let cleanPath = path.startsWith('./') ? path.slice(2) : path;
  
  // Remove leading '../' patterns as we want everything relative to BASE_URL
  cleanPath = cleanPath.replace(/^(\.\.\/)+/, '');
  
  // Ensure BASE_URL ends with a slash
  const baseUrl = import.meta.env.BASE_URL;
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  
  // If path starts with '/', treat it as absolute from BASE_URL
  if (cleanPath.startsWith('/')) {
    return `${normalizedBaseUrl}${cleanPath.slice(1)}`;
  }
  
  // For all other paths, treat them as relative to BASE_URL
  return `${normalizedBaseUrl}${cleanPath}`;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface ParsedMarkdown {
  html: string;
  toc: TocItem[];
  createTime?: string;
}

// Custom secure KaTeX plugin for markdown-it
function customKatexPlugin(md: MarkdownIt) {
  // Inline math: $...$
  md.inline.ruler.before('escape', 'math_inline', function(state, silent) {
    const start = state.pos;
    if (state.src.charAt(start) !== '$') {
      return false;
    }
    
    // Find closing $
    let end = start + 1;
    while (end < state.src.length && state.src.charAt(end) !== '$') {
      if (state.src.charAt(end) === '\\') {
        end++; // Skip escaped character
      }
      end++;
    }
    
    if (end >= state.src.length) {
      return false; // No closing $
    }
    
    const content = state.src.slice(start + 1, end);
    
    if (!silent) {
      const token = state.push('math_inline', 'math', 0);
      token.content = content;
      token.markup = '$';
    }
    
    state.pos = end + 1;
    return true;
  });
  
  // Block math: $$...$$
  md.block.ruler.before('fence', 'math_block', function(state, start, end, silent) {
    const marker = '$$';
    let pos = state.bMarks[start] + state.tShift[start];
    let max = state.eMarks[start];
    
    if (pos + marker.length > max) {
      return false;
    }
    
    if (state.src.slice(pos, pos + marker.length) !== marker) {
      return false;
    }
    
    pos += marker.length;
    let firstLine = state.src.slice(pos, max).trim();
    
    if (firstLine.endsWith(marker)) {
      // Single line: $$content$$
      firstLine = firstLine.slice(0, -marker.length).trim();
      if (!silent) {
        const token = state.push('math_block', 'math', 0);
        token.content = firstLine;
        token.markup = marker;
        token.map = [start, start + 1];
      }
      state.line = start + 1;
      return true;
    }
    
    // Multi-line block
    let nextLine = start + 1;
    let content = firstLine + '\n';
    
    while (nextLine < end) {
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      
      const line = state.src.slice(pos, max);
      if (line.trim() === marker) {
        if (!silent) {
          const token = state.push('math_block', 'math', 0);
          token.content = content.trim();
          token.markup = marker;
          token.map = [start, nextLine + 1];
        }
        state.line = nextLine + 1;
        return true;
      }
      
      content += line + '\n';
      nextLine++;
    }
    
    return false;
  });
  
  // Renderer for inline math
  md.renderer.rules.math_inline = function(tokens, idx) {
    const token = tokens[idx];
    try {
      // Sanitize input to prevent XSS
      const sanitizedContent = token.content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      const rendered = katex.renderToString(sanitizedContent, {
        displayMode: false,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: 'warn',
        trust: false, // Disable \url and other potentially dangerous commands
        maxSize: 10, // Limit size to prevent DoS
        maxExpand: 1000 // Limit macro expansion
      });
      return `<span class="math math-inline">${rendered}</span>`;
    } catch (error) {
      console.warn('KaTeX inline rendering error:', error);
      return `<span class="math-error" title="Math rendering error">${token.content}</span>`;
    }
  };
  
  // Renderer for block math
  md.renderer.rules.math_block = function(tokens, idx) {
    const token = tokens[idx];
    try {
      // Sanitize input to prevent XSS
      const sanitizedContent = token.content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      const rendered = katex.renderToString(sanitizedContent, {
        displayMode: true,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: 'warn',
        trust: false, // Disable \url and other potentially dangerous commands
        maxSize: 20, // Allow larger size for display mode
        maxExpand: 1000 // Limit macro expansion
      });
      return `<div class="math math-display">${rendered}</div>`;
    } catch (error) {
      console.warn('KaTeX block rendering error:', error);
      return `<div class="math-error" title="Math rendering error"><pre>${token.content}</pre></div>`;
    }
  };
}

// Initialize markdown-it with plugins
function createMarkdownParser() {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  // Add plugins
  md.use(markdownItFootnote);
  md.use(markdownItMark);
  md.use(markdownItTaskLists, { enabled: true });
  md.use(customKatexPlugin);
  md.use(markdownItDeflist);
  
  // Add custom link renderer
  customLinkRenderer(md);

  return md;
}

// Custom link renderer to transform devlog links
function customLinkRenderer(md: MarkdownIt) {
  // Store the default link renderer
  const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, _env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function(tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex('href');
    
    if (hrefIndex >= 0) {
      const href = token.attrGet('href');
      
      // Transform devlog file links to React Router links
      if (href && href.match(/^\.\/devlogs\/(\d{4}-\d{2}-\d{2})\/(change-log|developer-log)\.md$/)) {
        const match = href.match(/^\.\/devlogs\/(\d{4}-\d{2}-\d{2})\/(change-log|developer-log)\.md$/);
        if (match) {
          const [, date, logType] = match;
          const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
            ? import.meta.env.BASE_URL 
            : `${import.meta.env.BASE_URL}/`;
          const newHref = `${baseUrl}devlogs/${date}/${logType}`;
          token.attrSet('href', newHref);
        }
      }
    }
    
    return defaultRender(tokens, idx, options, env, renderer);
  };
}

// Custom renderer for code blocks with syntax highlighting
function customCodeRenderer(md: MarkdownIt, toc: TocItem[]) {
  // Track heading IDs to ensure uniqueness
  const headingIds = new Map<string, number>();
  // Override fence renderer for code blocks
  md.renderer.rules.fence = function(tokens, idx) {
    const token = tokens[idx];
    const info = token.info ? token.info.trim() : '';
    const langName = info.split(/\s+/g)[0];

    // Map common language aliases
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'css': 'css',
      'json': 'json',
      'bash': 'bash',
      'shell': 'bash',
      'sh': 'bash',
      'md': 'markdown',
      'yaml': 'yaml',
      'yml': 'yaml',
      'html': 'markup',
      'xml': 'markup',
      'py': 'python',
      'c++': 'cpp',
      'sql': 'sql',
      'rust': 'rust',
      'rs': 'rust',
      'go': 'go',
      'golang': 'go',
      'latex': 'latex',
      'tex': 'latex'
    };

    const normalizedLang = langName ? languageMap[langName.toLowerCase()] || langName.toLowerCase() : 'text';
    const displayLang = langName || 'text';
    
    try {
      // Try to highlight with Prism if language is available
      if (normalizedLang && Prism.languages[normalizedLang]) {
        const highlighted = Prism.highlight(token.content, Prism.languages[normalizedLang], normalizedLang);
        return `
          <div class="code-block-container">
            <div class="code-block-banner">
              <div class="code-block-controls">
                <button class="code-block-toggle" title="Toggle code block">
                  <span class="toggle-icon">▼</span>
                </button>
                <span class="code-block-language">${displayLang}</span>
              </div>
              <button class="code-block-copy" title="Copy">
                <span class="copy-icon">📄</span>
              </button>
            </div>
            <pre class="language-${normalizedLang} code-block-content"><code class="language-${normalizedLang}">${highlighted}</code></pre>
          </div>
        `;
      } else {
        // Fallback: escape HTML and return with basic styling
        const escapedContent = token.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        return `
          <div class="code-block-container">
            <div class="code-block-banner">
              <div class="code-block-controls">
                <button class="code-block-toggle" title="Toggle code block">
                  <span class="toggle-icon">▼</span>
                </button>
                <span class="code-block-language">${displayLang}</span>
              </div>
              <button class="code-block-copy" title="Copy">
                <span class="copy-icon">📄</span>
              </button>
            </div>
            <pre class="language-text code-block-content"><code class="language-text">${escapedContent}</code></pre>
          </div>
        `;
      }
    } catch (error) {
      console.warn(`Failed to highlight code for language: ${normalizedLang}`, error);
      const escapedContent = token.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      return `
        <div class="code-block-container">
          <div class="code-block-banner">
            <div class="code-block-controls">
              <button class="code-block-toggle" title="Toggle code block">
                <span class="toggle-icon">▼</span>
              </button>
              <span class="code-block-language">${displayLang}</span>
            </div>
            <button class="code-block-copy" title="Copy">
              <span class="copy-icon">📋</span>
            </button>
          </div>
          <pre class="language-text code-block-content"><code class="language-text">${escapedContent}</code></pre>
        </div>
      `;
    }
  };

  // Override heading renderer to generate TOC
  md.renderer.rules.heading_open = function(tokens, idx) {
    const token = tokens[idx];
    const level = parseInt(token.tag.substring(1));
    
    // Get the heading text from the next token
    const textToken = tokens[idx + 1];
    let text = '';
    
    if (textToken && textToken.type === 'inline' && textToken.children) {
      // Extract only the text content from inline tokens, ignoring markdown formatting
      text = textToken.children
        .filter(child => child.type === 'text' || child.type === 'link_open' || child.type === 'link_close')
        .map(child => {
          if (child.type === 'text') {
            return child.content;
          }
          return '';
        })
        .join('')
        .trim();
    } else if (textToken && textToken.type === 'inline') {
      // Fallback: use content but strip markdown link syntax
      text = textToken.content
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links, keep text
        .trim();
    }
    
    // Generate ID from text
    const baseId = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    // Ensure unique ID by adding counter for duplicates
    let id = baseId;
    if (headingIds.has(baseId)) {
      const count = headingIds.get(baseId)! + 1;
      headingIds.set(baseId, count);
      id = `${baseId}-${count}`;
    } else {
      headingIds.set(baseId, 0);
    }
    
    // Add to TOC
    toc.push({
      id,
      title: text,
      level
    });

    // Add id attribute to the token
    token.attrSet('id', id);
    
    return `<${token.tag} id="${id}">`;
  };

  // Override image renderer to support public-based paths
  md.renderer.rules.image = function(tokens, idx, options, _env, renderer) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex('src');
    
    if (srcIndex >= 0) {
      const src = token.attrs![srcIndex][1];
      // Convert relative paths to BASE_URL-based paths
      const resolvedSrc = convertToBaseUrlPath(src);
      token.attrs![srcIndex][1] = resolvedSrc;
    }
    
    // Add loading="lazy" attribute
    token.attrSet('loading', 'lazy');
    
    return renderer.renderToken(tokens, idx, options);
  };

  return md;
}

export async function parseMarkdown(
  content: string, 
  removeMainTitle: boolean = false
): Promise<ParsedMarkdown> {
  const toc: TocItem[] = [];
  
  // Parse frontmatter and body using safeMatter (no eval)
  const parsed = safeMatter(content);
  const frontmatter = parsed.data || {}; // Provide empty object default for files without frontmatter
  let bodyContent = parsed.content;
  
  // Process template variables in body content using frontmatter values
  Object.entries(frontmatter).forEach(([key, value]) => {
    // Skip createTime as we'll handle it separately in the component
    if (key === 'createTime') {
      return;
    }
    
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    bodyContent = bodyContent.replace(regex, String(value));
  });

  // Create markdown parser with custom renderers
  const md = createMarkdownParser();
  customCodeRenderer(md, toc);

  try {
    // Parse markdown content
    let html = md.render(bodyContent);
    
    // Remove first H1 if requested
    if (removeMainTitle && toc.length > 0 && toc[0].level === 1) {
      // Remove the first heading from TOC
      toc.shift();
      
      // Remove the first H1 from HTML
      html = html.replace(/<h1[^>]*>.*?<\/h1>/, '');
    }
    
    // Post-process for public-based path conversion
    // Replace relative paths in HTML a href attributes
    html = html.replace(
      /<a([^>]*)\shref=["']([^"']*?)["']([^>]*)>/gi,
      (_fullMatch, before, href, after) => {
        // Convert to BASE_URL-based path
        const resolvedHref = convertToBaseUrlPath(href);
        return `<a${before} href="${resolvedHref}"${after}>`;
      }
    );
      
    // Replace relative paths in CSS url() functions within style attributes
    html = html.replace(
      /style=["']([^"']*?)["']/gi,
      (_fullMatch, styleContent) => {
        const updatedStyle = styleContent.replace(
          /url\(["']?([^"')]*?)["']?\)/gi,
          (_urlMatch: string, urlPath: string) => {
            // Convert to BASE_URL-based path
            const resolvedUrl = convertToBaseUrlPath(urlPath);
            return `url("${resolvedUrl}")`;
          }
        );
        return `style="${updatedStyle}"`;
      }
    );
    
    return {
      html,
      toc,
      createTime: frontmatter.createTime
    };
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return {
      html: '<p>Error parsing markdown content</p>',
      toc: [],
      createTime: undefined
    };
  }
}

export async function fetchMarkdownContent(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return '# Content Not Found\n\nThe requested content could not be loaded.';
  }
}
