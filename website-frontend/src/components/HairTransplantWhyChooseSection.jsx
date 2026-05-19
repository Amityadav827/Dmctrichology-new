import React from "react";

const points = [
  "Expert Team of Surgeons",
  "Advanced Techniques",
  "State-of-the-Art Facilities",
  "Personalized Treatment Plans",
  "Best Results of Hair Transplant",
  "Affordable Cost",
  "Patient Positive Feedback",
  "Patient Support and Care",
];

export default function HairTransplantWhyChooseSection({ image = "" }) {
  return (
    <section className="hair-transplant-why-section">
      <div className="hair-transplant-why-container">
        <div className="hair-transplant-why-content">
          <h2 className="hair-transplant-why-heading">
            WHY CHOOSE DMC TRICHOLOGY FOR HAIR TRANSPLANT IN DELHI?
          </h2>
          <p className="hair-transplant-why-intro">
            Choose us for a <strong>hair transplant in Delhi</strong> because we offer hair transplant procedures to ensure high-quality care for patients.
          </p>
          <ul className="hair-transplant-why-list">
            {points.map((point) => (
              <li className="hair-transplant-why-item" key={point}>
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
              alt="DMC Trichology hair transplant care"
              className="hair-transplant-why-image"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}
