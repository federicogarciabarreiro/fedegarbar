import './App.css';
import { useEffect, useRef, useState } from 'react';
import { sectionsData, headerData, introText, footerText, siteConfig, uiSoundMap } from './sectionData';

import Header from './components/Header';
import Intro from './components/Intro';
import ProjectGallery from './components/ProjectGallery';
import Footer from './components/Footer';

function App() {
  const [language, setLanguage] = useState(siteConfig.language.default || 'es');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [effectsEnabled, setEffectsEnabled] = useState(() => {
    const stored = localStorage.getItem('effectsEnabled');
    return stored === null ? true : stored === 'true';
  });
  const [isLanguageFading, setIsLanguageFading] = useState(false);
  const fadeTimerRef = useRef(null);
  const fadeEndTimerRef = useRef(null);
  const audioPoolRef = useRef(new Map());

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('effectsEnabled', String(effectsEnabled));
  }, [effectsEnabled]);

  useEffect(() => {
    const { page } = siteConfig;

    if (page.title) {
      document.title = page.title;
    }

    if (page.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', page.description);
    }

    if (page.favicon) {
      let faviconLink = document.querySelector('link[rel="icon"]');
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.setAttribute('rel', 'icon');
        document.head.appendChild(faviconLink);
      }
      faviconLink.setAttribute('href', page.favicon);
    }

    if (page.appleTouchIcon) {
      let appleTouchLink = document.querySelector('link[rel="apple-touch-icon"]');
      if (!appleTouchLink) {
        appleTouchLink = document.createElement('link');
        appleTouchLink.setAttribute('rel', 'apple-touch-icon');
        document.head.appendChild(appleTouchLink);
      }
      appleTouchLink.setAttribute('href', page.appleTouchIcon);
    }
  }, []);

  useEffect(() => {
    const themeColor = theme === 'dark'
      ? (siteConfig.page.themeColorDark || '#14181d')
      : (siteConfig.page.themeColorLight || '#eceef3');

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }

      if (fadeEndTimerRef.current) {
        clearTimeout(fadeEndTimerRef.current);
      }
    };
  }, []);

  const handleLanguageChange = (nextLanguage) => {
    if (nextLanguage === language || isLanguageFading) {
      return;
    }

    playSound('language');
    setIsLanguageFading(true);

    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
    }

    if (fadeEndTimerRef.current) {
      clearTimeout(fadeEndTimerRef.current);
    }

    fadeTimerRef.current = setTimeout(() => {
      setLanguage(nextLanguage);
    }, siteConfig.language.fadeOutMs);

    fadeEndTimerRef.current = setTimeout(() => {
      setIsLanguageFading(false);
    }, siteConfig.language.fadeTotalMs);
  };

  const handleThemeToggle = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      playSound(nextTheme === 'dark' ? 'night' : 'day');
      return nextTheme;
    });
  };

  const handleEffectsToggle = () => {
    setEffectsEnabled((current) => {
      const next = !current;
      playSound(next ? 'effects_on' : 'effects_off');
      return next;
    });
  };

  const playSound = (soundKey) => {
    const source = uiSoundMap[soundKey] || uiSoundMap.button;
    let template = audioPoolRef.current.get(soundKey);

    if (!template) {
      template = new Audio(source);
      template.preload = 'none';
      template.volume = 0.55;
      audioPoolRef.current.set(soundKey, template);
    }

    try {
      const shot = template.cloneNode(true);
      if (!(shot instanceof HTMLAudioElement)) {
        return;
      }

      shot.volume = template.volume;
      const playPromise = shot.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } catch {
      return;
    }
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest('button:disabled')) {
        return;
      }

      if (target.closest('.theme-switch, .effects-switch, .language-switch button')) {
        return;
      }

      if (target.closest('.gallery-arrow')) {
        const prevArrow = target.closest('.gallery-arrow.prev');
        playSound(prevArrow ? 'arrow_prev' : 'arrow_next');
        return;
      }

      if (target.closest('.video-control-button')) {
        playSound('button');
        return;
      }

      if (target.closest('.video-controls-overlay')) {
        return;
      }

      if (target.closest('.close-button')) {
        playSound('section_close');
        return;
      }

      if (target.closest('.gallery-item')) {
        playSound('section_open');
        return;
      }

      const soundTarget = target.closest('[data-sound]');
      if (soundTarget) {
        const key = soundTarget.getAttribute('data-sound');
        if (key) {
          playSound(key);
        }
        return;
      }

      if (target.closest('a')) {
        playSound('link');
        return;
      }

      if (target.closest('button')) {
        playSound('button');
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <div className={`app ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <div className={`ambient-particles ${effectsEnabled ? '' : 'off'}`} aria-hidden="true" />

      <Header 
        data={headerData} 
        language={language} 
        isLanguageFading={isLanguageFading}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        effectsEnabled={effectsEnabled}
        onEffectsToggle={handleEffectsToggle}
      />

      <main className="page-sections">
        <Intro text={introText[language]} isLanguageFading={isLanguageFading} />

        <ProjectGallery 
          projects={sectionsData} 
          language={language} 
          isLanguageFading={isLanguageFading}
        />

        <Footer
          text={footerText[language]}
          language={language}
          isLanguageFading={isLanguageFading}
          codeHref={headerData.links.github}
        />
      </main>
    </div>
  );
}

export default App;