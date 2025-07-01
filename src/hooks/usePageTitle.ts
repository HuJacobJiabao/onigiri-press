import { useEffect } from 'react';
import { config } from '../config/config';

/**
 * Custom hook to manage page title dynamically
 * @param pageTitle - The specific page title (e.g., "Projects", "Blogs")
 * @param useFullTitle - If true, use only the pageTitle without website title
 */
export const usePageTitle = (pageTitle: string, useFullTitle: boolean = false) => {
  useEffect(() => {
    const websiteTitle = config.website?.title || 'My Website';
    const separator = config.website?.titleSeparator || ' | ';
    
    if (useFullTitle) {
      document.title = pageTitle;
    } else {
      document.title = pageTitle ? `${pageTitle}${separator}${websiteTitle}` : websiteTitle;
    }
    
    
    // Update meta description if configured
    const description = config.website?.description;
    if (description) {
      let metaDescription = document.querySelector("meta[name='description']") as HTMLMetaElement;
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }
  }, [pageTitle, useFullTitle]);
};

export default usePageTitle;
