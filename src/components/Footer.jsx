import { useEffect, useRef, useState } from 'react';

function Footer({ text, language = 'es', isLanguageFading = false, codeHref = '' }) {
  const [copyState, setCopyState] = useState('idle');
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      setCopyState('idle');
    }, 1800);
  };

  const labels = {
    idle: language === 'es' ? 'Copiar correo' : 'Copy email',
    copied: language === 'es' ? 'Copiado' : 'Copied',
    error: language === 'es' ? 'No se pudo copiar' : 'Could not copy'
  };

  const codeLinkLabel = language === 'es'
    ? 'Si te interesa, puedes ver el código de este portfolio en GitHub.'
    : 'If you are interested, you can view this portfolio code on GitHub.';

  return (
    <footer className="footer">
      <button
        type="button"
        className={`footer-copy-btn ${copyState === 'copied' ? 'copied' : ''} ${copyState === 'error' ? 'error' : ''}`}
        onClick={handleCopyEmail}
        aria-live="polite"
        data-sound="copy"
      >
        <span className="footer-copy-icon" aria-hidden="true">✉</span>
        <span className={`footer-copy-text lang-text ${isLanguageFading ? 'fading' : ''}`}>{text}</span>
        <span className={`footer-copy-state lang-text ${isLanguageFading ? 'fading' : ''}`}>{labels[copyState]}</span>
      </button>

      {codeHref && (
        <a
          className={`footer-code-link lang-text ${isLanguageFading ? 'fading' : ''}`}
          href={codeHref}
          target="_blank"
          rel="noreferrer"
          data-sound="link"
        >
          {codeLinkLabel}
        </a>
      )}
    </footer>
  );
}

export default Footer;