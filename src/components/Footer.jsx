import { useEffect, useRef, useState } from 'react';

function Footer({ text, language = 'es' }) {
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
        <span className="footer-copy-text">{text}</span>
        <span className="footer-copy-state">{labels[copyState]}</span>
      </button>
    </footer>
  );
}

export default Footer;