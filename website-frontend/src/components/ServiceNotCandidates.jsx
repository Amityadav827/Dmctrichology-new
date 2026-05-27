import React from "react";

export default function ServiceNotCandidates({ data, serviceTitle = "" }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, bullets } = data;
  const activeBullets = (bullets || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeBullets.length === 0 && !sectionHeading) return null;

  const displayHeading = sectionHeading || `WHO IS NOT A CANDIDATE FOR ${serviceTitle ? serviceTitle.toUpperCase() : "THIS TREATMENT"}?`;

  return (
    <section className="snc-section">
      <div className="snc-inner">
        <div className="snc-header">
          <span className="snc-kicker">Eligibility Check</span>
          <h2 className="snc-heading">{displayHeading}</h2>
          <p className="snc-subtext">
            Please consult our specialists to confirm suitability — certain conditions may affect the outcome.
          </p>
        </div>
        <div className="snc-grid">
          {activeBullets.map((pt, i) => (
            <div key={i} className="snc-card">
              <span className="snc-icon-wrap">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <span className="snc-text">{pt.bulletText}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
