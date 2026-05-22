"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaSpecialist({ data = {} }) {
  const {
    heading = "Best Dermatologist & Hair Specialist in Delhi",
    description1 = "Dr. Nivedita Dadu is a distinguished dermatologist and trichologist recognized for her exceptional patient outcomes and research contributions. A fellow of prestigious dermatological societies, she brings unparalleled clinical depth to every patient interaction at DMC Trichology.",
    description2 = "Combining her mastery in dermatology with advanced trichological sciences, Dr. Nivedita delivers comprehensive scalp health solutions — from non-surgical hair restoration therapies to advanced diagnostic protocols — ensuring each patient receives the most effective, evidence-based care.",
    highlightedText = "She specializes in cutting-edge treatments including:",
    bullets = [
      "Advanced PRP & GFC Therapy",
      "FUE Hair Transplant Surgery",
      "Scalp Micropigmentation",
      "LLLT (Laser Hair Therapy)",
      "Custom Trichological Protocols"
    ],
    sectionBgColor = "#ffffff",
    cardBgColor = "#3b5998"
  } = data;

  const isDarkCard = cardBgColor && !['#ffffff', '#fff', 'white', '#f6f1e7'].includes(cardBgColor.toLowerCase());
  const textColor = isDarkCard ? '#FFFFFF' : '#1A1A1A';
  const descColor = isDarkCard ? '#FFFFFF' : '#333333';
  const bulletColor = isDarkCard ? '#FFFFFF' : '#3b5998';

  return (
    <EditableSection sectionId="about-nivedita-specialist" label="Dr Nivedita Specialist Info">
      <div
        className="dr-nivedita-specialist-section"
        style={{
          backgroundColor: sectionBgColor || "#ffffff",
          padding: "80px 24px",
          fontFamily: "'Marcellus', serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%"
        }}
      >
        <div
          className="dr-nivedita-specialist-card"
          style={{
            backgroundColor: cardBgColor || "#3b5998",
            maxWidth: "1100px",
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 15px 45px rgba(0, 0, 0, 0.04), 0 3px 15px rgba(0, 0, 0, 0.02)",
            padding: "56px 64px",
            boxSizing: "border-box"
          }}
        >
          {/* Centered Heading */}
          <h2
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "600",
              color: textColor,
              marginBottom: "36px",
              fontFamily: "'Marcellus', serif",
              letterSpacing: "0.02em"
            }}
          >
            <EditableText sectionId="about-nivedita-specialist" fieldPath="specialist.heading">
              {heading}
            </EditableText>
          </h2>

          {/* Description Paragraph 1 */}
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.8",
              color: descColor,
              marginBottom: "24px",
              fontFamily: "'Marcellus', serif",
              textAlign: "justify",
              fontWeight: "300"
            }}
          >
            <EditableText sectionId="about-nivedita-specialist" fieldPath="specialist.description1">
              {description1}
            </EditableText>
          </p>

          {/* Description Paragraph 2 */}
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.8",
              color: descColor,
              marginBottom: "28px",
              fontFamily: "'Marcellus', serif",
              textAlign: "justify",
              fontWeight: "300"
            }}
          >
            <EditableText sectionId="about-nivedita-specialist" fieldPath="specialist.description2">
              {description2}
            </EditableText>
          </p>

          {/* Highlighted text */}
          <p
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: textColor,
              marginBottom: "24px",
              fontFamily: "'Marcellus', serif"
            }}
          >
            <EditableText sectionId="about-nivedita-specialist" fieldPath="specialist.highlightedText">
              {highlightedText}
            </EditableText>
          </p>

          {/* Bullets */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
            {bullets.map((bullet, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    letterSpacing: "0.03em",
                    color: bulletColor,
                    fontFamily: "'Marcellus', serif"
                  }}
                >
                  <EditableText sectionId="about-nivedita-specialist" fieldPath={`specialist.bullets.${idx}`}>
                    {bullet}
                  </EditableText>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .dr-nivedita-specialist-section,
        .dr-nivedita-specialist-section * {
          font-family: 'Marcellus', serif !important;
        }
        @media (max-width: 768px) {
          .dr-nivedita-specialist-card {
            padding: 32px 24px !important;
          }
          .dr-nivedita-specialist-card h2 {
            font-size: 26px !important;
            margin-bottom: 24px !important;
          }
          .dr-nivedita-specialist-section {
            padding: 48px 16px !important;
          }
        }
      `}</style>
    </EditableSection>
  );
}
