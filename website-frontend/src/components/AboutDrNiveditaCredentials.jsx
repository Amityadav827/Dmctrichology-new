"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNiveditaCredentials({ data = {} }) {
  const {
    bannerImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    overlayOpacity = 0.35,
    heading = "Credentials",
    credentialsList = [
      { text: "Fellowship In Aesthetic Dermatology" },
      { text: "Fellowship In Hair Science" },
      { text: "Member — IADVL (Indian Association of Dermatologists)" }
    ],
    leftHeading = "EXPERTISE IN DERMATOLOGY & HAIR TREATMENT",
    leftText = "<p>Dr. Nivedita Dadu's cutting-edge Hair Loss Treatment techniques have made a significant difference in the lives of those suffering from severe hair loss. She is recognized as a <strong>leading dermatologist and trichologist in Delhi</strong> available at DMC Trichology, Vasant Vihar (South Delhi), & Rajouri Garden (West Delhi). She is dedicated to treating male and female hair loss with the most advanced technologies available.</p><p>\"There is way more to hair restoration than JUST SCIENCE. For the optimal outcomes, ARTISTRY & PRECISION are required.\"</p><p>Dr. Nivedita Dadu has always taken a distinctive approach to comprehensive dermatological care, combining her passion for aesthetic medicine with evidence-based trichological science.</p>",
    rightHeading = "COMMITMENT TO PATIENT CARE",
    rightText = "<p>Dr. Nivedita Dadu places a high value on the doctor-patient relationship. She frequently adheres to the culture of having as much interaction as possible with her patients in order to go over the specifics of their hair and skin concerns and arrive at an accurate diagnosis.</p><p>With Dr. Nivedita, the individualized care and attention don't stop after the procedure. She has developed a cultivating focus on patient education and offers an all-inclusive wellness protocol at every step.</p><p>The level of care that Dr. Nivedita Dadu gives her patients is exceptional, and every treatment at DMC Trichology reflects her in-depth expertise and commitment to patient satisfaction.</p>",
    paddingBottom = "80px"
  } = data;

  return (
    <EditableSection sectionId="about-nivedita-credentials" label="Dr Nivedita Credentials">
      <div
        className="nivedita-credentials-section-wrapper"
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          paddingTop: "0px",
          paddingBottom: paddingBottom || "80px",
          position: "relative",
          boxSizing: "border-box"
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .nivedita-credentials-section-wrapper,
          .nivedita-credentials-section-wrapper * {
            font-family: 'Marcellus', serif !important;
            box-sizing: border-box;
          }

          .nivedita-cinematic-banner {
            width: 100%;
            height: 320px;
            position: relative;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }

          .nivedita-cinematic-banner-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0, 0, 0, ${overlayOpacity});
          }

          .nivedita-overlapping-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 24px;
            position: relative;
            z-index: 10;
          }

          .nivedita-floating-editorial-card {
            background-color: #ffffff;
            border-radius: 0px !important;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
            transform: translateY(-120px);
            margin-bottom: -120px;
            padding: 70px;
          }

          @media (max-width: 768px) {
            .nivedita-floating-editorial-card {
              padding: 30px !important;
              transform: translateY(-80px);
              margin-bottom: -80px;
            }
            .nivedita-cinematic-banner {
              height: 240px;
            }
          }

          .nivedita-credentials-heading {
            font-family: 'Marcellus', serif;
            font-size: 44px;
            font-weight: 400;
            text-align: center;
            color: #333333;
            text-transform: uppercase;
            margin: 0 0 24px 0;
            letter-spacing: 0.02em;
          }

          @media (max-width: 768px) {
            .nivedita-credentials-heading {
              font-size: 32px !important;
            }
          }

          .nivedita-credentials-badges-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px 32px;
            margin-bottom: 56px;
            border-bottom: 1px solid rgba(59, 89, 152, 0.1);
            padding-bottom: 40px;
          }

          .nivedita-badge-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .nivedita-badge-text {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            letter-spacing: 0.01em;
          }

          .nivedita-editorial-columns-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 70px;
          }

          @media (max-width: 968px) {
            .nivedita-editorial-columns-grid {
              grid-template-columns: 1fr;
              gap: 48px;
            }
          }

          .nivedita-column {
            display: flex;
            flex-direction: column;
          }

          .nivedita-column-heading {
            font-size: 18px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #333333;
            margin-bottom: 24px;
            line-height: 1.4;
          }

          .nivedita-column-body-text {
            font-size: 17px;
            line-height: 2;
            color: #333333;
            text-align: justify;
          }

          .nivedita-column-body-text p { margin-bottom: 24px; }
          .nivedita-column-body-text p:last-child { margin-bottom: 0; }
          .nivedita-column-body-text strong { font-weight: 700; }
        `}} />

        {/* Cinematic banner */}
        <div
          className="nivedita-cinematic-banner"
          style={{ backgroundImage: `url('${bannerImage}')` }}
        >
          <div className="nivedita-cinematic-banner-overlay"></div>
        </div>

        {/* Floating white card */}
        <div className="nivedita-overlapping-container">
          <div className="nivedita-floating-editorial-card">
            <h2 className="nivedita-credentials-heading">
              <EditableText sectionId="about-nivedita-credentials" fieldPath="credentialsSection.heading" tag="span">
                {heading}
              </EditableText>
            </h2>

            {/* Badges row */}
            <div className="nivedita-credentials-badges-row">
              {credentialsList.map((cred, idx) => (
                <div key={idx} className="nivedita-badge-item">
                  <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <EditableText
                    sectionId="about-nivedita-credentials"
                    fieldPath={`credentialsSection.credentialsList.${idx}.text`}
                    className="nivedita-badge-text"
                    tag="span"
                  >
                    {cred.text}
                  </EditableText>
                </div>
              ))}
            </div>

            {/* Two-column editorial grid */}
            <div className="nivedita-editorial-columns-grid">
              <div className="nivedita-column">
                <h3 className="nivedita-column-heading">
                  <EditableText sectionId="about-nivedita-credentials" fieldPath="credentialsSection.leftHeading" tag="span">
                    {leftHeading}
                  </EditableText>
                </h3>
                <div className="nivedita-column-body-text">
                  <EditableText
                    sectionId="about-nivedita-credentials"
                    fieldPath="credentialsSection.leftText"
                    tag="div"
                    dangerouslySetInnerHTML={{ __html: leftText }}
                  />
                </div>
              </div>

              <div className="nivedita-column">
                <h3 className="nivedita-column-heading">
                  <EditableText sectionId="about-nivedita-credentials" fieldPath="credentialsSection.rightHeading" tag="span">
                    {rightHeading}
                  </EditableText>
                </h3>
                <div className="nivedita-column-body-text">
                  <EditableText
                    sectionId="about-nivedita-credentials"
                    fieldPath="credentialsSection.rightText"
                    tag="div"
                    dangerouslySetInnerHTML={{ __html: rightText }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EditableSection>
  );
}
