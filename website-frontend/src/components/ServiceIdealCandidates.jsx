import React from 'react';

export default function ServiceIdealCandidates({ data, pageSlug = "" }) {
  if (!data) return null;
  if (data.isVisible === false) return null;

  const { sectionHeading, introText, bottomConclusionText, sectionImage, altText, bullets } = data;

  const activeBullets = (bullets || [])
    .filter(b => b.isVisible !== false && b.bulletText?.trim() !== "")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (activeBullets.length === 0) return null;

  return (
    <section className="service-candidates-section">
      <div className="service-candidates-container">

        {/* Left: Content */}
        <div className="service-candidates-content-col">
          <span className="sic-kicker">Ideal Candidates</span>
          {sectionHeading && <h2 className="sic-heading">{sectionHeading}</h2>}
          {introText && <p className="sic-intro">{introText}</p>}

          <ul className="sic-list">
            {activeBullets.map((bullet, idx) => (
              <li key={bullet._id || idx} className="sic-item">
                <span className="sic-icon-wrap" aria-hidden="true">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
                <span className="sic-text">{bullet.bulletText}</span>
              </li>
            ))}
          </ul>

          {bottomConclusionText && (
            <p className="sic-conclusion">{bottomConclusionText}</p>
          )}
        </div>

        {/* Right: Image */}
        {sectionImage && (
          <div className="service-candidates-image-col">
            <div className="service-candidates-image-wrapper">
              <img
                src={sectionImage}
                alt={altText || sectionHeading || "Ideal Candidates graphic"}
                className="service-candidates-img"
                loading="lazy"
              />
              <div className="sic-img-badge">
                <span className="sic-img-badge-num">{activeBullets.length}+</span>
                <span className="sic-img-badge-label">Qualifying Criteria</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
