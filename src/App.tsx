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
        <Route path="/my-portfolio/" element={<Home />} />
        <Route path="/my-portfolio/projects" element={<Projects />} />
        <Route path="/my-portfolio/projects/" element={<Projects />} />
        <Route path="/my-portfolio/projects/:id" element={<DetailPage />} />
        <Route path="/my-portfolio/blogs" element={<Blogs />} />
        <Route path="/my-portfolio/blogs/" element={<Blogs />} />
        <Route path="/my-portfolio/blogs/:id" element={<DetailPage />} />
        <Route path="/my-portfolio/archive" element={<Archive />} />
        <Route path="/my-portfolio/archive/" element={<Archive />} />
        <Route path="/my-portfolio/devlogs" element={<DeveloperLog />} />
        <Route path="/my-portfolio/devlogs/" element={<DeveloperLog />} />
        <Route path="/my-portfolio/devlogs/:date/:logType" element={<DetailPage />} />
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

  return (
   <Router>
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
