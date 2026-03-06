import { useEffect, useRef, useState } from 'react';
import ProjectItem from './ProjectItem';

function ProjectGallery({
  projects,
  language,
  labels,
  projectLabels,
  architectureLabels,
  architectureProjectId,
  isLanguageFading = false
}) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [expandedIndex, setExpandedIndex] = useState(() => (window.innerWidth <= 768 ? 0 : null));
  const galleryRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setExpandedIndex(isMobile ? 0 : null);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || expandedIndex !== null || !projects.length) {
      return;
    }

    setExpandedIndex(0);
  }, [isMobile, expandedIndex, projects.length]);

  useEffect(() => {
    if (!projects.length) {
      setExpandedIndex(null);
      return;
    }

    if (expandedIndex !== null && expandedIndex >= projects.length) {
      setExpandedIndex(projects.length - 1);
    }
  }, [expandedIndex, projects.length]);

  const handleItemClick = (index) => {
    if (isMobile) {
      setExpandedIndex(index);
      return;
    }

    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const scrollGalleryBy = (direction) => {
    if (!galleryRef.current) {
      return;
    }

    if (isMobile) {
      const safeIndex = expandedIndex === null ? 0 : expandedIndex;
      const nextIndex = Math.max(0, Math.min(projects.length - 1, safeIndex + direction));
      setExpandedIndex(nextIndex);
      return;
    }

    const step = Math.round(galleryRef.current.clientWidth * 0.75);
    galleryRef.current.scrollBy({
      left: direction * step,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (expandedIndex === null || !galleryRef.current || isMobile) {
      return;
    }

    const expandedItem = galleryRef.current.querySelectorAll('.gallery-item')[expandedIndex];
    if (expandedItem) {
      expandedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [expandedIndex, isMobile]);

  const isPrevDisabled = isMobile && (expandedIndex === null || expandedIndex <= 0);
  const isNextDisabled = isMobile && (expandedIndex === null || expandedIndex >= projects.length - 1);
  const activeIndex = isMobile ? (expandedIndex === null ? 0 : expandedIndex) : expandedIndex;
  const mobileProject = isMobile && activeIndex !== null ? projects[activeIndex] : null;

  return (
    <div className="gallery-container">
      <div className="gallery-controls">
        <button
          className="gallery-arrow prev"
          onClick={() => scrollGalleryBy(-1)}
          aria-label={language === 'es' ? labels.prevSectionAria.es : labels.prevSectionAria.en}
          disabled={isPrevDisabled}
        >
          ‹
        </button>
        <button
          className="gallery-arrow next"
          onClick={() => scrollGalleryBy(1)}
          aria-label={language === 'es' ? labels.nextSectionAria.es : labels.nextSectionAria.en}
          disabled={isNextDisabled}
        >
          ›
        </button>
      </div>

      {isMobile ? (
        <section className="gallery mobile-single" ref={galleryRef}>
          {mobileProject && (
            <ProjectItem
              key={activeIndex}
              project={mobileProject}
              language={language}
              labels={projectLabels}
              architectureLabels={architectureLabels}
              architectureProjectId={architectureProjectId}
              isLanguageFading={isLanguageFading}
              isExpanded={true}
              onClick={() => {}}
            />
          )}
        </section>
      ) : (
        <section className="gallery" ref={galleryRef}>
          {projects.map((project, index) => (
            <ProjectItem
              key={index}
              project={project}
              language={language}
              labels={projectLabels}
              architectureLabels={architectureLabels}
              architectureProjectId={architectureProjectId}
              isLanguageFading={isLanguageFading}
              isExpanded={activeIndex === index}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export default ProjectGallery;