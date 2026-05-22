"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaMembership({ data = {} }) {
  const {
    sectionHeading = "MEMBERSHIP",
    sectionBgColor = "#ffffff",
    paddingTop = "60px",
    paddingBottom = "60px",
    logos = [
      { id: 1, title: "EADV", imageUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", link: "", enabled: true },
      { id: 2, title: "IAM", imageUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", link: "", enabled: true },
      { id: 3, title: "IADVL", imageUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", link: "", enabled: true },
      { id: 4, title: "Trichology", imageUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", link: "", enabled: true },
      { id: 5, title: "ISOINEL", imageUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", link: "", enabled: true },
      { id: 6, title: "Assoc 6", imageUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", link: "", enabled: true },
      { id: 7, title: "Assoc 7", imageUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", link: "", enabled: true },
      { id: 8, title: "Cosmetic Dermatology Society Delhi", imageUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png", link: "", enabled: true }
    ]
  } = data;

  const enabledLogos = logos.filter(l => l.enabled !== false);

  return (
    <EditableSection sectionId="about-nivedita-membership" label="Dr Nivedita Membership Section">
      <style dangerouslySetInnerHTML={{ __html: `
        .dr-nivedita-membership-section {
          font-family: 'Marcellus', serif !important;
        }
        .dr-nivedita-membership-heading {
          font-family: 'Marcellus', serif !important;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1a1a2e;
          text-align: center;
          margin-bottom: 36px;
        }
        .dr-nivedita-logo-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 20px 32px;
        }
        .dr-nivedita-logo-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: transform 0.25s ease, opacity 0.25s ease;
          cursor: pointer;
        }
        .dr-nivedita-logo-item:hover {
          transform: translateY(-4px);
          opacity: 0.85;
        }
        .dr-nivedita-logo-img-wrap {
          width: 90px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .dr-nivedita-logo-img-wrap img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          display: block;
          filter: grayscale(20%);
          transition: filter 0.3s ease;
        }
        .dr-nivedita-logo-item:hover .dr-nivedita-logo-img-wrap img {
          filter: grayscale(0%);
        }
        .dr-nivedita-logo-title {
          font-size: 10px;
          font-weight: 600;
          color: #64748b;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          max-width: 90px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 768px) {
          .dr-nivedita-logo-grid {
            gap: 16px 20px;
          }
          .dr-nivedita-logo-img-wrap {
            width: 70px;
            height: 54px;
          }
        }
      `}} />

      <section
        className="dr-nivedita-membership-section"
        style={{
          backgroundColor: sectionBgColor || "#ffffff",
          paddingTop: paddingTop || "60px",
          paddingBottom: paddingBottom || "60px",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 className="dr-nivedita-membership-heading">
            <EditableText sectionId="about-nivedita-membership" fieldPath="membership.sectionHeading">
              {sectionHeading}
            </EditableText>
          </h2>

          <div className="dr-nivedita-logo-grid">
            {enabledLogos.map((logo, idx) => {
              const content = (
                <div key={logo.id || idx} className="dr-nivedita-logo-item" title={logo.title}>
                  <div className="dr-nivedita-logo-img-wrap">
                    <img src={logo.imageUrl} alt={logo.title || `Member org ${idx + 1}`} loading="lazy" />
                  </div>
                </div>
              );
              return logo.link ? (
                <a key={logo.id || idx} href={logo.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  {content}
                </a>
              ) : content;
            })}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
