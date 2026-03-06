import React from "react";

export default function ArchitectureDiagram() {
  return (
    <div className="architecture">
      <h2>Arquitectura del Sistema</h2>

      <div className="layer clients">
        <Box title="React Web App" />
        <Box title="Backoffice Admin" />
        <Box title="E-commerce" />
        <Box title="Unity WebGL Experience" />
      </div>

      <Arrow />

      <div className="layer backend">
        <Box title="FastAPI Backend" highlight />
      </div>

      <Arrow />

      <div className="layer database">
        <Box title="Supabase / PostgreSQL" />
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