import React from "react";

export default function ServiceTechniques({ data }) {
  if (!data || data.isVisible === false) return null;

  const { sectionHeading, techniques } = data;
  const activeTechniques = (techniques || [])
    .filter(pt => pt.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (activeTechniques.length === 0 && !sectionHeading) return null;

  return (
    <section className="service-techniques-section">
      <div className="service-techniques-container">
        <div className="service-techniques-header">
          <h2 className="service-techniques-heading">
            {sectionHeading || "Procedural Techniques"}
          </h2>
          <div className="service-techniques-divider"></div>
        </div>

        <div className="service-techniques-grid">
          {activeTechniques.map((tech, i) => {
            const formattedNum = String(i + 1).padStart(2, "0");
            return (
              <div key={i} className="service-techniques-card">
                <div>
                  <div className="service-techniques-num">
                    {formattedNum}
                  </div>
                  <h3 className="service-techniques-title">
                    {tech.title}
                  </h3>
                  <p className="service-techniques-desc">
                    {tech.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
