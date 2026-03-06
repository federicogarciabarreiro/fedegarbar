import React from "react";

export default function ArchitectureDiagram({ language = 'es', labels }) {
  const title = language === 'es' ? labels.title.es : labels.title.en;
  const clients = language === 'es' ? labels.clients.es : labels.clients.en;
  const backend = language === 'es' ? labels.backend.es : labels.backend.en;
  const database = language === 'es' ? labels.database.es : labels.database.en;

  return (
    <div className="architecture">
      <h2>{title}</h2>

      <div className="layer clients">
        {clients.map((clientTitle) => (
          <Box key={clientTitle} title={clientTitle} />
        ))}
      </div>

      <Arrow />

      <div className="layer backend">
        <Box title={backend} highlight />
      </div>

      <Arrow />

      <div className="layer database">
        <Box title={database} />
      </div>
    </div>
  );
}

function Box({ title, highlight }) {
  return (
    <div className={`box ${highlight ? "highlight" : ""}`}>
      {title}
    </div>
  );
}

function Arrow() {
  return <div className="arrow">↓</div>;
}