"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const defaultFeatureCards = [
  { title: "Advanced Hair Restoration" },
  { title: "Hair Transplant Expertise" },
  { title: "Scalp & Hair Diagnosis" },
  { title: "Personalized Treatment Plans" }
];

const icons = [
  <path key="a" d="M12 21s-6-4.1-6-9.4C6 7.4 8.6 5 12 5s6 2.4 6 6.6C18 16.9 12 21 12 21Z" />,
  <path key="b" d="M8 19V8a4 4 0 0 1 8 0v11M6 12h12M9 5c1.7 1.3 4.3 1.3 6 0" />,
  <path key="c" d="M4 12h4l2-5 4 10 2-5h4M5 20h14M5 4h14" />,
  <path key="d" d="M12 4v16M4 12h16M7 7l10 10M17 7 7 17" />
];

export default function AboutDrNandaniSpecialist({ data = {} }) {
  const {
    heading = "Best Hair Specialist in Delhi",
    description1 = "Dr. Nandini Dadu is a well-known former consultant at ARTEMIS HOSPITAL in Gurgaon. Over the years, she has provided insights to several dignitaries and celebrities in New Delhi. She is the best hair specialist in Delhi. She works in close collaboration with doctors at Hair Care & Transplant Surgeons and is always looking for new, cutting-edge products for hair and scalp care treatments.",
    description2 = "Being a specialist in the cosmetological and trichological sciences combined, Dr. Nandini is dedicated to thorough diagnosis, effective treatment processes, and the best DMC Golden Touch Techniques for generating amazing outcomes at the highest level of client satisfaction. So, to get the long-lasting effects opt to get treated by the best hair specialist in Delhi only at DMC Trichology.",
    highlightedText = "She employs cutting-edge knowledge in Hair & Scalp Treatments with:",
    bullets = [
      "MESOGROW",
      "ADVANCED HGP",
      "ADVANCED HGP 2.0",
      "RRT (ROOT RESTORE THERAPY)",
      "FUE TECHNIQUE (Follicular Hair Transplant)"
    ],
    sectionBgColor = "#FFFFFF",
    featureCards = defaultFeatureCards
  } = data;

  const resolvedFeatures = Array.isArray(featureCards) && featureCards.length > 0 ? featureCards : defaultFeatureCards;

  return (
    <EditableSection sectionId="about-nandani-specialist" label="Why Choose Dr Nandani">
      <section className="dr-nandani-specialist-section" style={{ backgroundColor: sectionBgColor || "#FFFFFF" }}>
        <div className="dr-nandani-specialist-shell">
          <div className="dr-nandani-specialist-copy">
            <span className="dr-nandani-section-eyebrow">
              <span />
              WHY CHOOSE US SERVICES
            </span>
            <h2>
              <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.heading" tag="span">
                {heading}
              </EditableText>
            </h2>
            <p>
              <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.description1" tag="span">
                {description1}
              </EditableText>
            </p>
            <p>
              <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.description2" tag="span">
                {description2}
              </EditableText>
            </p>

            <div className="dr-nandani-treatment-block">
              <h3>
                <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.highlightedText" tag="span">
                  {highlightedText}
                </EditableText>
              </h3>
              <div className="dr-nandani-treatment-grid">
                {bullets.map((bullet, idx) => (
                  <div className="dr-nandani-treatment-card" key={`${bullet}-${idx}`}>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24">
                        <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <EditableText sectionId="about-nandani-specialist" fieldPath={`specialist.bullets.${idx}`} tag="p">
                      {bullet}
                    </EditableText>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dr-nandani-feature-grid">
            {resolvedFeatures.map((feature, idx) => (
              <div className="dr-nandani-feature-card" key={`${feature.title}-${idx}`}>
                <div className="dr-nandani-feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {icons[idx % icons.length]}
                  </svg>
                </div>
                <h3>
                  <EditableText sectionId="about-nandani-specialist" fieldPath={`specialist.featureCards.${idx}.title`} tag="span">
                    {feature.title}
                  </EditableText>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .dr-nandani-specialist-section {
          position: relative;
          padding: 96px 5%;
          overflow: hidden;
        }
        .dr-nandani-specialist-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 8% 14%, rgba(59, 89, 152, 0.08), transparent 26%),
            linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%);
          pointer-events: none;
        }
        .dr-nandani-specialist-shell {
          position: relative;
          z-index: 1;
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.68fr);
          gap: 50px;
          align-items: center;
        }
        .dr-nandani-section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #3B5998;
          margin-bottom: 18px;
        }
        .dr-nandani-section-eyebrow span {
          width: 48px;
          height: 1px;
          background: #3B5998;
          position: relative;
          display: block;
        }
        .dr-nandani-section-eyebrow span::after {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3B5998;
          position: absolute;
          right: -3px;
          top: -3px;
        }
        .dr-nandani-specialist-copy h2 {
          font-family: 'Marcellus', serif;
          font-size: clamp(38px, 4.8vw, 64px);
          line-height: 1.03;
          font-weight: 400;
          color: #111111;
          margin: 0 0 26px;
        }
        .dr-nandani-specialist-copy > p {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.85;
          color: #333333;
          margin: 0 0 18px;
        }
        .dr-nandani-treatment-block {
          margin-top: 34px;
          padding: 28px;
          border-radius: 30px;
          background: #ffffff;
          border: 1px solid rgba(59, 89, 152, 0.12);
          box-shadow: 0 22px 58px rgba(15, 35, 79, 0.08);
        }
        .dr-nandani-treatment-block h3 {
          font-family: 'Marcellus', serif;
          font-size: 22px;
          line-height: 1.35;
          color: #111111;
          font-weight: 400;
          margin: 0 0 22px;
        }
        .dr-nandani-treatment-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .dr-nandani-treatment-card {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 56px;
          padding: 13px 14px;
          border-radius: 18px;
          background: #eef2fb;
          border: 1px solid rgba(59, 89, 152, 0.10);
        }
        .dr-nandani-treatment-card span {
          width: 26px;
          height: 26px;
          flex: 0 0 26px;
          border-radius: 50%;
          background: #3B5998;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .dr-nandani-treatment-card p {
          margin: 0;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.3;
          font-weight: 900;
          letter-spacing: .5px;
          color: #111111;
          text-transform: uppercase;
        }
        .dr-nandani-feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .dr-nandani-feature-card {
          min-height: 210px;
          padding: 28px;
          border-radius: 30px;
          background: #3B5998;
          color: #ffffff;
          box-shadow: 0 24px 60px rgba(59, 89, 152, 0.20);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .dr-nandani-feature-card:nth-child(even) {
          background: #aebed1;
          color: #111111;
        }
        .dr-nandani-feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 72px rgba(59, 89, 152, 0.24);
        }
        .dr-nandani-feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dr-nandani-feature-card:nth-child(even) .dr-nandani-feature-icon {
          background: rgba(255, 255, 255, 0.55);
          color: #3B5998;
        }
        .dr-nandani-feature-card h3 {
          font-family: 'Marcellus', serif;
          font-size: 25px;
          line-height: 1.2;
          font-weight: 400;
          margin: 28px 0 0;
        }
        @media (max-width: 1024px) {
          .dr-nandani-specialist-shell {
            grid-template-columns: 1fr;
          }
          .dr-nandani-specialist-copy {
            text-align: center;
          }
          .dr-nandani-section-eyebrow {
            justify-content: center;
          }
        }
        @media (max-width: 767px) {
          .dr-nandani-specialist-section {
            padding: 58px 16px;
          }
          .dr-nandani-treatment-block {
            padding: 20px;
            border-radius: 24px;
          }
          .dr-nandani-treatment-grid,
          .dr-nandani-feature-grid {
            grid-template-columns: 1fr;
          }
          .dr-nandani-feature-card {
            min-height: 160px;
            border-radius: 24px;
          }
          .dr-nandani-specialist-copy h2 {
            font-size: clamp(34px, 10vw, 46px);
          }
        }
      `}</style>
    </EditableSection>
  );
}
