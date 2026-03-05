function Intro({ text, isLanguageFading = false }) {
  return (
    <section className="intro">
      <p className={`lang-text ${isLanguageFading ? 'fading' : ''}`}>{text}</p>
    </section>
  );
}

export default Intro;