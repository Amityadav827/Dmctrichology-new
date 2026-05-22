"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaOtherSpecialities({ data = {} }) {
  const {
    heading = "Other Specialities",
    introParagraph = "Apart from being a leading expert in Trichological Sciences, Dr. Nivedita Dadu is also a diligent specialist in advanced dermatology, performing a number of cosmetic procedures such as:",
    specialitiesList = [
      { title: "Laser Skin Resurfacing & Rejuvenation," },
      { title: "Chemical Peels & Advanced Facials," },
      { title: "Botox, Fillers & Anti-Ageing Treatments," },
      { title: "Pigmentation & Melasma Management," },
      { title: "Acne & Scar Treatment Protocols." }
    ],
    conclusionParagraph = "For more information, contact the **best dermatologist in Delhi** at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi).",
    image = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    imageAlt = "Dr. Nivedita Other Specialities",
    backgroundColor = "#ffffff",
    cardBackgroundColor = "#3b5998",
    contentMaxWidth = "1200px",
    paddingTop = "100px",
    paddingBottom = "100px",
    gridGap = "70px"
  } = data;

  const renderFormattedText = (text) => {
    if (!text) return "";
    let processed = text;
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="niv-gold-accent">$1</strong>');
    processed = processed.replace(/<strong>(.*?)<\/strong>/g, '<strong class="niv-gold-accent">$1</strong>');
    processed = processed.replace(/DMC Trichology/gi, '<strong class="niv-gold-accent">DMC Trichology</strong>');
    return <span dangerouslySetInnerHTML={{ __html: processed }} />;
  };

  return (
    <EditableSection sectionId="about-nivedita-other-specialities" label="Dr Nivedita Other Specialities">
      <section
        className="dr-nivedita-other-specialities-wrapper"
        style={{
          backgroundColor: backgroundColor || "#ffffff",
          paddingTop: paddingTop || "100px",
          paddingBottom: paddingBottom || "100px",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          className="dr-nivedita-other-specialities-card"
          style={{
            backgroundColor: cardBackgroundColor || "#3b5998",
            borderRadius: "0px",
            maxWidth: contentMaxWidth || "1200px",
            width: "100%",
            margin: "0 auto",
            padding: "60px",
            boxSizing: "border-box",
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.35)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: gridGap || "70px",
            alignItems: "center"
          }}
        >
          {/* LEFT SIDE CONTENT */}
          <div className="dr-nivedita-specialities-left" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            <h2
              style={{
                fontSize: "36px",
                lineHeight: "1.2",
                fontWeight: "400",
                color: "#ffffff",
                margin: "0",
                fontFamily: "'Marcellus', serif",
                letterSpacing: "0.03em"
              }}
            >
              <EditableText sectionId="about-nivedita-other-specialities" fieldPath="otherSpecialitiesSection.heading">
                {heading}
              </EditableText>
            </h2>

            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
                color: "#ffffff",
                margin: "0",
                fontFamily: "'Marcellus', serif",
                fontWeight: "300"
              }}
            >
              <EditableText sectionId="about-nivedita-other-specialities" fieldPath="otherSpecialitiesSection.introParagraph">
                {renderFormattedText(introParagraph)}
              </EditableText>
            </p>

            {/* Bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "4px", marginBottom: "4px" }}>
              {specialitiesList.map((bullet, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ flexShrink: 0, marginTop: "3px", display: "flex", alignItems: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.4",
                      fontWeight: "400",
                      color: "#ffffff",
                      fontFamily: "'Marcellus', serif"
                    }}
                  >
                    <EditableText sectionId="about-nivedita-other-specialities" fieldPath={`otherSpecialitiesSection.specialitiesList.${idx}.title`}>
                      {bullet.title}
                    </EditableText>
                  </span>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.7",
                color: "#ffffff",
                margin: "0",
                fontFamily: "'Marcellus', serif",
                fontWeight: "300"
              }}
            >
              <EditableText sectionId="about-nivedita-other-specialities" fieldPath="otherSpecialitiesSection.conclusionParagraph">
                {renderFormattedText(conclusionParagraph)}
              </EditableText>
            </p>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="dr-nivedita-specialities-right" style={{ width: "100%" }}>
            <div
              style={{
                border: "2px solid #D4AF37",
                overflow: "hidden",
                boxShadow: "0 15px 45px rgba(0, 0, 0, 0.5)",
                display: "flex",
                width: "100%",
                aspectRatio: "4 / 3"
              }}
            >
              <img
                src={image}
                alt={imageAlt}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .dr-nivedita-other-specialities-wrapper,
        .dr-nivedita-other-specialities-wrapper * {
          font-family: 'Marcellus', serif !important;
        }
        .dr-nivedita-other-specialities-wrapper .niv-gold-accent {
          color: #D4AF37 !important;
          font-weight: 600 !important;
        }
        @media (max-width: 991px) {
          .dr-nivedita-other-specialities-card {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
            padding: 48px !important;
          }
        }
        @media (max-width: 768px) {
          .dr-nivedita-other-specialities-wrapper {
            padding-top: 60px !important;
            padding-bottom: 60px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .dr-nivedita-other-specialities-card {
            padding: 36px 24px !important;
            gap: 40px !important;
          }
          .dr-nivedita-specialities-left { order: 1 !important; }
          .dr-nivedita-specialities-right { order: 2 !important; }
        }
      `}</style>
    </EditableSection>
  );
}
