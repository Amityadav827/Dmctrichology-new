"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaAssociations({ data = {} }) {
  const {
    sectionHeading = "ASSOCIATIONS",
    sectionBgColor = "#ffffff",
    paddingTop = "72px",
    paddingBottom = "72px",
    logoSpacing = "24px",
    logoHeight = "90px",
    logoCardPadding = "20px 28px",
    associations = [
      { id: 1, title: "IADVL",                     imageUrl: "", link: "", enabled: true },
      { id: 2, title: "World Trichology Society",   imageUrl: "", link: "", enabled: true },
      { id: 3, title: "AAM MMI",                    imageUrl: "", link: "", enabled: true },
      { id: 4, title: "EADV",                       imageUrl: "", link: "", enabled: true },
      { id: 5, title: "Association of Cutaneous Surgeons", imageUrl: "", link: "", enabled: true }
    ]
  } = data;

  const enabled = associations.filter(a => a.enabled !== false);

  const AssocCard = ({ assoc }) => {
    const card = (
      <div
        className="dr-nivedita-assoc-card"
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          padding:         logoCardPadding || "20px 28px",
          border:          "1px solid rgba(0,0,0,0.10)",
          borderRadius:    "4px",
          background:      "#ffffff",
          boxShadow:       "0 2px 14px rgba(0,0,0,0.04)",
          transition:      "transform 0.28s ease, box-shadow 0.28s ease",
          cursor:          assoc.link ? "pointer" : "default",
          boxSizing:       "border-box",
          minWidth:        "120px",
          height:          logoHeight || "90px",
          flexShrink:      0
        }}
      >
        {assoc.imageUrl ? (
          <img
            src={assoc.imageUrl}
            alt={assoc.title}
            className="dr-nivedita-assoc-img"
            style={{
              maxWidth:     "100%",
              maxHeight:    "60px",
              objectFit:    "contain",
              display:      "block",
              filter:       "grayscale(20%)",
              transition:   "filter 0.3s ease, transform 0.3s ease"
            }}
          />
        ) : (
          <span
            style={{
              fontFamily:    "'Marcellus', serif",
              fontSize:      "12px",
              fontWeight:    "600",
              color:         "#374151",
              textAlign:     "center",
              letterSpacing: "0.04em",
              lineHeight:    "1.4"
            }}
          >
            {assoc.title}
          </span>
        )}
      </div>
    );

    return assoc.link ? (
      <a
        href={assoc.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        className="dr-nivedita-assoc-link"
      >
        {card}
      </a>
    ) : card;
  };

  return (
    <EditableSection sectionId="about-nivedita-associations" label="Dr Nivedita Associations">
      <style dangerouslySetInnerHTML={{ __html: `
        .dr-nivedita-associations-section {
          font-family: 'Marcellus', serif !important;
          width: 100%;
          box-sizing: border-box;
        }
        .dr-nivedita-assoc-heading {
          font-family: 'Marcellus', serif !important;
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          text-align: center;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 40px 0;
          line-height: 1.2;
        }
        .dr-nivedita-assoc-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        .dr-nivedita-assoc-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 10px 32px rgba(0,0,0,0.11) !important;
        }
        .dr-nivedita-assoc-card:hover .dr-nivedita-assoc-img {
          filter: grayscale(0%) !important;
          transform: scale(1.04);
        }
        .dr-nivedita-assoc-bottom-rule {
          width: 100%;
          max-width: 1000px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59,89,152,0.15), rgba(212,175,55,0.25), rgba(59,89,152,0.15), transparent);
          margin: 48px auto 0 auto;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .dr-nivedita-assoc-heading {
            font-size: 24px !important;
          }
        }
        @media (max-width: 768px) {
          .dr-nivedita-assoc-heading {
            font-size: 20px !important;
            margin-bottom: 28px !important;
          }
          .dr-nivedita-assoc-card {
            min-width: 100px !important;
            height: 72px !important;
            padding: 14px 18px !important;
          }
          .dr-nivedita-assoc-grid {
            gap: 14px !important;
          }
        }
        @media (max-width: 480px) {
          .dr-nivedita-assoc-card {
            min-width: 86px !important;
            height: 64px !important;
            padding: 10px 14px !important;
          }
          .dr-nivedita-assoc-grid {
            gap: 10px !important;
          }
        }
      `}} />

      <section
        className="dr-nivedita-associations-section"
        style={{
          backgroundColor: sectionBgColor || "#ffffff",
          paddingTop:      paddingTop || "72px",
          paddingBottom:   paddingBottom || "72px",
          paddingLeft:     "24px",
          paddingRight:    "24px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Heading */}
          <h2 className="dr-nivedita-assoc-heading">
            <EditableText
              sectionId="about-nivedita-associations"
              fieldPath="associationsSection.sectionHeading"
            >
              {sectionHeading}
            </EditableText>
          </h2>

          {/* Logo grid */}
          <div
            className="dr-nivedita-assoc-grid"
            style={{ gap: logoSpacing || "24px" }}
          >
            {enabled.map((assoc, idx) => (
              <AssocCard key={assoc.id || idx} assoc={assoc} />
            ))}
          </div>

          {/* Bottom decorative rule */}
          <div className="dr-nivedita-assoc-bottom-rule" />
        </div>
      </section>
    </EditableSection>
  );
}
