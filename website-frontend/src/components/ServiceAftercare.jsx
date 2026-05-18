import React from "react";
import { Check } from "lucide-react";

export default function ServiceAftercare({ data }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, introText, conclusionText, bullets } = data;
  const activeBullets = (bullets || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeBullets.length === 0 && !sectionHeading) return null;

  return (
    <section className="service-aftercare-section">
      <div className="service-aftercare-container">
        
        {/* Left Column: Heading + Intro */}
        <div className="service-aftercare-intro-col">
          <span className="service-aftercare-label">Recovery Phase</span>
          <h2 className="service-aftercare-heading">
            {sectionHeading || "Aftercare Guidelines"}
          </h2>
          <div className="service-aftercare-divider"></div>
          {introText && (
            <p className="service-aftercare-intro-text">
              {introText}
            </p>
          )}
          {conclusionText && (
            <div className="service-aftercare-conclusion-box">
              <p className="service-aftercare-conclusion-label">Important Note</p>
              <p className="service-aftercare-conclusion-text">
                {conclusionText}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Bullets list */}
        <div className="service-aftercare-list-col">
          {activeBullets.map((pt, i) => (
            <div key={i} className="service-aftercare-item">
              <div className="service-aftercare-bullet-wrap">
                <Check className="service-aftercare-bullet-icon" />
              </div>
              <p className="service-aftercare-text">
                {pt.bulletText}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
