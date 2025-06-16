// Memoized Markdown Content Component
// Prevents re-rendering when sidebar state changes

import React, { useEffect } from 'react';
import type { ParsedMarkdown } from '../utils/markdown';
import { initializeCodeBlocks } from '../utils/codeBlock';
import styles from '../styles/DetailPage.module.css';

interface MarkdownContentProps {
  markdownData: ParsedMarkdown;
}

// Memoized component that only re-renders when markdown data actually changes
const MarkdownContent = React.memo<MarkdownContentProps>(({ 
  markdownData
}) => {
  // Initialize code blocks and mermaid diagrams whenever the markdown content changes
  useEffect(() => {
    console.log('MarkdownContent useEffect triggered');

    const run = async () => {
      console.log('Initializing code blocks...');
      initializeCodeBlocks();
    };

    const rafId = requestAnimationFrame(run);

    return () => cancelAnimationFrame(rafId);
  }, [markdownData.html]);

  return (
    <>
      <div 
        className={styles.markdownContent}
        dangerouslySetInnerHTML={{ __html: markdownData.html }}
      />
      {markdownData.createTime && (
        <div className={styles.publishedDate}>
          <em>Published on {new Date(markdownData.createTime).toISOString().split('T')[0]}</em>
        </div>
      )}
    </>
  );
});

MarkdownContent.displayName = 'MarkdownContent';

export default MarkdownContent;
