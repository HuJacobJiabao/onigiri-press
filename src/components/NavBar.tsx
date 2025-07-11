import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';
import { useState, useEffect } from 'react';
import config from '../config/config';
import { useNavbarState } from '../hooks/useNavbarState';

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { visible, atTop } = useNavbarState();
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to handle navigation clicks
  const handleNavClick = (to: string, event: React.MouseEvent) => {
    // If we're already on this page, force re-navigation with a timestamp
    if (location.pathname === to) {
      event.preventDefault();
      // Add a timestamp to force navigation even to the same route
      navigate(`${to}?refresh=${Date.now()}`, { replace: true });
      setMenuOpen(false);
      return;
    }
    // Otherwise, let React Router handle it normally
    setMenuOpen(false);
  };

  // Clear any residual inline styles on component mount
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar instanceof HTMLElement) {
      navbar.style.transform = '';
      navbar.style.transition = '';
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setMenuOpen(false);
      
      // Clear any inline styles that might have been applied
      const navbar = document.querySelector('nav');
      if (navbar instanceof HTMLElement) {
        navbar.style.transform = '';
        navbar.style.transition = '';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  return (
    <nav className={`${styles.nav} ${visible ? styles.show : styles.hide} ${atTop ? styles.transparent : styles.solid}`}>
      <Link to="/" onClick={(e) => handleNavClick('/', e)} className={styles.logoLink}>
        <div className={styles.logo}> {config.home.hero.name}</div>
      </Link>

      <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
        {config.navbar.showHome && (
          <li><Link to="/" onClick={(e) => handleNavClick('/', e)}>Home</Link></li>
        )}
        {config.navbar.showCV && config.resume?.filename && (
          <li><a href={config.resume.filename} target="_blank" rel="noopener noreferrer">CV</a></li>
        )}
        {config.navbar.showProjects && (
          <li><Link to="/projects/" onClick={(e) => handleNavClick('/projects/', e)}>Projects</Link></li>
        )}
        {config.navbar.showBlogs && (
          <li><Link to="/blogs/" onClick={(e) => handleNavClick('/blogs/', e)}>Blogs</Link></li>
        )}
        {config.navbar.showLogs && (
          <li><Link to="/devlogs/" onClick={(e) => handleNavClick('/devlogs/', e)}>Logs</Link></li>
        )}
        {config.navbar.showArchive && (
          <li><Link to="/archive/" onClick={(e) => handleNavClick('/archive/', e)}>Archive</Link></li>
        )}
      </ul>
    </nav>
  );
}
