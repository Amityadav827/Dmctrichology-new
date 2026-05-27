"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNandaniOtherSpecialities({ data = {} }) {
  const {
    heading = "Other Specialities",
    introParagraph = "Apart from being a leading expert in Trichological Sciences, Dr. Nandini Dadu is also a diligent specialist in cosmetology, performing a number of cosmetic procedures such as :",
    specialitiesList = [
      { title: "Skin Laser Treatments," },
      { title: "Implantations," },
      { title: "Collagen & other Injectable Wrinkle Fillers.etc." }
    ],
    conclusionParagraph = "For more information contact the **best hair specialist in Delhi** at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi).",
    image = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    imageAlt = "Other Specialities",
    backgroundColor = "#ffffff",
    cardBackgroundColor = "#ffffff",
    contentMaxWidth = "1200px",
    paddingTop = "100px",
    paddingBottom = "100px",
    gridGap = "70px"
  } = data;

  // Helper function to format bold/strong text as luxury Gold (#E4B753)
  const renderFormattedText = (text) => {
    if (!text) return "";
    let processed = text;
    // Replace **text** with gold strong tags
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="gold-accent">$1</strong>');
    // Replace <strong>text</strong> with gold strong tags
    processed = processed.replace(/<strong>(.*?)<\/strong>/g, '<strong class="gold-accent">$1</strong>');
    // Also style special keyword references dynamically
    processed = processed.replace(/best hair specialist in Delhi/gi, '<strong class="gold-accent">best hair specialist in Delhi</strong>');
    processed = processed.replace(/DMC Trichology/gi, '<strong class="gold-accent">DMC Trichology</strong>');
    return <span dangerouslySetInnerHTML={{ __html: processed }} />;
  };

  return (
    <EditableSection sectionId="about-nandani-other-specialities" label="Other Specialities Section">
      <section
        className="dr-nandani-other-specialities-wrapper"
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
          className="dr-nandani-other-specialities-card"
          style={{
            backgroundColor: cardBackgroundColor || "#ffffff",
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
          <div className="other-specialities-left-content" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* Section Heading */}
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
              <EditableText sectionId="about-nandani-other-specialities" fieldPath="otherSpecialitiesSection.heading">
                {heading}
              </EditableText>
            </h2>

            {/* Intro Paragraph */}
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
              <EditableText sectionId="about-nandani-other-specialities" fieldPath="otherSpecialitiesSection.introParagraph">
                {renderFormattedText(introParagraph)}
              </EditableText>
            </p>

            {/* Bullet Specialties List */}
            <div
              className="specialities-bullet-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "4px",
                marginBottom: "4px"
              }}
            >
              {specialitiesList.map((bullet, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px"
                  }}
                >
                  {/* Gold Checkmark SVG */}
                  <div style={{ flexShrink: 0, marginTop: "3px", display: "flex", alignItems: "center" }}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E4B753"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                    <EditableText sectionId="about-nandani-other-specialities" fieldPath={`otherSpecialitiesSection.specialitiesList.${idx}.title`}>
                      {bullet.title}
                    </EditableText>
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Paragraph */}
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
              <EditableText sectionId="about-nandani-other-specialities" fieldPath="otherSpecialitiesSection.conclusionParagraph">
                {renderFormattedText(conclusionParagraph)}
              </EditableText>
            </p>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="other-specialities-right-image" style={{ width: "100%" }}>
            <div
              className="editorial-image-frame"
              style={{
                border: "2px solid #E4B753",
                padding: "0",
                boxSizing: "border-box",
                overflow: "hidden",
                boxShadow: "0 15px 45px rgba(0, 0, 0, 0.5)",
                display: "flex",
                width: "100%",
                aspectRatio: "4 / 3"
              }}
            >
              <img
                src={image || "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png"}
                alt={imageAlt || "Other Specialities"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .dr-nandani-other-specialities-wrapper,
        .dr-nandani-other-specialities-wrapper * {
          font-family: 'Marcellus', serif !important;
        }
        .dr-nandani-other-specialities-wrapper .gold-accent {
          color: #E4B753 !important;
          font-weight: 600 !important;
        }
        @media (max-width: 991px) {
          .dr-nandani-other-specialities-card {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
            padding: 48px !important;
          }
        }
        @media (max-width: 768px) {
          .dr-nandani-other-specialities-wrapper {
            padding-top: 60px !important;
            padding-bottom: 60px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .dr-nandani-other-specialities-card {
            padding: 36px 24px !important;
            gap: 40px !important;
          }
          .dr-nandani-other-specialities-card h2 {
            font-size: 28px !important;
          }
          .dr-nandani-other-specialities-card p,
          .dr-nandani-other-specialities-card span {
            font-size: 14px !important;
          }
          .other-specialities-left-content {
            gap: 20px !important;
            order: 1 !important; /* text first */
          }
          .other-specialities-right-image {
            order: 2 !important; /* image second */
          }
        }
      `}</style>
    </EditableSection>
  );
}
