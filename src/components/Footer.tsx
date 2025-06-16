import styles from '../styles/Footer.module.css';
import config from '../config/config';

const Footer = () => {
  const footerConfig = config.footer || {};
  const footerStyle = {
    backgroundImage: `url('${footerConfig.background || '/background/hero.jpg'}')`,
  };

  const backgroundFixedStyle = {
    backgroundImage: `url('${footerConfig.background || '/background/hero.jpg'}')`,
  };

  return (
    <footer className={styles.footer} style={footerStyle}>
      <div className={styles.backgroundFixed} style={backgroundFixedStyle}></div>
      <div className={styles.footerText}>
        <p>{footerConfig.copyright || '© 2025 All rights reserved.'}</p>
        <p>Powered by <a href="https://github.com/HuJacobJiabao/onigiri-press" target="_blank" rel="noopener noreferrer">🍙OnigiriPress</a></p>
        <p>{footerConfig.message || 'Welcome to my portfolio website!'}</p>
      </div>
    </footer>
  );
};

export default Footer;
