import React from "react";
import { Check } from "lucide-react";

export default function ServiceAftercare({ data, pageSlug = "" }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, introText, conclusionText, bullets } = data;
  const activeBullets = (bullets || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section className="service-aftercare-section">
      <div className="service-aftercare-container">
        {/* Left column: heading + intro */}
        <div className="service-aftercare-intro-col">
          <span className="dmc-kicker">Post Treatment</span>
          <h2 className="dmc-heading" style={{ marginBottom: '20px' }}>
            {sectionHeading || "WHAT TO EXPECT AFTER THE TREATMENT?"}
          </h2>
          <div className="service-aftercare-divider"></div>
          {introText && (
            <p className="service-aftercare-intro-text">{introText}</p>
          )}
          {conclusionText && (
            <div className="service-aftercare-conclusion-box">
              <span className="service-aftercare-conclusion-label">Recovery Timeline</span>
              <p className="service-aftercare-conclusion-text">{conclusionText}</p>
            </div>
          )}
        </div>

        {/* Right column: bullet list */}
        {activeBullets.length > 0 && (
          <div className="service-aftercare-list-col">
            {activeBullets.map((pt, i) => (
              <div key={i} className="service-aftercare-item">
                <div className="service-aftercare-bullet-wrap">
                  <Check className="service-aftercare-bullet-icon" />
                </div>
                <span className="service-aftercare-text">{pt.bulletText}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
