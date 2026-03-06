import { useEffect, useRef, useState } from 'react';

function Footer({ text, language = 'es', labels, isLanguageFading = false, codeHref = '' }) {
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

  const copyLabels = {
    idle: language === 'es' ? labels.copyIdle.es : labels.copyIdle.en,
    copied: language === 'es' ? labels.copySuccess.es : labels.copySuccess.en,
    error: language === 'es' ? labels.copyError.es : labels.copyError.en
  };

  const codeLinkLabel = language === 'es'
    ? labels.codeLink.es
    : labels.codeLink.en;

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
        <span className={`footer-copy-state lang-text ${isLanguageFading ? 'fading' : ''}`}>{copyLabels[copyState]}</span>
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