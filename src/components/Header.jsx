function Header({ data, language, onLanguageChange }) {
  return (
    <header className="header">
      <h1>{data.name}</h1>
      <p>{language === 'es' ? data.title_es : data.title_en}</p>
      <p>{data.contact}</p>
      <nav>
        <a href={data.links.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>{' '}
        |{' '}
        <a href={data.cv_download} download>
          CV
        </a>
      </nav>

      <div className="language-switch">
        <button 
          onClick={() => onLanguageChange('es')}
          className={language === 'es' ? 'active' : ''}
        >
          Español
        </button>
        <button 
          onClick={() => onLanguageChange('en')}
          className={language === 'en' ? 'active' : ''}
        >
          English
        </button>
      </div>
    </header>
  );
}

export default Header;