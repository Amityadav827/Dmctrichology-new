import React from 'react';

export default function ServiceIdealCandidates({ data, pageSlug = "" }) {
  if (!data) return null;

  const { sectionHeading, introText, bottomConclusionText, sectionImage, altText, bullets } = data;

  // Filter visible bullets and sort by sortOrder ascending
  const activeBullets = (bullets || [])
    .filter(b => b.isVisible !== false && b.bulletText?.trim() !== "")
    .sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      return orderA - orderB;
    });

  if (activeBullets.length === 0) {
    return null;
  }

  return (
    <>
      <section className="service-candidates-section">
        <div className="service-candidates-container">
        {/* Left Side: Content Column */}
        <div className="service-candidates-content-col">
          {sectionHeading && (
            <h2 className="service-candidates-heading">
              {sectionHeading}
            </h2>
          )}

          {introText && (
            <p className="service-candidates-intro">
              {introText}
            </p>
          )}

          <ul className="service-candidates-list">
            {activeBullets.map((bullet, idx) => (
              <li key={bullet._id || idx} className="service-candidates-list-item">
                <span className="service-ideal-check-icon-wrapper">
                  <svg 
                    className="service-ideal-check-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="3" 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="service-candidates-text">
                  {bullet.bulletText}
                </span>
              </li>
            ))}
          </ul>

          {bottomConclusionText && (
            <p className="service-candidates-conclusion">
              {bottomConclusionText}
            </p>
          )}
        </div>

        {/* Right Side: Image Column */}
        {sectionImage && (
          <div className="service-candidates-image-col">
            <div className="service-candidates-image-wrapper">
              <img 
                src={sectionImage} 
                alt={altText || sectionHeading || "Ideal Candidates graphic"} 
                className="service-candidates-img" 
                loading="lazy"
              />
            </div>
          </div>
        )}
        </div>
      </section>

      {pageSlug === "best-hair-transplant" && (
        <section className="best-hair-transplant-not-candidate-strip">
          <div className="best-hair-transplant-not-candidate-inner">
            <h2 className="best-hair-transplant-not-candidate-heading">
              WHO IS NOT A CANDIDATE FOR HAIR TRANSPLANT SURGERY?
            </h2>
            <div className="best-hair-transplant-not-candidate-list">
              <div className="best-hair-transplant-not-candidate-item">
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
                <span>Those with a keloidal tendency</span>
              </div>
              <div className="best-hair-transplant-not-candidate-item">
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
                <span>Those with active infection or inflammation on the scalp.</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
