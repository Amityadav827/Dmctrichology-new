"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

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
    cardBgColor = "#3b5998"
  } = data;

  // Helper function to render text with bold tags preserved or custom styles if inline typing occurs
  const renderBoldedText = (text, isBold = false) => {
    if (!text) return "";
    // Replaces 'best hair specialist in Delhi' or 'ARTEMIS HOSPITAL' with bolded versions if match
    let processed = text;
    processed = processed.replace(/best hair specialist in Delhi/gi, "<strong>best hair specialist in Delhi</strong>");
    processed = processed.replace(/best hair specialist in Delhi/gi, "<strong>best hair specialist in Delhi</strong>");
    processed = processed.replace(/ARTEMIS HOSPITAL/g, "ARTEMIS HOSPITAL");
    return processed;
  };

  const isDarkCard = cardBgColor && !['#ffffff', '#fff', 'white', '#f6f1e7'].includes(cardBgColor.toLowerCase());
  const textColor = isDarkCard ? '#FFFFFF' : '#1A1A1A';
  const descColor = isDarkCard ? '#FFFFFF' : '#333333';
  const bulletColor = isDarkCard ? '#FFFFFF' : '#3b5998';

  return (
    <EditableSection sectionId="about-nandani-specialist" label="Dr Nandani Specialist Info">
      <div
        className="dr-nandani-specialist-section"
        style={{
          backgroundColor: sectionBgColor || "#FFFFFF",
          padding: "80px 24px",
          fontFamily: "'Marcellus', serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%"
        }}
      >
        <div
          className="dr-nandani-specialist-card"
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
            <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.heading">
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
            <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.description1">
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
            <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.description2">
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
            <EditableText sectionId="about-nandani-specialist" fieldPath="specialist.highlightedText">
              {highlightedText}
            </EditableText>
          </p>

          {/* Bullets container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "20px"
            }}
          >
            {bullets.map((bullet, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px"
                }}
              >
                {/* Custom gold ticks */}
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    letterSpacing: "0.03em",
                    color: bulletColor, // Primary brand blue or white for treatment labels
                    fontFamily: "'Marcellus', serif"
                  }}
                >
                  <EditableText sectionId="about-nandani-specialist" fieldPath={`specialist.bullets.${idx}`}>
                    {bullet}
                  </EditableText>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .dr-nandani-specialist-section,
        .dr-nandani-specialist-section * {
          font-family: 'Marcellus', serif !important;
        }
        @media (max-width: 768px) {
          .dr-nandani-specialist-card {
            padding: 32px 24px !important;
          }
          .dr-nandani-specialist-card h2 {
            font-size: 26px !important;
            margin-bottom: 24px !important;
          }
          .dr-nandani-specialist-section {
            padding: 48px 16px !important;
          }
        }
      `}</style>
    </EditableSection>
  );
}
