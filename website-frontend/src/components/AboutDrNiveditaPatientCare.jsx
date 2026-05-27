"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaPatientCare({ data = {} }) {
  const {
    sectionBgColor = "#f8f9fa",
    paddingTop = "80px",
    paddingBottom = "80px",
    maxWidth = "1200px",
    cardBorderRadius = "0px",
    cardShadowIntensity = "0 6px 32px rgba(0,0,0,0.07)",
    gridGap = "32px",

    // Left card — Patient Centred Care
    leftCardTitle = "Patient Centred Care",
    leftCardBgColor = "#ffffff",
    leftCardContent = "<p>Dr. Nivedita Dadu offers professional-grade, most personalised skin & hair care treatments to each individual patient. She, along with her team of dermatologists & aestheticians, has treated over 100 thousands critical cases throughout her career with optimal results. She is always available to her patients, offering compassionate care and utmost respect to ensure healthy skin & hair for all.</p><p>Dr. Nivedita takes the practice of skin & hair care seriously and will make sure you receive the care you deserve.</p>",

    // Right card — Professionalism
    rightCardTitle = "Professionalism",
    rightCardBgColor = "#ffffff",
    rightCardContent = "<p>Dr. Nivedita Dadu maintains a highly professional environment to offer quality clinical care. She is one of the most recognised and respected skin & hair specialist professionals making her the best dermatologist giving customised treatment solutions that work- not just today, but for life.</p>"
  } = data;

  const cardBaseStyle = (bgColor, borderRadius, shadow) => ({
    backgroundColor: bgColor || "#ffffff",
    borderRadius: borderRadius || "0px",
    boxShadow: shadow || "0 6px 32px rgba(0,0,0,0.07)",
    padding: "48px 44px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(0,0,0,0.06)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    flex: 1
  });

  return (
    <EditableSection sectionId="about-nivedita-patient-care" label="Dr Nivedita Patient Care Section">
      <style dangerouslySetInnerHTML={{ __html: `
        .dr-nivedita-patient-care-section {
          font-family: 'Marcellus', serif !important;
        }
        .dr-nivedita-patient-care-section *,
        .dr-nivedita-care-card * {
          font-family: 'Marcellus', serif !important;
          box-sizing: border-box;
        }
        .dr-nivedita-care-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
        }
        .dr-nivedita-care-card {
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .dr-nivedita-care-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.10) !important;
        }
        .dr-nivedita-care-card-title {
          font-family: 'Marcellus', serif !important;
          font-size: 26px;
          font-weight: 400;
          color: #333333;
          margin: 0 0 20px 0;
          letter-spacing: 0.01em;
          line-height: 1.25;
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(59,89,152,0.12);
        }
        .dr-nivedita-care-card-body {
          font-family: 'Marcellus', serif !important;
          font-size: 15px;
          line-height: 1.85;
          color: #374151;
          text-align: justify;
        }
        .dr-nivedita-care-card-body p {
          margin: 0 0 18px 0;
        }
        .dr-nivedita-care-card-body p:last-child {
          margin-bottom: 0;
        }
        .dr-nivedita-care-card-body strong {
          color: #333333;
          font-weight: 700;
        }
        .dr-nivedita-care-card-body a {
          color: #3b5998;
          text-decoration: underline;
        }
        @media (max-width: 900px) {
          .dr-nivedita-care-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .dr-nivedita-patient-care-section {
            padding-top: 56px !important;
            padding-bottom: 56px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .dr-nivedita-care-card {
            padding: 36px 28px !important;
          }
          .dr-nivedita-care-card-title {
            font-size: 22px !important;
          }
        }
      `}} />

      <section
        className="dr-nivedita-patient-care-section"
        style={{
          backgroundColor: sectionBgColor || "#f8f9fa",
          paddingTop: paddingTop || "80px",
          paddingBottom: paddingBottom || "80px",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <div
          className="dr-nivedita-care-grid"
          style={{
            maxWidth: maxWidth || "1200px",
            margin: "0 auto",
            gap: gridGap || "32px"
          }}
        >
          {/* LEFT CARD — Patient Centred Care */}
          <div
            className="dr-nivedita-care-card"
            style={cardBaseStyle(leftCardBgColor, cardBorderRadius, cardShadowIntensity)}
          >
            <h2 className="dr-nivedita-care-card-title">
              <EditableText
                sectionId="about-nivedita-patient-care"
                fieldPath="patientCareSection.leftCardTitle"
                tag="span"
              >
                {leftCardTitle}
              </EditableText>
            </h2>
            <div className="dr-nivedita-care-card-body">
              <EditableText
                sectionId="about-nivedita-patient-care"
                fieldPath="patientCareSection.leftCardContent"
                tag="div"
                dangerouslySetInnerHTML={{ __html: leftCardContent }}
              />
            </div>
          </div>

          {/* RIGHT CARD — Professionalism */}
          <div
            className="dr-nivedita-care-card"
            style={cardBaseStyle(rightCardBgColor, cardBorderRadius, cardShadowIntensity)}
          >
            <h2 className="dr-nivedita-care-card-title">
              <EditableText
                sectionId="about-nivedita-patient-care"
                fieldPath="patientCareSection.rightCardTitle"
                tag="span"
              >
                {rightCardTitle}
              </EditableText>
            </h2>
            <div className="dr-nivedita-care-card-body">
              <EditableText
                sectionId="about-nivedita-patient-care"
                fieldPath="patientCareSection.rightCardContent"
                tag="div"
                dangerouslySetInnerHTML={{ __html: rightCardContent }}
              />
            </div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
