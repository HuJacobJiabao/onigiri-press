import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageTransition from './components/PageTransition'
import MetingPlayer from './components/MetingPlayer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import DetailPage from './pages/DetailPage'
import Blogs from './pages/Blogs'
import Archive from './pages/Archive'
import DeveloperLog from './pages/DeveloperLog'
import { config } from './config/config'
import './App.css'

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Store original scroll behavior
    const htmlElement = document.documentElement;
    const originalScrollBehavior = htmlElement.style.scrollBehavior;
    
    // Temporarily disable smooth scrolling to prevent animation
    htmlElement.style.scrollBehavior = 'auto';
    
    // Force immediate positioning without animation
    // Use multiple methods to ensure it works across browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // Restore smooth scrolling after positioning is complete
    // Use requestAnimationFrame to ensure the scroll position is set first
    requestAnimationFrame(() => {
      htmlElement.style.scrollBehavior = originalScrollBehavior;
    });
  }, [location.pathname, location.search]);

  return null;
}

function AppContent() {
  const location = useLocation();
  
  // Create a transition key that includes both pathname and search params
  // This ensures transitions trigger on same-page navigation
  const transitionKey = `${location.pathname}${location.search}`;

  return (
    <PageTransition transitionKey={transitionKey}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/" element={<Projects />} />
        <Route path="/projects/:id" element={<DetailPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/" element={<Blogs />} />
        <Route path="/blogs/:id" element={<DetailPage />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/archive/" element={<Archive />} />
        <Route path="/devlogs" element={<DeveloperLog />} />
        <Route path="/devlogs/" element={<DeveloperLog />} />
        <Route path="/devlogs/:date/:logType" element={<DetailPage />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get global background from config (already processed with full URL)
  const backgroundUrl = config.backgrounds?.global || `${import.meta.env.BASE_URL}background/global.png`;

  // Dynamically set favicon based on config
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    // Ensure base URL ends with a slash
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    
    // Use processed favicon from config (already includes baseUrl) or fallback
    const faviconPath = config.website?.favicon || `${normalizedBaseUrl}favicon.png`;
    
    // console.log('Setting favicon with base URL:', baseUrl);
    // console.log('Config favicon (processed):', config.website?.favicon);
    // console.log('Final favicon path:', faviconPath);
    
    let linkElement = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (!linkElement) {
      console.log('Creating new favicon link element');
      linkElement = document.createElement('link');
      linkElement.rel = 'icon';
      linkElement.type = 'image/png';
      document.head.appendChild(linkElement);
    } else {
      console.log('Found existing favicon link element');
    }
    linkElement.href = faviconPath;
    console.log('Favicon href set to:', linkElement.href);
  }, []);

  return (
   <Router basename={import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL}>
      {/* Global fixed background layer with dynamic background */}
      <div 
        className="global-background-fixed"
        style={{
          backgroundImage: `url('${backgroundUrl}')`
        }}
      ></div>
      
      <ScrollToTop />
      <AppContent />
      <MetingPlayer />
    </Router>
  )
}

export default App
