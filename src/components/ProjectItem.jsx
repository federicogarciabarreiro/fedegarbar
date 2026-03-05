function ProjectItem({ project, language, isExpanded, onClick }) {
  const title = language === 'es' ? project.title : project.title_en;
  const content = language === 'es' ? project.content : project.content_en;

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
        <img
          src={project.image}
          alt={title}
          className="project-image"
          loading="lazy"
        />
        <div className="project-title-overlay">
          {title}
        </div>
      </div>

      <div className="content">
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