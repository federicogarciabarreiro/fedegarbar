function Header({ data, language, onLanguageChange, theme, onThemeToggle }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-brand">
            <img
              src="/logo512.png"
              alt="Site logo"
              className="header-logo"
            />
            <h1>{data.name}</h1>
          </div>
          <p className="header-subtitle">
            {language === 'es' ? data.title_es : data.title_en}
          </p>
        </div>

        <div className="header-right">
          <nav className="nav">
            <a
              href={data.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="action-link"
            >
              <span className="action-icon" aria-hidden="true">in</span>
              <span>LinkedIn</span>
            </a>
            <a
              href={data.cv_download}
              download
              className="action-link"
            >
              <span className="action-icon" aria-hidden="true">⇩</span>
              <span>CV</span>
            </a>
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