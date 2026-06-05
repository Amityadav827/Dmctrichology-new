"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNandaniCredentials({ data = {} }) {
  const {
    bannerImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp",
    overlayOpacity = 0.35,
    heading = "Credentials",
    credentialsList = [
      { text: "Fellowship In Aesthetic Medicine" },
      { text: "Fellowship In Hair Science" },
      { text: "Fellowship In Pain Medicine" }
    ],
    leftHeading = "EXPERTISE IN HAIR & SCALP TREATMENT",
    leftText = "<p>Dr. Nandini Dadu's cutting-edge Hair Loss Treatment technique has made a significant difference in the lives of those suffering from severe hair loss. She is the <strong>best hair specialist in Delhi</strong> available at DMC Trichology in Delhi, Vasant Vihar (South Delhi), & Rajouri Garden (West Delhi). She is solely dedicated to treating male and female hair loss with the most advanced surgical technologies available.</p><p>\"There is way more to hair restoration than JUST SCIENCE. For the optimal outcomes, ARTISTRY & IMAGINATION are required.\"</p><p>Dr. Nandini Dadu has always taken a distinctive approach to hairline design because of her passion for the art and craft of hair restoration procedures. Her primary goal is to achieve natural – superior hairlines while treating the patients' underlying issues. To ensure that her patient is confident and pleased with the most natural-looking and long-lasting outcome, Dr. Nandini meticulously subjects and specifies every aspect of her surgical procedure.</p>",
    rightHeading = "COMMITMENT TO PATIENT",
    rightText = "<p>Dr. Nandini Dadu places a high value on the doctor-patient relationship. She frequently adheres to the culture of having as much interaction as possible with her patients in order to go over the specifics of their hair loss issues and arrive at an accurate diagnosis.</p><p>With Dr. Nandini, the individualized care and attention don't stop after the procedure. She has developed a cultivating focus on patient education and offers an all-inclusive wellness protocol at every step.</p><p>The level of care that Dr. Nandini Dadu gives her patients is exceptional, and every surgical hair transplant by the best hair transplant surgeon in Delhi helps patients benefits due to her in-depth expertise.</p>",
    paddingTop = "120px",
    paddingBottom = "80px"
  } = data;

  return (
    <EditableSection sectionId="about-nandani-credentials" label="Dr Nandani Credentials">
      <div 
        className="nandani-credentials-section-wrapper"
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
          .nandani-credentials-section-wrapper,
          .nandani-credentials-section-wrapper * {
            font-family: 'Marcellus', serif !important;
            box-sizing: border-box;
          }
          
          /* Full-width cinematic banner */
          .nandani-cinematic-banner {
            width: 100%;
            height: 320px;
            position: relative;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          
          .nandani-cinematic-banner-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, ${overlayOpacity});
          }

          /* Centered Overlapping Card Container */
          .nandani-overlapping-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 24px;
            position: relative;
            z-index: 10;
          }

          /* Squared White Floating Card */
          .nandani-floating-editorial-card {
            background-color: #ffffff;
            border-radius: 0px !important; /* STRICT REQUIREMENT: square corners */
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
            transform: translateY(-120px);
            margin-bottom: -120px; /* offset the translate so content below flows perfectly */
            padding: 70px;
          }

          @media (max-width: 768px) {
            .nandani-floating-editorial-card {
              padding: 30px !important;
              transform: translateY(-80px);
              margin-bottom: -80px;
            }
            .nandani-cinematic-banner {
              height: 240px;
            }
          }

          /* Title credentials */
          .nandani-credentials-heading {
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
            .nandani-credentials-heading {
              font-size: 32px !important;
            }
          }

          /* Repeatable checklist row */
          .nandani-credentials-badges-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px 32px;
            margin-bottom: 56px;
            border-bottom: 1px solid rgba(59, 89, 152, 0.1);
            padding-bottom: 40px;
          }

          .nandani-badge-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .nandani-badge-text {
            font-size: 16px;
            font-weight: 500;
            color: #333333;
            letter-spacing: 0.01em;
          }

          /* Two column grid */
          .nandani-editorial-columns-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 70px;
          }

          @media (max-width: 968px) {
            .nandani-editorial-columns-grid {
              grid-template-cols: 1fr;
              gap: 48px;
            }
          }

          .nandani-column {
            display: flex;
            flex-direction: column;
          }

          .nandani-column-heading {
            font-size: 18px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #333333;
            margin-bottom: 24px;
            line-height: 1.4;
          }

          .nandani-column-body-text {
            font-size: 17px;
            line-height: 2;
            color: #333333;
            text-align: justify;
          }

          .nandani-column-body-text p {
            margin-bottom: 24px;
          }

          .nandani-column-body-text p:last-child {
            margin-bottom: 0;
          }

          .nandani-column-body-text strong {
            font-weight: 700;
          }
        `}} />

        {/* Cinematic banner with dynamic image and overlay */}
        <div 
          className="nandani-cinematic-banner" 
          style={{ backgroundImage: `url('${bannerImage}')` }}
        >
          <div className="nandani-cinematic-banner-overlay"></div>
        </div>

        {/* Centered overlapping floating white card */}
        <div className="nandani-overlapping-container">
          <div className="nandani-floating-editorial-card">
            {/* Top Center: Credentials Title */}
            <h2 className="nandani-credentials-heading">
              <EditableText sectionId="about-nandani-credentials" fieldPath="credentialsSection.heading" tag="span">
                {heading}
              </EditableText>
            </h2>

            {/* Repeatable Checklist Row */}
            <div className="nandani-credentials-badges-row">
              {credentialsList.map((cred, idx) => (
                <div key={idx} className="nandani-badge-item">
                  {/* Custom Check SVG */}
                  <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <EditableText 
                    sectionId="about-nandani-credentials" 
                    fieldPath={`credentialsSection.credentialsList.${idx}.text`} 
                    className="nandani-badge-text"
                    tag="span"
                  >
                    {cred.text}
                  </EditableText>
                </div>
              ))}
            </div>

            {/* Bottom: Two-Column Editorial Grid */}
            <div className="nandani-editorial-columns-grid">
              {/* Left Column: Expertise */}
              <div className="nandani-column">
                <h3 className="nandani-column-heading">
                  <EditableText sectionId="about-nandani-credentials" fieldPath="credentialsSection.leftHeading" tag="span">
                    {leftHeading}
                  </EditableText>
                </h3>
                <div className="nandani-column-body-text">
                  <EditableText
                    sectionId="about-nandani-credentials"
                    fieldPath="credentialsSection.leftText"
                    tag="div"
                    dangerouslySetInnerHTML={{ __html: leftText }}
                  />
                </div>
              </div>

              {/* Right Column: Commitment */}
              <div className="nandani-column">
                <h3 className="nandani-column-heading">
                  <EditableText sectionId="about-nandani-credentials" fieldPath="credentialsSection.rightHeading" tag="span">
                    {rightHeading}
                  </EditableText>
                </h3>
                <div className="nandani-column-body-text">
                  <EditableText
                    sectionId="about-nandani-credentials"
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
