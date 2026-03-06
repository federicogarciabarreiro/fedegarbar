import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import ArchitectureDiagram from './ArchitectureDiagram';
import 'sweetalert2/dist/sweetalert2.min.css';

function ProjectItem({
  project,
  language,
  labels,
  architectureLabels,
  architectureProjectId,
  isExpanded,
  onClick,
  isLanguageFading = false
}) {
  const title = language === 'es' ? project.title : project.title_en;
  const content = language === 'es' ? project.content : project.content_en;
  const contentRef = useRef(null);
  const [needsExtraContentSpace, setNeedsExtraContentSpace] = useState(false);
  const projectLinks = Array.isArray(project.link)
    ? project.link
    : (project.link ? [project.link] : []);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isExpanded, language]);

  const handleClose = (e) => {
    e.stopPropagation();
    onClick();
  };

  const handleContentClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const anchor = target.closest('a');
    if (!anchor) {
      return;
    }

    const rawHref = anchor.getAttribute('href') || '';
    const href = rawHref.trim();
    const isBuildingPlaceholder = /^inbuildings?$/i.test(href);
    const sectionLinkMatch = href.match(/^sectionlink(?::(\d+))?$/i);
    const isSectionLinkPlaceholder = Boolean(sectionLinkMatch);

    if (!isBuildingPlaceholder && !isSectionLinkPlaceholder) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const requestedIndex = sectionLinkMatch && sectionLinkMatch[1]
      ? Number(sectionLinkMatch[1])
      : 0;
    const safeIndex = Number.isInteger(requestedIndex) && requestedIndex >= 0 ? requestedIndex : 0;
    const sectionLink = projectLinks[safeIndex];
    const hasSectionLink = typeof sectionLink === 'string' && sectionLink.trim().length > 0;
    const shouldOpenSectionLink = hasSectionLink && !project.isBuilding;

    if (shouldOpenSectionLink) {
      const targetMode = anchor.getAttribute('target') === '_blank' ? '_blank' : '_self';
      window.open(sectionLink, targetMode, 'noopener,noreferrer');
      return;
    }

    Swal.fire({
      icon: 'info',
      title: language === 'es' ? labels.inBuildingAlertTitle.es : labels.inBuildingAlertTitle.en,
      text: language === 'es' ? labels.inBuildingAlertText.es : labels.inBuildingAlertText.en,
      confirmButtonText: language === 'es' ? labels.inBuildingAlertButton.es : labels.inBuildingAlertButton.en,
      confirmButtonColor: '#2b63d6'
    });
  };

  const closeLabel = language === 'es' ? labels.closeAria.es : labels.closeAria.en;
  const shouldRenderArchitectureDiagram = project.id === architectureProjectId;
  const forceFiftyFiftySplit = Boolean(project.forceFiftyFiftySplit);

  useEffect(() => {
    if (!isExpanded || shouldRenderArchitectureDiagram || forceFiftyFiftySplit) {
      setNeedsExtraContentSpace(false);
      return;
    }

    const measureOverflow = () => {
      const contentElement = contentRef.current;
      if (!contentElement) {
        return;
      }

      const hasOverflow = contentElement.scrollHeight > (contentElement.clientHeight + 2);
      setNeedsExtraContentSpace(hasOverflow);
    };

    const frame = window.requestAnimationFrame(measureOverflow);
    window.addEventListener('resize', measureOverflow);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', measureOverflow);
    };
  }, [isExpanded, language, content.length, shouldRenderArchitectureDiagram, forceFiftyFiftySplit]);

  return (
    <div
      className={`gallery-item ${isExpanded ? 'expanded' : ''} ${shouldRenderArchitectureDiagram ? 'has-architecture-diagram' : ''} ${needsExtraContentSpace ? 'needs-extra-content-space' : ''}`}
      onClick={!isExpanded ? onClick : undefined}
    >
      <button
        className="close-button"
        onClick={handleClose}
        aria-label={closeLabel}
      />

      <div className="project-image-container">
        {shouldRenderArchitectureDiagram ? (
          <ArchitectureDiagram language={language} labels={architectureLabels} />
        ) : (
          <img
            src={project.image}
            alt={title}
            className="project-image media-layer media-image"
            loading="lazy"
          />
        )}
        <div className="project-title-overlay">
          <span className={`lang-text ${isLanguageFading ? 'fading' : ''}`}>{title}</span>
        </div>
      </div>

      <div className="content" ref={contentRef} onClick={handleContentClick}>
        <h2 className={`lang-text ${isLanguageFading ? 'fading' : ''}`}>{title}</h2>
        <ul>
          {content.map((item, i) => (
            <li
              key={i}
              className={`lang-text ${isLanguageFading ? 'fading' : ''}`}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectItem;