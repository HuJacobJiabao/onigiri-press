import { useRef, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import styles from '../styles/Projects.module.css';
import { loadStaticProjects, type Project } from '../utils/staticDataLoader';
import config from '../config/config';
import usePageTitle from '../hooks/usePageTitle';

export default function Projects() {
  // Set page title
  usePageTitle('Projects');

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load projects on component mount
  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        const projectsData = await loadStaticProjects();
        setProjects(projectsData);
        console.log('Projects loaded:', projectsData);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
      }
    };

    loadProjectsData();
  }, []);

  const handleSidebarItemClick = (index: number) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const sidebarItems = projects.map(project => ({ title: project.title }));

  if (error) {
    return (
      <Layout 
        title="Projects"
        headerBackground={config.content?.projects?.defaultHeaderBackground || '/background/default_proj.jpg'}
        sidebarItems={[]}
        sidebarItemType="project"
        onSidebarItemClick={() => {}}
      >
        <div className={styles.projectsContainer}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>❌</div>
            <h2>Error Loading Projects</h2>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Projects"
      headerBackground={config.content?.projects?.defaultHeaderBackground || '/background/default_proj.jpg'}
      sidebarItems={sidebarItems}
      sidebarItemType="project"
      onSidebarItemClick={handleSidebarItemClick}
    >
      <div className={styles.projectsContainer}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💻</div>
            <h2>No Projects Yet</h2>
            <p>Projects will be displayed here once they are added.</p>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <div 
                key={project.id}
                ref={el => { cardRefs.current[index] = el; }}
                className={styles.projectCardWrapper}
              >
                <Card
                  title={project.title}
                  date={project.date}
                  category={project.category}
                  description={project.description}
                  image={project.image}
                  id={project.id}
                  tags={project.tags}
                  type="project"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
