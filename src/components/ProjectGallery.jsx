import ProjectItem from './ProjectItem';

function ProjectGallery({ projects, language }) {
  return (
    <section className="gallery">
      {projects.map((project, index) => (
        <ProjectItem 
          key={index} 
          project={project} 
          language={language} 
        />
      ))}
    </section>
  );
}

export default ProjectGallery;