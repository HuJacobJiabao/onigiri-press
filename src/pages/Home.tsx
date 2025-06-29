import { useState, useEffect } from 'react'
import styles from "../styles/Home.module.css"
import NavBar from "../components/NavBar"
import EducationCard from "../components/EducationCard"
import WorkCard from "../components/WorkCard"
import ProjectCard from "../components/ProjectCard"
import Sidebar from "../components/Sidebar"
import MobileTabs from "../components/MobileTabs"
import ScrollToTop from "../components/ScrollToTop"
import Footer from "../components/Footer"
import config from "../config/config"
import usePageTitle from "../hooks/usePageTitle"

// Define types for config data
interface Education {
    schoolName: string;
    degree: string;
    duration: string;
    location: string;
    logo: {
        src: string;
        backgroundColor?: string;
    };
    highlights: string[];
    border: {
        color?: string;
        hoverColor?: string;
    };
    highlightColor?: string;
}

interface WorkExperience {
    companyName: string;
    location: string;
    logo: {
        src: string;
        backgroundColor?: string;
    };
    border: {
        color?: string;
        hoverColor?: string;
    };
    highlightColor?: string;
    positions: {
        position: string;
        duration: string;
        highlights: string[];
    }[];
}

interface ProjectType {
    // Basic project information
    projectName: string;
    description: string;
    duration: string;
    highlights: string[];
    coverImage: string;
    
    // URLs and related styling - grouped structure
    projectLink?: {
        url?: string;
        textColor?: string;
    };
    
    githubLink?: {
        url?: string;
        backgroundColor?: string;
        textColor?: string;
    };
    
    // Card styling in grouped format
    border: {
        color?: string;
        hoverColor?: string;
    };
    
    // Tag styling for technologies in grouped format
    tag: {
        items: string[];
        backgroundColor?: string;
        textColor?: string;
    };
    
    // Highlight bullet points
    highlightColor?: string;
}

// Helper function to parse markdown links
const parseMarkdownLinks = (text: string): string => {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
};

