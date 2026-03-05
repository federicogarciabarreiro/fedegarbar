import { useState } from 'react';
import ProjectItem from './ProjectItem';

function ProjectGallery({ projects, language }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleItemClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="gallery-container">
      <section className="gallery">
        {projects.map((project, index) => (
          <ProjectItem
            key={index}
            project={project}
            language={language}
            isExpanded={expandedIndex === index}
            onClick={() => handleItemClick(index)}
          />
        ))}
      </section>
    </div>
  );
}

export default ProjectGallery;