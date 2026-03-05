import './App.css';
import { useEffect, useRef, useState } from 'react';
import { sectionsData, headerData, introText, footerText } from './sectionData';

import Header from './components/Header';
import Intro from './components/Intro';
import ProjectGallery from './components/ProjectGallery';
import Footer from './components/Footer';

const SOUND_FILES = {
  day: '/sounds/theme/day.mp3',
  night: '/sounds/theme/night.mp3',
  language: '/sounds/ui/language.mp3',
  copy: '/sounds/ui/copy.mp3',
  effects_on: '/sounds/effects/effects-on.mp3',
  effects_off: '/sounds/effects/effects-off.mp3',
  section_open: '/sounds/ui/section-open.mp3',
  section_close: '/sounds/ui/section-close.mp3',
  arrow_next: '/sounds/ui/arrow-next.mp3',
  arrow_prev: '/sounds/ui/arrow-prev.mp3',
  link: '/sounds/ui/link.mp3',
  button: '/sounds/ui/button.mp3'
};

function App() {
  const [language, setLanguage] = useState('es');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [effectsEnabled, setEffectsEnabled] = useState(() => {
    const stored = localStorage.getItem('effectsEnabled');
    return stored === null ? true : stored === 'true';
  });
  const [isLanguageFading, setIsLanguageFading] = useState(false);
  const [sectionsRenderKey, setSectionsRenderKey] = useState(0);
  const fadeTimerRef = useRef(null);
  const audioPoolRef = useRef(new Map());

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('effectsEnabled', String(effectsEnabled));
  }, [effectsEnabled]);

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

    playSound('language');
    setIsLanguageFading(true);

    fadeTimerRef.current = setTimeout(() => {
      setLanguage(nextLanguage);
      setSectionsRenderKey((value) => value + 1);
      setIsLanguageFading(false);
    }, 180);
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
    const source = SOUND_FILES[soundKey] || SOUND_FILES.button;
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
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        effectsEnabled={effectsEnabled}
        onEffectsToggle={handleEffectsToggle}
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