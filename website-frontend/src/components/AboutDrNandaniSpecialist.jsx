"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import RichTextContent from './RichTextContent';

export default function AboutDrNandaniSpecialist({ data = {}, showEyebrow = true }) {
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
    ]
  } = data;

  const visibleBullets = Array.isArray(bullets)
    ? bullets.filter(bullet => String(typeof bullet === 'object' ? bullet?.title || bullet?.text || '' : bullet || '').trim())
    : [];
  const hasTreatmentContent = Boolean(String(highlightedText || '').trim()) || visibleBullets.length > 0;

  return (
    <EditableSection sectionId="about-nandani-specialist" label="Why Choose Dr Nandani">
      <section className="dr-nandani-specialist-section">
        <div className="dr-nandani-specialist-shell">
          <div className="dr-nandani-specialist-copy">
            {showEyebrow && (
              <span className="dr-nandani-section-eyebrow">
                <span />
                WHY CHOOSE US SERVICES
              </span>
            )}
            <h2>
              <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.heading" tag="span">
                {heading}
              </EditableText>
            </h2>
            <RichTextContent value={description1} className="dr-nandani-specialist-rich" />
            <RichTextContent value={description2} className="dr-nandani-specialist-rich" />

            {hasTreatmentContent && (
              <div className="dr-nandani-treatment-block">
                {String(highlightedText || '').trim() && (
                  <h3>
                    <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.highlightedText" tag="span">
                      {highlightedText}
                    </EditableText>
                  </h3>
                )}
                {visibleBullets.length > 0 && (
                  <div className="dr-nandani-treatment-grid">
                    {visibleBullets.map((bullet, idx) => (
                      <div className="dr-nandani-treatment-card" key={`${bullet}-${idx}`}>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 24 24">
                            <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <EditableText sectionId="about-nandani-specialist" fieldPath={`specialist.bullets.${idx}`} tag="p">
                          {typeof bullet === 'object' ? bullet.title || bullet.text || '' : bullet}
                        </EditableText>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .dr-nandani-specialist-section {
          position: relative;
          padding: 100px 40px;
          overflow: hidden;
          background: #3B5998;
        }
        .dr-nandani-specialist-shell {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dr-nandani-section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 18px;
        }
        .dr-nandani-section-eyebrow span {
          width: 48px;
          height: 1px;
          background: rgba(255, 255, 255, 0.85);
          position: relative;
          display: block;
        }
        .dr-nandani-section-eyebrow span::after {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffffff;
          position: absolute;
          right: -3px;
          top: -3px;
        }
        .dr-nandani-specialist-copy h2 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 44px);
          line-height: 1.12;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 24px;
        }
        .dr-nandani-specialist-copy > p,
        :global(.dr-nandani-specialist-rich),
        :global(.dr-nandani-specialist-rich p),
        :global(.dr-nandani-specialist-rich li) {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.72;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 18px;
          max-width: 1120px;
        }
        :global(.dr-nandani-specialist-rich p:last-child) {
          margin-bottom: 0;
        }
        :global(.dr-nandani-specialist-rich ul),
        :global(.dr-nandani-specialist-rich ol) {
          margin: 0 0 18px 22px;
          padding: 0;
        }
        :global(.dr-nandani-specialist-rich strong) {
          color: #ffffff;
          font-weight: 800;
        }
        .dr-nandani-treatment-block {
          margin-top: 34px;
        }
        .dr-nandani-treatment-block h3 {
          font-family: 'Marcellus', serif;
          font-size: 21px;
          line-height: 1.35;
          color: #ffffff;
          font-weight: 400;
          margin: 0 0 22px;
          max-width: 420px;
        }
        .dr-nandani-treatment-grid {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .dr-nandani-treatment-card {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 0;
          padding: 0;
          border-radius: 0;
          background: transparent;
          border: 0;
        }
        .dr-nandani-treatment-card span {
          width: 15px;
          height: 15px;
          flex: 0 0 15px;
          border-radius: 50%;
          background: #ffffff;
          color: #3B5998;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .dr-nandani-treatment-card svg {
          width: 9px;
          height: 9px;
        }
        .dr-nandani-treatment-card p {
          margin: 0;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.35;
          font-weight: 500;
          letter-spacing: 0;
          color: #ffffff;
          text-transform: uppercase;
        }
        :global(.dr-nandani-treatment-card .editable-text) {
          color: #ffffff !important;
        }
        @media (max-width: 1024px) {
          .dr-nandani-specialist-section {
            padding: 82px 32px;
          }
          .dr-nandani-specialist-copy h2 {
            font-size: clamp(32px, 5vw, 40px);
          }
          .dr-nandani-specialist-copy > p {
            font-size: 13px;
          }
        }
        @media (max-width: 767px) {
          .dr-nandani-specialist-section {
            padding: 60px 20px;
          }
          .dr-nandani-specialist-copy h2 {
            font-size: clamp(30px, 9vw, 38px);
            margin-bottom: 20px;
          }
          .dr-nandani-section-eyebrow {
            gap: 10px;
            letter-spacing: 1.3px;
            margin-bottom: 16px;
          }
          .dr-nandani-section-eyebrow span {
            width: 40px;
          }
          .dr-nandani-treatment-block {
            margin-top: 30px;
          }
          .dr-nandani-treatment-block h3 {
            font-size: 19px;
          }
          .dr-nandani-treatment-card {
            align-items: flex-start;
          }
          .dr-nandani-treatment-card span {
            margin-top: 3px;
          }
          .dr-nandani-treatment-card p {
            font-size: 13px;
            line-height: 1.45;
          }
        }
      `}</style>
    </EditableSection>
  );
}
