/**
 * Safe gray-matter alternative that doesn't use eval
 */

// Simple YAML parser for frontmatter (safer than eval-based engines)
function parseSimpleYaml(yamlStr: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlStr.trim().split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmedLine.slice(0, colonIndex).trim();
    let value = trimmedLine.slice(colonIndex + 1).trim();
    
    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Handle arrays (simple format)
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayStr = value.slice(1, -1);
      result[key] = arrayStr.split(',').map(item => {
        let trimmed = item.trim();
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          trimmed = trimmed.slice(1, -1);
        }
        return trimmed;
      });
    }
    // Handle booleans
    else if (value === 'true' || value === 'false') {
      result[key] = value === 'true';
    }
    // Handle numbers
    else if (!isNaN(Number(value)) && value !== '') {
      result[key] = Number(value);
    }
    // Handle strings
    else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Safe matter parser that doesn't use eval
 */
export function safeMatter(content: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  const [, yamlContent, bodyContent] = match;
  
  try {
    const data = parseSimpleYaml(yamlContent);
    return { data, content: bodyContent };
  } catch (error) {
    console.warn('Failed to parse frontmatter:', error);
    return { data: {}, content };
  }
}
