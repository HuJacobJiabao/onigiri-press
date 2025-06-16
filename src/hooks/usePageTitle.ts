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
    
    // Update favicon if configured
    const favicon = config.website?.favicon;
    if (favicon) {
      const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (faviconLink) {
        // Use BASE_URL for proper path resolution in production
        faviconLink.href = `${import.meta.env.BASE_URL}${favicon.startsWith('/') ? favicon.slice(1) : favicon}`;
      }
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
