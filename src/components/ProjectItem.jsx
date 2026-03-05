function ProjectItem({ project, language }) {
  const title = language === 'es' ? project.title : project.title_en;
  const content = language === 'es' ? project.content : project.content_en;

  return (
    <div className="gallery-item">
      <img 
        src={project.image} 
        alt={title} 
        className="icon-image" 
        loading="lazy"
      />
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