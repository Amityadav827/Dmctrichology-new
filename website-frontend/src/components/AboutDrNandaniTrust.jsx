"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import EditableImage from './Editable/EditableImage';

export default function AboutDrNandaniTrust({ data = {} }) {
  const defaultTrustPoints = [
    {
      title: "Unparalleled Expertise",
      description: "Dr. Nandani Dadu performs the best hair loss, thinning, and baldness procedures. She has continuously contributed to improving many lives by providing excellent hair transplant results. Through her honesty, hard work, and passionate service, she aims to change every frown into a smile."
    },
    {
      title: "Vast Hair Restoration Procedures",
      description: "Her expertise lies in hair procedures, such as DMC Mesogrow, Advanced HGP, Keravive Hair, Hair Rituals, and DMC-Golden Touch for hair transplants."
    },
    {
      title: "Expert in Complex Procedures",
      description: "She also takes a keen interest in performing complex procedures, such as repair hair transplants, body hair transplants, high-density transplants, her signature approach, DMC-Golden Touch, and more."
    },
    {
      title: "Expert Precision for Natural Results",
      description: "When it comes to hair transplants, the key factor is that the results should look natural. Dr. Dadu utilises her artistic abilities to provide a natural hairline. It gives patients confidence and leaves no proof that they underwent a hair transplant."
    }
  ];

  const defaultConclusion = "Dr. Nandani Dadu is a renowned hair transplant doctor in Delhi. She is an expert who provides safe, effective, and natural-looking results to all her patients. The doctor performs a thorough scalp examination to determine the extent of hair loss and then suggests the most suitable hair transplant technique. Those willing to restore their hair and are looking for expert help must consult Dr. Nandani Dadu now!";
  const defaultImage = "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png";
  const defaultHeading = "Why Do Patients Trust Dr. Nandani Dadu As a Hair Transplant Doctor in Delhi?";

  const {
    heading,
    image,
    imageAlt,
    imageMaxWidth,
    trustPoints,
    conclusionParagraph,
    paddingTop = "110px",
    paddingBottom = "110px"
  } = data || {};

  const resolvedHeading = heading || defaultHeading;
  const resolvedImage = image || defaultImage;
  const resolvedImageAlt = imageAlt || "Dr. Nandani Dadu";
  const resolvedImageMaxWidth = imageMaxWidth || "100%";
  const resolvedTrustPoints = (!trustPoints || trustPoints.length === 0) ? defaultTrustPoints : trustPoints;
  const resolvedConclusion = conclusionParagraph || defaultConclusion;
  const resolvedPaddingTop = paddingTop || "110px";
  const resolvedPaddingBottom = paddingBottom || "110px";

  return (
    <EditableSection sectionId="about-nandani-trust" label="Why Patients Trust Dr. Nandani">
      <div 
        className="nandani-trust-section-wrapper"
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          paddingTop: resolvedPaddingTop || "110px",
          paddingBottom: resolvedPaddingBottom || "110px",
          position: "relative",
          boxSizing: "border-box"
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .nandani-trust-section-wrapper,
          .nandani-trust-section-wrapper * {
            font-family: 'Marcellus', serif !important;
            box-sizing: border-box;
          }
          
          .nandani-trust-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Top centered heading */
          .nandani-trust-heading {
            font-size: 48px;
            font-weight: 500;
            text-align: center;
            color: #000000;
            margin: 0 auto 60px auto;
            line-height: 1.3;
            max-width: 1000px;
          }

          @media (max-width: 768px) {
            .nandani-trust-heading {
              font-size: 34px !important;
              margin-bottom: 40px !important;
            }
          }

          /* Two-column editorial grid */
          .nandani-trust-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 55px;
            align-items: start;
          }

          @media (max-width: 767px) {
            .nandani-trust-grid {
              grid-template-cols: 1fr;
              gap: 40px;
            }
          }

          /* Left premium image card */
          .nandani-trust-image-card {
            background-color: #ffffff;
            border: 4px solid #3b5998;
            padding: 10px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
            border-radius: 0px !important; /* SQUARE CORNERS only */
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .nandani-trust-img-wrap {
            width: 100%;
            overflow: hidden;
            display: block;
          }

          .nandani-trust-img-wrap img {
            width: 100%;
            height: auto;
            object-fit: cover;
            display: block;
          }

          /* Right trust points */
          .nandani-trust-points-list {
            display: flex;
            flex-direction: column;
            gap: 32px;
          }

          .nandani-trust-point-item {
            display: flex;
            align-items: start;
            gap: 16px;
          }

          .nandani-trust-point-icon {
            flex-shrink: 0;
            margin-top: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .nandani-trust-point-content {
            display: flex;
            flex-direction: column;
          }

          .nandani-trust-point-title {
            font-size: 20px;
            font-weight: 600;
            color: #000000;
            margin: 0 0 10px 0;
            line-height: 1.4;
            display: inline-block;
          }

          .nandani-trust-point-desc {
            font-size: 18px;
            line-height: 2;
            color: #000000;
            margin: 0;
            text-align: justify;
          }

          /* Bottom concluding paragraph */
          .nandani-trust-conclusion {
            margin-top: 56px;
            font-size: 19px;
            line-height: 2.1;
            color: #000000;
            text-align: justify;
            border-top: 1px solid rgba(59, 89, 152, 0.1);
            padding-top: 40px;
          }

          @media (max-width: 968px) {
            .nandani-trust-conclusion {
              margin-top: 40px;
              padding-top: 24px;
            }
          }
        `}} />

        <div className="nandani-trust-container">
          {/* Centered Heading */}
          <h2 className="nandani-trust-heading">
            <EditableText sectionId="about-nandani-trust" fieldPath="trustSection.heading" tag="span">
              {resolvedHeading}
            </EditableText>
          </h2>

          {/* Grid Layout */}
          <div className="nandani-trust-grid">
            
            {/* Left Side: Premium Image Frame */}
            <div className="nandani-trust-image-card" style={{ maxWidth: resolvedImageMaxWidth || "100%" }}>
              <div className="nandani-trust-img-wrap">
                <EditableImage
                  sectionId="about-nandani-trust"
                  src={resolvedImage}
                  alt={resolvedImageAlt}
                  fieldPath="trustSection.image"
                />
              </div>
            </div>

            {/* Right Side: Repeatable Trust Points */}
            <div className="nandani-trust-points-list">
              {resolvedTrustPoints.map((point, idx) => (
                <div key={idx} className="nandani-trust-point-item">
                  <div className="nandani-trust-point-icon">
                    {/* Premium gold tick/check icon */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="nandani-trust-point-content">
                    <h3 className="nandani-trust-point-title">
                      <EditableText 
                        sectionId="about-nandani-trust" 
                        fieldPath={`trustSection.trustPoints.${idx}.title`} 
                        tag="span"
                      >
                        {point.title}
                      </EditableText>
                    </h3>
                    <p className="nandani-trust-point-desc">
                      <EditableText 
                        sectionId="about-nandani-trust" 
                        fieldPath={`trustSection.trustPoints.${idx}.description`} 
                        tag="span"
                      >
                        {point.description}
                      </EditableText>
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Concluding Editorial Paragraph */}
          {resolvedConclusion && (
            <div className="nandani-trust-conclusion">
              <EditableText
                sectionId="about-nandani-trust"
                fieldPath="trustSection.conclusionParagraph"
                tag="p"
              >
                {resolvedConclusion}
              </EditableText>
            </div>
          )}

        </div>
      </div>
    </EditableSection>
  );
}
