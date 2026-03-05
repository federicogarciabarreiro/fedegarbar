function Header({ data, language, onLanguageChange }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>{data.name}</h1>
          <p className="header-subtitle">
            {language === 'es' ? data.title_es : data.title_en}
          </p>
        </div>

        <div className="header-right">
          <nav className="nav">
            <a href={data.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={data.cv_download} download>
              CV
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
        </div>
      </div>
    </header>
  );
}

export default Header;