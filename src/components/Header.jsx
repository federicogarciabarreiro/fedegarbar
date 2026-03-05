import { useState } from 'react';

function Header({ data, language, isLanguageFading = false, onLanguageChange, theme, onThemeToggle, effectsEnabled, onEffectsToggle }) {
  const [profileOrbSrc, setProfileOrbSrc] = useState(data.profile_photo || '/logo512.png');

  const handleOrbError = () => {
    if (profileOrbSrc !== '/logo512.png') {
      setProfileOrbSrc('/logo512.png');
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
              src="/logo512.png"
              alt="Site logo"
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
              ES
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={language === 'en' ? 'active' : ''}
            >
              EN
            </button>
          </div>

          <button
            className={`effects-switch ${effectsEnabled ? 'active' : 'inactive'}`}
            onClick={onEffectsToggle}
            aria-label={effectsEnabled ? 'Disable visual effects' : 'Enable visual effects'}
            title={effectsEnabled ? 'Disable effects' : 'Enable effects'}
          >
            <span className="effects-switch-icon" aria-hidden="true">
              ✨
            </span>
          </button>

          <button
            className="theme-switch"
            onClick={onThemeToggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
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