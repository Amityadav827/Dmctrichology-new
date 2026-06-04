"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaEducationExperience({ data = {} }) {
  const {
    sectionBgColor = "#FFFFFF",
    educationTitle = "EDUCATION",
    experienceTitle = "EXPERIENCE",
    educationItems = [
      {
        degree: "MBBS",
        institution: "Himalayan Institute of Medical Sciences (HIMS), Dehradun",
        year: "2000"
      },
      {
        degree: "MD (Dermatology)",
        institution: "Himalayan Institute of Medical Sciences (HIMS), Dehradun",
        year: "2004"
      }
    ],
    experienceItems = [
      {
        role: "Senior Dermatologist",
        hospital: "Dr. Ram Manohar Lohia Hospital, New Delhi",
        duration: "2004 - 2008"
      },
      {
        role: "Fellowship In Hair Science & Trichology",
        hospital: "King Edward Memorial Hospital, Mumbai",
        duration: "2008 - 2010"
      },
      {
        role: "Consultant Dermatologist",
        hospital: "Primus Hospital, New Delhi",
        duration: "2010 - 2012"
      },
      {
        role: "Co-Founder & Senior Dermatologist",
        hospital: "DMC Trichology, New Delhi",
        duration: "2012 - Present"
      }
    ]
  } = data;

  const cardBgColor = "#3b5998";
  const textColor = "#FFFFFF";
  const subtextColor = "#E5E7EB";
  const goldColor = "#ffffff";

  return (
    <EditableSection sectionId="about-nivedita-education" label="Dr Nivedita Edu & Exp">
      <div
        className="dr-nivedita-edu-exp-section"
        style={{
          backgroundColor: sectionBgColor || "#FFFFFF",
          padding: "90px 24px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px"
          }}
          className="dr-nivedita-edu-exp-grid"
        >
          {/* LEFT COLUMN: EDUCATION */}
          <div
            className="dr-nivedita-edu-exp-card"
            style={{
              backgroundColor: cardBgColor,
              borderRadius: "16px",
              boxShadow: "0 15px 45px rgba(0, 0, 0, 0.08), 0 3px 15px rgba(0, 0, 0, 0.04)",
              padding: "56px 48px 48px 48px",
              position: "relative",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/* Graduation cap icon */}
            <div
              style={{
                position: "absolute",
                top: "-36px",
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                border: "1px solid rgba(0, 0, 0, 0.02)"
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b5998" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>

            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: textColor,
                marginBottom: "36px",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.08em",
                textAlign: "center"
              }}
            >
              <EditableText sectionId="about-nivedita-education" fieldPath="educationExperience.educationTitle">
                {educationTitle}
              </EditableText>
            </h3>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
              {educationItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    borderBottom: idx < educationItems.length - 1 ? "1px dashed rgba(255,255,255,0.15)" : "none",
                    paddingBottom: idx < educationItems.length - 1 ? "20px" : "0"
                  }}
                >
                  <span style={{ color: goldColor, fontSize: "14px", fontWeight: "bold", marginTop: "2px" }}>✔</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "14.5px", fontWeight: "700", color: textColor, fontFamily: "'Inter', sans-serif", lineHeight: "1.4" }}>
                      <EditableText sectionId="about-nivedita-education" fieldPath={`educationExperience.educationItems.${idx}.degree`}>
                        {item.degree}
                      </EditableText>
                    </p>
                    <p style={{ margin: "0", fontSize: "13px", color: subtextColor, fontFamily: "'Inter', sans-serif", lineHeight: "1.5" }}>
                      <EditableText sectionId="about-nivedita-education" fieldPath={`educationExperience.educationItems.${idx}.institution`}>
                        {item.institution}
                      </EditableText>
                      {item.year && (
                        <span style={{ fontWeight: "600", color: goldColor, marginLeft: "6px" }}>
                          ({item.year})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: EXPERIENCE */}
          <div
            className="dr-nivedita-edu-exp-card"
            style={{
              backgroundColor: cardBgColor,
              borderRadius: "16px",
              boxShadow: "0 15px 45px rgba(0, 0, 0, 0.08), 0 3px 15px rgba(0, 0, 0, 0.04)",
              padding: "56px 48px 48px 48px",
              position: "relative",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {/* Briefcase icon */}
            <div
              style={{
                position: "absolute",
                top: "-36px",
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                border: "1px solid rgba(0, 0, 0, 0.02)"
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b5998" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>

            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: textColor,
                marginBottom: "36px",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.08em",
                textAlign: "center"
              }}
            >
              <EditableText sectionId="about-nivedita-education" fieldPath="educationExperience.experienceTitle">
                {experienceTitle}
              </EditableText>
            </h3>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
              {experienceItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    borderBottom: idx < experienceItems.length - 1 ? "1px dashed rgba(255,255,255,0.15)" : "none",
                    paddingBottom: idx < experienceItems.length - 1 ? "20px" : "0"
                  }}
                >
                  <span style={{ color: goldColor, fontSize: "14px", fontWeight: "bold", marginTop: "2px" }}>✔</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "14.5px", fontWeight: "700", color: textColor, fontFamily: "'Inter', sans-serif", lineHeight: "1.4" }}>
                      <EditableText sectionId="about-nivedita-education" fieldPath={`educationExperience.experienceItems.${idx}.role`}>
                        {item.role}
                      </EditableText>
                    </p>
                    <p style={{ margin: "0", fontSize: "13px", color: subtextColor, fontFamily: "'Inter', sans-serif", lineHeight: "1.5" }}>
                      <EditableText sectionId="about-nivedita-education" fieldPath={`educationExperience.experienceItems.${idx}.hospital`}>
                        {item.hospital}
                      </EditableText>
                      {item.duration && (
                        <span style={{ fontWeight: "600", color: goldColor, marginLeft: "6px" }}>
                          ({item.duration})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 991px) {
          .dr-nivedita-edu-exp-grid {
            grid-template-columns: 1fr !important;
            gap: 64px !important;
          }
          .dr-nivedita-edu-exp-card {
            padding: 48px 24px 32px 24px !important;
          }
          .dr-nivedita-edu-exp-section {
            padding: 70px 16px !important;
          }
        }
      `}</style>
    </EditableSection>
  );
}
