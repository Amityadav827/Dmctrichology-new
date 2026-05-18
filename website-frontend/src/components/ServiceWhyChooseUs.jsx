import React from "react";
import { Award } from "lucide-react";

export default function ServiceWhyChooseUs({ data }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, introText, features } = data;
  const activeFeatures = (features || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeFeatures.length === 0 && !sectionHeading) return null;

  return (
    <section className="service-whychoose-section">
      <div className="service-whychoose-container">
        <div className="service-whychoose-header">
          <div>
            <span className="service-whychoose-label">The Gold Standard</span>
            <h2 className="service-whychoose-heading">
              {sectionHeading || "Why Choose DMC?"}
            </h2>
            <div className="service-whychoose-divider"></div>
          </div>
          {introText && (
            <p className="service-whychoose-intro">
              {introText}
            </p>
          )}
        </div>

        <div className="service-whychoose-grid">
          {activeFeatures.map((ft, i) => (
            <div key={i} className="service-whychoose-card">
              <div className="service-whychoose-icon-wrap">
                <Award className="service-whychoose-icon" />
              </div>
              <p className="service-whychoose-card-text">
                {ft.featureText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
