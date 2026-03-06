import { useState } from 'react';

function Header({ data, labels, language, isLanguageFading = false, onLanguageChange, theme, onThemeToggle, effectsEnabled, onEffectsToggle }) {
  const profileFallback = data.profile_photo_fallback || data.logo?.src || '';
  const [profileOrbSrc, setProfileOrbSrc] = useState(data.profile_photo || profileFallback);

  const handleOrbError = () => {
    if (profileOrbSrc !== profileFallback) {
      setProfileOrbSrc(profileFallback);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-photo-orb" aria-hidden="true">
            <span className="header-photo-orb-ring" />
            <img
              src={profileOrbSrc}
              alt=""
              className="header-photo-orb-image"
              onError={handleOrbError}
            />
          </div>

          <div className="header-brand">
            <img
              src={data.logo?.src || ''}
              alt={language === 'es' ? data.logo?.alt_es : data.logo?.alt_en}
              className="header-logo"
            />
            <h1>{data.name}</h1>
          </div>
          <p className={`header-subtitle lang-text ${isLanguageFading ? 'fading' : ''}`}>
            {language === 'es' ? data.title_es : data.title_en}
          </p>
        </div>

        <div className="header-right">
          <nav className="nav">
            {data.actions?.map((action) => (
              <a
                key={action.id}
                href={action.href}
                target={action.target || undefined}
                rel={action.target === '_blank' ? 'noopener noreferrer' : undefined}
                download={action.download ? true : undefined}
                className="action-link"
                data-sound="link"
              >
                <span className="action-icon" aria-hidden="true">{action.icon}</span>
                <span>{action.label}</span>
              </a>
            ))}
          </nav>

          <div className="language-switch">
            <button
              onClick={() => onLanguageChange('es')}
              className={language === 'es' ? 'active' : ''}
            >
              {labels?.languageOptions?.es}
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={language === 'en' ? 'active' : ''}
            >
              {labels?.languageOptions?.en}
            </button>
          </div>

          <button
            className={`effects-switch ${effectsEnabled ? 'active' : 'inactive'}`}
            onClick={onEffectsToggle}
            aria-label={effectsEnabled
              ? (language === 'es' ? labels.effectsAriaOn.es : labels.effectsAriaOn.en)
              : (language === 'es' ? labels.effectsAriaOff.es : labels.effectsAriaOff.en)}
            title={effectsEnabled
              ? (language === 'es' ? labels.effectsTitleOn.es : labels.effectsTitleOn.en)
              : (language === 'es' ? labels.effectsTitleOff.es : labels.effectsTitleOff.en)}
          >
            <span className="effects-switch-icon" aria-hidden="true">
              ✨
            </span>
          </button>

          <button
            className="theme-switch"
            onClick={onThemeToggle}
            aria-label={theme === 'dark'
              ? (language === 'es' ? labels.themeAriaDark.es : labels.themeAriaDark.en)
              : (language === 'es' ? labels.themeAriaLight.es : labels.themeAriaLight.en)}
            title={theme === 'dark'
              ? (language === 'es' ? labels.themeTitleDark.es : labels.themeTitleDark.en)
              : (language === 'es' ? labels.themeTitleLight.es : labels.themeTitleLight.en)}
          >
            <span className="theme-switch-icon" aria-hidden="true">
              {theme === 'dark' ? '☀' : '☾'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;