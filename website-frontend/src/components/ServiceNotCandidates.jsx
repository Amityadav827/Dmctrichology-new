import React from "react";
import { X } from "lucide-react";

export default function ServiceNotCandidates({ data }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, bullets } = data;
  const activeBullets = (bullets || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeBullets.length === 0 && !sectionHeading) return null;

  return (
    <section className="service-not-candidates-section">
      <div className="service-not-candidates-container">
        <div className="service-not-candidates-header">
          <h2 className="service-not-candidates-heading">
            {sectionHeading || "Contraindications & Exclusions"}
          </h2>
          <div className="service-not-candidates-divider"></div>
        </div>

        <div className="service-not-candidates-box">
          <div className="service-not-candidates-grid">
            {activeBullets.map((pt, i) => (
              <div key={i} className="service-not-candidates-item">
                <div className="service-not-candidates-icon-wrap">
                  <X className="service-not-candidates-icon" />
                </div>
                <p className="service-not-candidates-text">
                  {pt.bulletText}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
