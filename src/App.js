import './App.css';
import { useState } from 'react';
import { sectionsData, headerData, introText, footerText } from './sectionData';

import Header from './components/Header';
import Intro from './components/Intro';
import ProjectGallery from './components/ProjectGallery';
import Footer from './components/Footer';

function App() {
  const [language, setLanguage] = useState('es');

  return (
    <div className="app">
      <Header 
        data={headerData} 
        language={language} 
        onLanguageChange={setLanguage} 
      />

      <Intro text={introText[language]} />

      <ProjectGallery 
        projects={sectionsData} 
        language={language} 
      />

      <Footer text={footerText[language]} />
    </div>
  );
}

export default App;