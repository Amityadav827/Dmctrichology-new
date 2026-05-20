import React from "react";

const defaultPoints = [
  "Expert Team of Specialists",
  "Advanced Techniques & Equipment",
  "State-of-the-Art Facilities",
  "Personalized Treatment Plans",
  "Best In-Class Treatment Results",
  "Affordable & Transparent Cost",
  "Outstanding Patient Reviews",
  "Dedicated Post-Care & Support",
];

export default function HairTransplantWhyChooseSection({ data, image = "", serviceTitle = "", pageSlug = "" }) {
  const resolvedHeading = data?.sectionHeading || `WHY CHOOSE DMC TRICHOLOGY FOR ${serviceTitle ? serviceTitle.toUpperCase() : "THIS TREATMENT"}?`;
  const resolvedIntro = data?.introText || `Choose us for ${serviceTitle || "your treatment"} because we offer advanced procedures to ensure high-quality care for patients.`;
  
  const activePoints = data?.points || data?.bullets || defaultPoints;
  const filteredPoints = activePoints
    .map(p => (typeof p === "string" ? p : p.bulletText || p.text || ""))
    .filter(Boolean);

  if (filteredPoints.length === 0) return null;

  return (
    <section className="hair-transplant-why-section">
      <div className="hair-transplant-why-container">
        <div className="hair-transplant-why-content">
          <h2 className="hair-transplant-why-heading">
            {resolvedHeading}
          </h2>
          <p className="hair-transplant-why-intro">
            {resolvedIntro}
          </p>
          <ul className="hair-transplant-why-list">
            {filteredPoints.map((point, index) => (
              <li className="hair-transplant-why-item" key={index}>
                <span className="hair-transplant-why-check">
                  <svg
                    className="hair-transplant-why-check-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {image && (
          <div className="hair-transplant-why-image-wrap">
            <img
              src={image}
              alt={serviceTitle || "DMC Trichology care"}
              className="hair-transplant-why-image"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}
