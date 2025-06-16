import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}
