import { useEffect, useRef, useState } from 'react';

function ProjectItem({ project, language, isExpanded, onClick }) {
  const title = language === 'es' ? project.title : project.title_en;
  const content = language === 'es' ? project.content : project.content_en;
  const videoSource =
    language === 'es'
      ? (project.video_es || project.video)
      : (project.video_en || project.video);
  const contentRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isExpanded, language]);

  useEffect(() => {
    setVideoError(false);
  }, [project, language, isExpanded]);

  const handleClose = (e) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      className={`gallery-item ${isExpanded ? 'expanded' : ''}`}
      onClick={!isExpanded ? onClick : undefined}
    >
      <button
        className="close-button"
        onClick={handleClose}
        aria-label="Close"
      />

      <div className="project-image-container">
        {isExpanded && videoSource && !videoError ? (
          <video
            className="project-video"
            src={videoSource}
            poster={project.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
          />
        ) : (
          <img
            src={project.image}
            alt={title}
            className="project-image"
            loading="lazy"
          />
        )}
        <div className="project-title-overlay">
          {title}
        </div>
      </div>

      <div className="content" ref={contentRef}>
        <h2>{title}</h2>
        <ul>
          {content.map((item, i) => (
            <li
              key={i}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectItem;