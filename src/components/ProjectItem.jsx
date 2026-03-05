import { useEffect, useRef, useState } from 'react';

const getYouTubeId = (url) => {
  if (!url) {
    return null;
  }

  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

function ProjectItem({ project, language, isExpanded, onClick }) {
  const title = language === 'es' ? project.title : project.title_en;
  const content = language === 'es' ? project.content : project.content_en;
  const videoSource =
    language === 'es'
      ? (project.video_es || project.video)
      : (project.video_en || project.video);
  const youtubeId = getYouTubeId(videoSource);
  const youtubeEmbedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0`
    : null;
  const contentRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [imageSource, setImageSource] = useState(project.image);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isExpanded, language]);

  useEffect(() => {
    setVideoError(false);
  }, [project, language, isExpanded]);

  useEffect(() => {
    setImageSource(project.image);
  }, [project, language]);

  const handleImageError = () => {
    if (project.image_fallback && imageSource !== project.image_fallback) {
      setImageSource(project.image_fallback);
    }
  };

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
          youtubeEmbedUrl ? (
            <iframe
              className="project-video"
              src={youtubeEmbedUrl}
              title={title}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              className="project-video"
              src={videoSource}
              poster={imageSource}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setVideoError(true)}
            />
          )
        ) : (
          <img
            src={imageSource}
            alt={title}
            className="project-image"
            loading="lazy"
            onError={handleImageError}
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