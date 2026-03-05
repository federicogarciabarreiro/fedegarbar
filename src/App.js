import './App.css';
import { useEffect, useRef, useState } from 'react';
import { sectionsData, headerData, introText, footerText } from './sectionData';

import Header from './components/Header';
import Intro from './components/Intro';
import ProjectGallery from './components/ProjectGallery';
import Footer from './components/Footer';

function App() {
  const [language, setLanguage] = useState('es');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isLanguageFading, setIsLanguageFading] = useState(false);
  const [sectionsRenderKey, setSectionsRenderKey] = useState(0);
  const fadeTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  const handleLanguageChange = (nextLanguage) => {
    if (nextLanguage === language || isLanguageFading) {
      return;
    }

    setIsLanguageFading(true);

    fadeTimerRef.current = setTimeout(() => {
      setLanguage(nextLanguage);
      setSectionsRenderKey((value) => value + 1);
      setIsLanguageFading(false);
    }, 180);
  };

  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`app ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <Header 
        data={headerData} 
        language={language} 
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      <main
        key={sectionsRenderKey}
        className={`page-sections ${isLanguageFading ? 'language-fade' : ''}`}
      >
        <Intro text={introText[language]} />

        <ProjectGallery 
          projects={sectionsData} 
          language={language} 
        />

        <Footer text={footerText[language]} language={language} />
      </main>
    </div>
  );
}

export default App;