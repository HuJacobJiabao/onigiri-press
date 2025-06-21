import React from 'react';
import styles from '../styles/ProfileCard.module.css';
import config from '../config/config';

const ProfileCard: React.FC = () => {
  // Get contact data directly from navigation
  const contactData = config.home.navigation.contact;
  // Use processed avatar path (already includes baseUrl) or fallback
  const avatarSrc = config.home.profileCard.avatar || `${import.meta.env.BASE_URL}favicon.png`;

  return (
    <div className={styles.profileCard}>
      <div className={styles.photoWrapper}>
        <img src={avatarSrc} alt={config.home.profileCard.name} className={styles.photo} />
      </div>
      <h3 className={styles.profileName}>{config.home.profileCard.name}</h3>
      <p className={styles.profileTitle}>{config.home.profileCard.title}</p>
      <p className={styles.profileTitle}>{config.home.profileCard.subtitle}</p>
      <div className={styles.contactCard}>
        <div className={styles.contactList}>
          {contactData?.email && (
            <a href={`mailto:${contactData.email}`} className={styles.contactItem} title="Email">
              <i className="fas fa-envelope"></i>
            </a>
          )}
          {contactData?.github && (
            <a href={contactData.github} className={styles.contactItem} target="_blank" rel="noopener noreferrer" title="GitHub">
              <i className="fab fa-github"></i>
            </a>
          )}
          {contactData?.linkedin && (
            <a href={contactData.linkedin} className={styles.contactItem} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          )}
          {contactData?.twitter && (
            <a href={contactData.twitter} className={styles.contactItem} target="_blank" rel="noopener noreferrer" title="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          )}
          {contactData?.instagram && (
            <a href={contactData.instagram} className={styles.contactItem} target="_blank" rel="noopener noreferrer" title="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {contactData?.weibo && (
            <a href={contactData.weibo} className={styles.contactItem} target="_blank" rel="noopener noreferrer" title="微博">
              <i className="fab fa-weibo"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
