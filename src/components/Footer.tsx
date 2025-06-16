import styles from '../styles/Footer.module.css';
import config from '../config/config';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.backgroundFixed}></div>
      <div className={styles.footerText}>
        <p>{config.footer.copyright}</p>
        <p>Powered by <a href="https://github.com/HuJacobJiabao/onigiri-press" target="_blank" rel="noopener noreferrer">🍙OnigiriPress</a></p>
        <p>{config.footer.message}</p>
      </div>
    </footer>
  );
};

export default Footer;
