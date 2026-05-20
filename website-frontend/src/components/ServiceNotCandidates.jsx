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
    <section className="best-hair-transplant-not-candidate-strip">
      <div className="best-hair-transplant-not-candidate-inner">
        <h2 className="best-hair-transplant-not-candidate-heading">
          {displayHeading}
        </h2>
        <div className="best-hair-transplant-not-candidate-list">
          {activeBullets.map((pt, i) => (
            <div key={i} className="best-hair-transplant-not-candidate-item">
              <span className="best-hair-transplant-not-candidate-check">
                <svg
                  className="best-hair-transplant-not-candidate-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>{pt.bulletText}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
