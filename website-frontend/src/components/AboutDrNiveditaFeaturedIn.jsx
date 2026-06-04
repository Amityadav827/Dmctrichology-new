"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaFeaturedIn({ data = {} }) {
  const {
    sectionHeading = "As Featured In",
    descriptionText = "For her strong focus on the doctor-patient relationship, Dr. Nivedita Dadu has become the most sought-after Dermatology expert and also featured in various national and regional publications including:",
    sectionBgColor = "#ffffff",
    paddingTop = "72px",
    paddingBottom = "72px",
    publications = [
      { id: 1, title: "Dainik Bhaskar", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Dainik_Bhaskar_logo.svg/320px-Dainik_Bhaskar_logo.svg.png", link: "", enabled: true },
      { id: 2, title: "NDTV", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/NDTV_logo.svg/320px-NDTV_logo.svg.png", link: "", enabled: true },
      { id: 3, title: "Femina", imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Femina_magazine_logo.svg/320px-Femina_magazine_logo.svg.png", link: "", enabled: true },
      { id: 4, title: "Deccan Herald", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Deccan_Herald_logo.svg/320px-Deccan_Herald_logo.svg.png", link: "", enabled: true },
      { id: 5, title: "Woman's Era", imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Woman%27s_Era_magazine_logo.svg/320px-Woman%27s_Era_magazine_logo.svg.png", link: "", enabled: true },
      { id: 6, title: "Hindustan Times", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hindustan_times_logo.svg/320px-hindustan_times_logo.svg.png", link: "", enabled: true },
      { id: 7, title: "Stayfit", imageUrl: "", link: "", enabled: true },
      { id: 8, title: "Practo", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Practo_Logo.svg/320px-Practo_Logo.svg.png", link: "", enabled: true },
      { id: 9, title: "Mail Today", imageUrl: "", link: "", enabled: true }
    ]
  } = data;

  const enabledPubs = publications.filter(p => p.enabled !== false);

  // Fallback text-only logo card when no image provided
  const LogoCard = ({ pub }) => {
    const inner = (
      <div
        className="dr-nivedita-pub-logo-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 22px",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "4px",
          minWidth: "110px",
          height: "64px",
          background: "#ffffff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          cursor: pub.link ? "pointer" : "default",
          boxSizing: "border-box"
        }}
      >
        {pub.imageUrl ? (
          <img
            src={pub.imageUrl}
            alt={pub.title}
            style={{
              maxWidth: "100%",
              maxHeight: "36px",
              objectFit: "contain",
              display: "block",
              filter: "grayscale(30%)",
              transition: "filter 0.3s ease"
            }}
            className="dr-nivedita-pub-img"
          />
        ) : (
          <span
            style={{
              fontFamily: "'Marcellus', serif",
              fontSize: "13px",
              fontWeight: "600",
              color: "#475569",
              textAlign: "center",
              letterSpacing: "0.03em",
              lineHeight: "1.3"
            }}
          >
            {pub.title}
          </span>
        )}
      </div>
    );

    return pub.link ? (
      <a
        href={pub.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        className="dr-nivedita-pub-link"
      >
        {inner}
      </a>
    ) : inner;
  };

  return (
    <EditableSection sectionId="about-nivedita-featured-in" label="Dr Nivedita As Featured In">
      <style dangerouslySetInnerHTML={{ __html: `
        .dr-nivedita-featured-section {
          font-family: 'Marcellus', serif !important;
        }
        .dr-nivedita-featured-heading {
          font-family: 'Marcellus', serif !important;
          font-size: 44px;
          font-weight: 400;
          color: #333333;
          text-transform: uppercase;
          text-align: center;
          margin: 0 0 16px 0;
          letter-spacing: 0.03em;
          line-height: 1.2;
        }
        .dr-nivedita-featured-desc {
          font-family: 'Marcellus', serif !important;
          font-size: 14.5px;
          line-height: 1.75;
          color: #333333;
          text-align: center;
          max-width: 700px;
          margin: 0 auto 48px auto;
          font-weight: 400;
        }
        .dr-nivedita-featured-divider {
          width: 60px;
          height: 2px;
          background: #ffffff;
          margin: 0 auto 36px auto;
        }
        .dr-nivedita-pub-logo-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 16px 20px;
        }
        .dr-nivedita-pub-logo-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 28px rgba(0,0,0,0.10) !important;
        }
        .dr-nivedita-pub-logo-card:hover .dr-nivedita-pub-img {
          filter: grayscale(0%) !important;
        }
        .dr-nivedita-featured-bottom-line {
          width: 100%;
          max-width: 900px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
          margin: 40px auto 0 auto;
        }
        @media (max-width: 768px) {
          .dr-nivedita-featured-heading {
            font-size: 28px !important;
          }
          .dr-nivedita-featured-desc {
            font-size: 13px !important;
            margin-bottom: 36px !important;
          }
          .dr-nivedita-pub-logo-grid {
            gap: 12px 14px !important;
          }
          .dr-nivedita-pub-logo-card {
            min-width: 90px !important;
            height: 52px !important;
            padding: 10px 14px !important;
          }
        }
        @media (max-width: 480px) {
          .dr-nivedita-pub-logo-grid {
            gap: 10px 10px !important;
          }
          .dr-nivedita-pub-logo-card {
            min-width: 80px !important;
            height: 48px !important;
            padding: 8px 12px !important;
          }
        }
      `}} />

      <section
        className="dr-nivedita-featured-section"
        style={{
          backgroundColor: sectionBgColor || "#ffffff",
          paddingTop: paddingTop || "72px",
          paddingBottom: paddingBottom || "72px",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Centered heading */}
          <h2 className="dr-nivedita-featured-heading">
            <EditableText sectionId="about-nivedita-featured-in" fieldPath="featuredInSection.sectionHeading">
              {sectionHeading}
            </EditableText>
          </h2>

          {/* Gold divider line */}
          <div className="dr-nivedita-featured-divider" />

          {/* Description paragraph */}
          <p className="dr-nivedita-featured-desc">
            <EditableText sectionId="about-nivedita-featured-in" fieldPath="featuredInSection.descriptionText">
              {descriptionText}
            </EditableText>
          </p>

          {/* Logo grid */}
          <div className="dr-nivedita-pub-logo-grid">
            {enabledPubs.map((pub, idx) => (
              <LogoCard key={pub.id || idx} pub={pub} />
            ))}
          </div>

          {/* Bottom gold gradient line */}
          <div className="dr-nivedita-featured-bottom-line" />
        </div>
      </section>
    </EditableSection>
  );
}
