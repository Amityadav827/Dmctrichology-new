"use client";

import React, { useState } from "react";

function cleanTitle(title = "") {
  // Strip leading "1. " / "2. " / "3. " number prefixes
  return title.replace(/^\d+\.\s*/, "").trim();
}

export default function ServiceTechniques({ data }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!data || data.isVisible === false) return null;

  const { sectionHeading, techniques } = data;
  const activeTechniques = (techniques || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeTechniques.length === 0 && !sectionHeading) return null;

  const paragraphs = (desc = "") =>
    String(desc)
      .split(/\n+/)
      .map(p => p.trim())
      .filter(Boolean);

  return (
    <section className="stq-section">
      <div className="stq-container">

        {/* Header */}
        <div className="stq-header">
          <span className="dmc-kicker" style={{ justifyContent: "center", display: "flex" }}>Our Approach</span>
          <h2 className="dmc-heading" style={{ textAlign: "center", marginBottom: 0 }}>
            {sectionHeading || "Hair Transplant Techniques"}
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="stq-tabs" role="tablist">
          {activeTechniques.map((tech, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={activeIdx === i}
              className={`stq-tab${activeIdx === i ? " active" : ""}`}
              onClick={() => setActiveIdx(i)}
            >
              <span className="stq-tab-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="stq-tab-label">{cleanTitle(tech.title)}</span>
            </button>
          ))}
        </div>

        {/* Active Panel */}
        {activeTechniques.map((tech, i) => (
          <div
            key={i}
            role="tabpanel"
            className={`stq-panel${activeIdx === i ? " active" : ""}`}
            aria-hidden={activeIdx !== i}
          >
            <div className="stq-panel-inner">
              <div className="stq-panel-left">
                <span className="stq-panel-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="stq-panel-title">{cleanTitle(tech.title)}</h3>
                <div className="stq-panel-divider" />
                <p className="stq-panel-badge">
                  {i === 0 ? "Traditional Method" : i === 1 ? "Most Popular" : "Exclusive to DMC"}
                </p>
              </div>
              <div className="stq-panel-right">
                {paragraphs(tech.description).map((para, j) => (
                  <p key={j} className="stq-panel-para">{para}</p>
                ))}
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