const Home = () => {
    const [activeSection, setActiveSection] = useState('about')
    
    // Set page title for home page (just the website title)
    usePageTitle('');

    // Get hero background from config (already processed with full URL)
    const heroBackgroundUrl = config.backgrounds?.hero || `${import.meta.env.BASE_URL}background/hero.jpg`;
    
    // Check if hero background is a video file
    const isHeroVideoBackground = heroBackgroundUrl && /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i.test(heroBackgroundUrl);
    
    // Check if device is mobile to disable video on mobile
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);
    
    // Handle window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const nowMobile = window.innerWidth <= 768;
            setIsMobile(nowMobile);
            
            // Note: We now render different elements for mobile vs desktop,
            // so React will handle the transition automatically on re-render.
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile, isHeroVideoBackground]);

    // Video parallax effect (for desktop only)
    useEffect(() => {
        if (!isHeroVideoBackground || isMobile) return;

        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const heroElement = document.querySelector(`.${styles.heroWithVideo}`) as HTMLElement;
            const videoElement = heroElement?.querySelector('video') as HTMLVideoElement;
            
            if (videoElement && heroElement) {
                // Apply parallax transform - video moves slower than scroll
                const translateY = scrolled; // Adjust multiplier for different parallax intensity
                videoElement.style.transform = `translateY(${translateY}px)`    ;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHeroVideoBackground, isMobile]);

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId);
        
        // Only scroll to about section top on desktop
        if (!isMobile) {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    };

    // Helper function to render content dynamically based on navigation section type
    const renderNavigationSection = (sectionId: string) => {
        const navigationSection = config.home.navigation[sectionId];
        if (!navigationSection) return null;

        const { title, icon, type, content, items } = navigationSection;

        switch (type) {
            case 'about':
                return (
                    <div className={styles.rightContent}>
                        <h2>{icon} <span>{title}</span></h2>
                        <div className={styles.introWrapper}>
                            <div className={styles.introTextSection}>
                                <div className={styles.aboutContent}>
                                    {content && 
                                        <p dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(content) }} />
                                    }
                                </div>
                            </div>
                            {navigationSection.photo && (
                                <div className={styles.introImageSection}>
                                    <div className={styles.introPhotoWrapper}>
                                        <img 
                                            src={navigationSection.photo} 
                                            alt="About me" 
                                            className={styles.introPhoto}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'education':
                return (
                    <div className={styles.rightContent}>
                        <h2>{icon} <span>{title}</span></h2>
                        {items?.map((edu: Education, index: number) => (
                            <EducationCard 
                                key={index}
                                schoolName={edu.schoolName}
                                degree={edu.degree}
                                duration={edu.duration}
                                location={edu.location}
                                logoSrc={edu.logo?.src}
                                logoAlt={`${edu.schoolName} Logo`}
                                highlights={edu.highlights}
                                borderColor={edu.border?.color}
                                borderHoverColor={edu.border?.hoverColor}
                                logoBackgroundColor={edu.logo?.backgroundColor}
                                highlightColor={edu.highlightColor}
                            />
                        ))}
                    </div>
                );

            case 'experience': {
                // Since experiences are already grouped by company in the config,
                // we just need to map them to the expected format
                const workExperiences = items as WorkExperience[];

                return (
                    <div className={styles.rightContent}>
                        <h2>{icon} <span>{title}</span></h2>
                        {workExperiences.map((exp: WorkExperience, index: number) => (
                            <WorkCard 
                                key={index}
                                companyName={exp.companyName}
                                positions={exp.positions.map(pos => ({
                                    title: pos.position,
                                    duration: pos.duration,
                                    highlights: pos.highlights
                                }))}
                                location={exp.location}
                                logoSrc={exp.logo?.src}
                                logoAlt={`${exp.companyName} Logo`}
                                borderColor={exp.border?.color}
                                borderHoverColor={exp.border?.hoverColor}
                                logoBackgroundColor={exp.logo?.backgroundColor}
                                highlightColor={exp.highlightColor}
                            />
                        ))}
                    </div>
                );
            }

            case 'projects': {
                return (
                    <div className={styles.rightContent}>
                        <h2 id={`${sectionId}-section`}>{icon} <span>{title}</span></h2>
                        <div className={styles.projectsContainer}>
                            {items?.map((project: ProjectType, index: number) => (
                                <ProjectCard 
                                    key={index}
                                    projectName={project.projectName}
                                    description={project.description}
                                    technologies={project.tag?.items || []}
                                    duration={project.duration}
                                    projectUrl={project.projectLink?.url}
                                    githubUrl={project.githubLink?.url}
                                    imageSrc={project.coverImage || config.home.navigation[sectionId].defaultCover || 'default_cover.jpg'}
                                    imageAlt={`${project.projectName} Project`}
                                    highlights={project.highlights}
                                    borderColor={project.border?.color}
                                    borderHoverColor={project.border?.hoverColor}
                                    highlightColor={project.highlightColor}
                                    projectLinkTextColor={project.projectLink?.textColor}
                                    githubLinkBackgroundColor={project.githubLink?.backgroundColor}
                                    githubLinkTextColor={project.githubLink?.textColor}
                                />
                            ))}
                            <button 
                                className={styles.backToTopButton}
                                onClick={() => {
                                    const isMobile = window.innerWidth <= 768;
                                    if (isMobile) {
                                        const section = document.getElementById(`${sectionId}-section`);
                                        if (section) {
                                            section.scrollIntoView({ 
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }
                                    } else {
                                        const aboutSection = document.getElementById('about');
                                        if (aboutSection) {
                                            aboutSection.scrollIntoView({ 
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }
                                    }
                                }}
                            >
                                <i className="fas fa-arrow-up"></i>
                                Back to {title} Top
                            </button>
                        </div>
                    </div>
                );
            }

            case 'contact': {
                // Get contact color configuration
                const contactColors = navigationSection.textColor ? {
                    '--contact-text-color': navigationSection.textColor
                } as React.CSSProperties : {};

                return (
                    <div className={styles.rightContent}>
                        <h2>{icon} <span>{title}</span></h2>
                        {content && 
                            <p dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(content) }} />
                        }
                        <div className={styles.contactSection} style={contactColors}>
                            {navigationSection.email && (
                                <a href={`mailto:${navigationSection.email}`} className={styles.contactItem}>
                                    <i className="fas fa-envelope"></i>
                                    <span>{navigationSection.email}</span>
                                </a>
                            )}
                            {navigationSection.github && (
                                <a href={navigationSection.github} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fab fa-github"></i>
                                    <span>GitHub</span>
                                </a>
                            )}
                            {navigationSection.linkedin && (
                                <a href={navigationSection.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fab fa-linkedin"></i>
                                    <span>LinkedIn</span>
                                </a>
                            )}
                            {navigationSection.twitter && (
                                <a href={navigationSection.twitter} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fa-brands fa-x-twitter"></i>
                                    <span>Twitter</span>
                                </a>
                            )}
                            {navigationSection.instagram && (
                                <a href={navigationSection.instagram} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fab fa-instagram"></i>
                                    <span>Instagram</span>
                                </a>
                            )}
                            {navigationSection.weibo && (
                                <a href={navigationSection.weibo} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fab fa-weibo"></i>
                                    <span>Weibo</span>
                                </a>
                            )}
                            {navigationSection.xiaohongshu && (
                                <a href={navigationSection.xiaohongshu} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fas fa-heart"></i>
                                    <span>Red Note</span>
                                </a>
                            )}
                            {navigationSection.wechat && (
                                <div className={styles.contactItem}>
                                    <i className="fab fa-weixin"></i>
                                    <span>WeChat: {navigationSection.wechat}</span>
                                </div>
                            )}
                            {navigationSection.qq && (
                                <div className={styles.contactItem}>
                                    <i className="fab fa-qq"></i>
                                    <span>QQ: {navigationSection.qq}</span>
                                </div>
                            )}
                            {navigationSection.discord && (
                                <a href={navigationSection.discord} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fab fa-discord"></i>
                                    <span>Discord</span>
                                </a>
                            )}
                            {navigationSection.youtube && (
                                <a href={navigationSection.youtube} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fab fa-youtube"></i>
                                    <span>YouTube</span>
                                </a>
                            )}
                            {navigationSection.bilibili && (
                                <a href={navigationSection.bilibili} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fa-brands fa-bilibili"></i>
                                    <span>Bilibili</span>
                                </a>
                            )}
                            {navigationSection.zhihu && (
                                <a href={navigationSection.zhihu} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <i className="fa-brands fa-zhihu"></i>
                                    <span>Zhihu</span>
                                </a>
                            )}
                        </div>
                    </div>
                );
            }

            default:
                return null;
        }
    }

    return (
        <div className={styles.wrapper}>
            
            <NavBar />
            
            {/* Mobile Side Tabs - Fixed positioned on left side, only visible on mobile */}
            <MobileTabs 
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />
            
            {/* Hero Section */}
            <section 
                className={isHeroVideoBackground ? styles.heroWithVideo : styles.hero}
                style={!isHeroVideoBackground ? {
                    backgroundImage: `url('${heroBackgroundUrl}')`,
                } : {}}
            >
                {/* Video background - only render when needed */}
                {isHeroVideoBackground && (
                    <div className={styles.heroVideoWrapper}>
                        <video 
                            className={styles.heroVideo}
                            autoPlay
                            muted
                            loop
                            playsInline
                            webkit-playsinline="true"
                        >
                            <source src={heroBackgroundUrl} type="video/mp4" />
                            {/* Fallback for browsers that don't support video */}
                            <div 
                                className={styles.heroVideoFallback}
                                style={{
                                    backgroundImage: `url('${import.meta.env.BASE_URL}background/hero.jpg')`,
                                }}
                            ></div>
                        </video>
                    </div>
                )}
                
                <div className={styles.heroContent}>
                    <h1>{config.home.hero.name}</h1>
                    <p>{config.home.hero.quote}</p>
                </div>
                <button 
                    className={styles.downArrow}
                    onClick={() => {
                        const aboutSection = document.getElementById('about');
                        if (aboutSection) {
                            aboutSection.scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }}
                >
                    <i className="fas fa-angle-down scroll-down-effects"></i>
                </button>
            </section>


            {/* About Section */}
            <section id="about" className={styles.about}>
                <div className={styles.aboutWrapper}>
                    <div className={styles.aboutContainer}>
                        {/* Left Sidebar - Hidden on mobile */}
                        <div className={styles.desktopSidebar}>
                            <Sidebar 
                                activeSection={activeSection}
                                onSectionChange={handleSectionChange}
                            />
                        </div>

                        {/* Right Content Area */}
                        <div className={styles.rightContentArea}>
                            {renderNavigationSection(activeSection)}
                        </div>
                        
                        {/* Mobile Sidebar - Only visible on mobile, placed below content */}
                        <div className={styles.mobileSidebar}>
                            <Sidebar 
                                activeSection={activeSection}
                                onSectionChange={handleSectionChange}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {/* Scroll to Top Button */}
            <ScrollToTop />
        </div>
    )
}

export default Home