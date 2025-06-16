import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import styles from '../styles/PageTransition.module.css';

interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
}

export default function PageTransition({ children, transitionKey }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start invisible, then fade in after a brief moment
    setIsVisible(false);
    
    // Fade in with a slight delay to ensure the transition is visible
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [transitionKey]); // Re-run effect whenever transitionKey changes

  return (
    <div 
      key={transitionKey} 
      className={`${styles.pageTransition} ${isVisible ? styles.fadeIn : styles.fadeOut}`}
    >
      {children}
    </div>
  );
}