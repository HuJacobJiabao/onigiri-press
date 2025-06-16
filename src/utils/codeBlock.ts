// Code Block Interactive Features
// Handles copy functionality for code blocks

// WeakSet to track elements that already have listeners
const elementsWithListeners = new WeakSet();

export function initializeCodeBlocks() {
  // Initialize copy functionality
  const copyButtons = document.querySelectorAll('.code-block-copy');
  copyButtons.forEach((button) => {
    if (elementsWithListeners.has(button)) return;
    elementsWithListeners.add(button);
    button.addEventListener('click', handleCopyClick);
  });

  // Initialize toggle functionality
  const toggleButtons = document.querySelectorAll('.code-block-toggle');
  toggleButtons.forEach((button) => {
    if (elementsWithListeners.has(button)) return;
    elementsWithListeners.add(button);
    button.addEventListener('click', handleToggleClick);
  });
}

// Handle toggle button clicks
function handleToggleClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.currentTarget as HTMLElement;
  const container = button.closest('.code-block-container');
  
  if (!container) return;
  
  // Toggle the collapsed state
  container.classList.toggle('collapsed');
}

// Handle copy button clicks
async function handleCopyClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.currentTarget as HTMLElement;
  const container = button.closest('.code-block-container');
  
  if (!container) return;
  
  const codeElement = container.querySelector('pre code');
  if (!codeElement) return;
  
  try {
    // Get the text content without HTML tags
    const codeText = codeElement.textContent || '';
    
    // Use the Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(codeText);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = codeText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    
    // Show visual feedback
    showCopyFeedback(button, true);
    
  } catch (err) {
    console.error('Failed to copy code:', err);
    showCopyFeedback(button, false);
  }
}

// Show visual feedback for copy operation
function showCopyFeedback(button: HTMLElement, success: boolean) {
  const copyIcon = button.querySelector('.copy-icon');
  if (!copyIcon) return;
  
  const originalText = copyIcon.textContent;
  copyIcon.textContent = success ? '✓' : '✗';
  
  if (success) {
    button.classList.add('copied');
  }
  
  setTimeout(() => {
    copyIcon.textContent = originalText;
    button.classList.remove('copied');
  }, 2000);
}

// Global functions for inline event handlers as fallback
declare global {
  interface Window {
    copyCodeBlock: (button: HTMLElement) => void;
    toggleCodeBlock: (button: HTMLElement) => void;
  }
}

// Auto-initialize when DOM is loaded (only in browser environment)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCodeBlocks);
  } else {
    initializeCodeBlocks();
  }
  
  // Set up MutationObserver to detect when code blocks are added/modified
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      let shouldReinitialize = false;
      
      mutations.forEach((mutation) => {
        // Check if any code blocks were added or modified
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Skip if this is a Mermaid-related element to avoid conflicts
              if (element.classList?.contains('mermaid-container') ||
                  element.classList?.contains('mermaid-diagram') ||
                  element.tagName?.toLowerCase() === 'svg' ||
                  element.closest?.('.mermaid-container')) {
                return;
              }
              
              if (element.classList?.contains('code-block-container') || 
                  element.querySelector?.('.code-block-container')) {
                shouldReinitialize = true;
              }
            }
          });
        }
      });
      
      if (shouldReinitialize) {
        // Small delay to ensure DOM is stable
        setTimeout(() => {
          initializeCodeBlocks();
        }, 50);
      }
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}
