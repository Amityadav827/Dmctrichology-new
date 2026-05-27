"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import EditableImage from './Editable/EditableImage';

export default function AboutDrNandaniTimeline({ data = {} }) {
  const {
    heading = "What Makes Dr. Nandini Dadu the Best Hair Transplant Surgeon in Delhi?",
    sectionBgColor = "#FFFFFF",
    sectionImage = "",
    steps = [
      {
        title: "Compassionate Approach",
        description: "Empathy towards patients makes them feel comfortable and informed.",
        numberLabel: "01",
        colorMode: "gold",
        iconName: "heart"
      },
      {
        title: "Artistic Skills",
        description: "Expert knowledge and artistic approach ensure the latest and most effective treatments.",
        numberLabel: "02",
        colorMode: "navy",
        iconName: "brain"
      },
      {
        title: "Customized Treatment Plan",
        description: "Provide tailored treatments for every unique individual and their needs.",
        numberLabel: "03",
        colorMode: "gold",
        iconName: "kit"
      },
      {
        title: "Advanced Technologies",
        description: "Uses specialized techniques and equipment to achieve maximum results.",
        numberLabel: "04",
        colorMode: "navy",
        iconName: "tech"
      }
    ]
  } = data;

  const renderIcon = (name) => {
    switch (name) {
      case 'heart':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E4B753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'brain':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b5998" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
          </svg>
        );
      case 'kit':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E4B753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        );
      case 'tech':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b5998" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E4B753" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        );
    }
  };

  return (
    <EditableSection sectionId="about-nandani-timeline" label="Dr Nandani Timeline">
      <div
        className="dr-nandani-timeline-section"
        style={{
          backgroundColor: sectionBgColor || "#FFFFFF",
          padding: "90px 24px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box"
        }}
      >
        <div style={{ maxWidth: "1280px", width: "100%", textAlign: "center" }}>
          {/* Section Title */}
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "600",
              color: "#1A1A1A",
              marginBottom: "40px",
              fontFamily: "'Playfair Display', serif",
              lineHeight: "1.4",
              letterSpacing: "0.01em"
            }}
          >
            <EditableText sectionId="about-nandani-timeline" fieldPath="timeline.heading">
              {heading}
            </EditableText>
          </h2>

          {/* Dynamic Image Below Heading */}
          {sectionImage && (
            <div 
              className="timeline-dynamic-image-container"
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '65px',
                width: '100%'
              }}
            >
              <EditableImage
                sectionId="about-nandani-timeline"
                fieldPath="timeline.sectionImage"
                src={sectionImage}
                alt="Dr. Nandini Dadu Hair Transplant"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '450px', 
                  borderRadius: '16px', 
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
                  objectFit: 'cover'
                }} 
              />
            </div>
          )}

          {/* Timeline Infographic Wrapper */}
          {steps && steps.length > 0 && (
            <div className="infographic-container">
              {/* Steps Container */}
              <div className="timeline-steps-grid">
                {steps.map((step, idx) => {
                  const isTop = idx % 2 === 0; // 0, 2 are TOP semicircles (gold); 1, 3 are BOTTOM semicircles (navy)
                  const isGold = step.colorMode === 'gold' || (!step.colorMode && isTop);
                  const colorValue = isGold ? "#E4B753" : "#3b5998";

                  return (
                    <div key={idx} className={`timeline-step-card-wrapper ${isTop ? 'top-step' : 'bottom-step'}`}>
                      
                      {/* Junction Point Indicator */}
                      <div className="timeline-junction-node" style={{ borderColor: colorValue }} />

                      {/* Desktop stems & badges */}
                      {isTop ? (
                        /* TOP CARD FLOW: Stem UP -> Badge -> Dome -> Icon -> Title -> Description BELOW axis */
                        <div className="top-layout-flow">
                          {/* Number Badge with stem */}
                          <div className="timeline-badge-group badge-up">
                            <span className="badge-circle" style={{ backgroundColor: colorValue }}>
                              <EditableText sectionId="about-nandani-timeline" fieldPath={`timeline.steps.${idx}.numberLabel`}>
                                {step.numberLabel}
                              </EditableText>
                            </span>
                            <div className="badge-stem-line" style={{ backgroundColor: colorValue }} />
                          </div>

                          {/* Dome curve (Top Semicircle facing up) */}
                          <div 
                            className="dome-semicircle semicircle-top" 
                            style={{ 
                              backgroundColor: colorValue,
                              borderRadius: "120px 120px 0 0"
                            }}
                          >
                            <div className="inner-title-text" style={{ color: "#FFFFFF" }}>
                              <EditableText sectionId="about-nandani-timeline" fieldPath={`timeline.steps.${idx}.title`}>
                                {step.title}
                              </EditableText>
                            </div>
                            {/* Circular icon holder sitting centered on the bottom flat edge */}
                            <div className="circular-icon-holder icon-bottom">
                              {renderIcon(step.iconName)}
                            </div>
                          </div>

                          {/* Description copy placed below the axis line */}
                          <div className="editorial-desc-box desc-below">
                            <p>
                              <EditableText sectionId="about-nandani-timeline" fieldPath={`timeline.steps.${idx}.description`}>
                                {step.description}
                              </EditableText>
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* BOTTOM CARD FLOW: Description ABOVE axis -> Semicircle on bottom -> Stem DOWN -> Badge */
                        <div className="bottom-layout-flow">
                          {/* Description copy placed above the axis line */}
                          <div className="editorial-desc-box desc-above">
                            <p>
                              <EditableText sectionId="about-nandani-timeline" fieldPath={`timeline.steps.${idx}.description`}>
                                {step.description}
                              </EditableText>
                            </p>
                          </div>

                          {/* Dome curve (Bottom Semicircle facing down) */}
                          <div 
                            className="dome-semicircle semicircle-bottom" 
                            style={{ 
                              backgroundColor: colorValue,
                              borderRadius: "0 0 120px 120px"
                            }}
                          >
                            {/* Circular icon holder sitting centered on the top flat edge */}
                            <div className="circular-icon-holder icon-top">
                              {renderIcon(step.iconName)}
                            </div>
                            <div className="inner-title-text" style={{ color: "#FFFFFF", marginTop: "24px" }}>
                              <EditableText sectionId="about-nandani-timeline" fieldPath={`timeline.steps.${idx}.title`}>
                                {step.title}
                              </EditableText>
                            </div>
                          </div>

                          {/* Number Badge with stem */}
                          <div className="timeline-badge-group badge-down">
                            <div className="badge-stem-line" style={{ backgroundColor: colorValue }} />
                            <span className="badge-circle" style={{ backgroundColor: colorValue }}>
                              <EditableText sectionId="about-nandani-timeline" fieldPath={`timeline.steps.${idx}.numberLabel`}>
                                {step.numberLabel}
                              </EditableText>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* Desktop Horizontal Timeline Styles */
        .infographic-container {
          position: relative;
          width: 100%;
          padding: 40px 0;
          box-sizing: border-box;
        }

        .timeline-horizontal-axis {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background-color: rgba(0, 0, 0, 0.08);
          z-index: 1;
          transform: translateY(-50%);
        }

        .timeline-steps-grid {
          display: grid;
          grid-template-cols: repeat(4, 1fr);
          gap: 24px;
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .timeline-step-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        /* Semicircle Domes styling */
        .dome-semicircle {
          width: 220px;
          height: 110px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.04);
          box-sizing: border-box;
          transition: transform 0.3s ease;
        }

        .dome-semicircle:hover {
          transform: scale(1.03);
        }

        .inner-title-text {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          max-width: 160px;
          line-height: 1.3;
          z-index: 5;
          letter-spacing: 0.02em;
        }

        /* Circular White Icon Holders sitting on flat edges */
        .circular-icon-holder {
          position: absolute;
          width: 52px;
          height: 52px;
          background-color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          z-index: 10;
          left: 50%;
          transform: translateX(-50%);
        }

        .icon-bottom {
          bottom: -26px;
        }

        .icon-top {
          top: -26px;
        }

        /* Stems and Badges group */
        .timeline-badge-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 5;
        }

        .badge-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          color: #FFFFFF;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }

        .badge-stem-line {
          width: 2px;
          height: 36px;
        }

        /* Description Box styling */
        .editorial-desc-box {
          max-width: 240px;
          width: 100%;
          padding: 16px;
          box-sizing: border-box;
        }

        .editorial-desc-box p {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          line-height: 1.6;
          color: #555555;
          font-weight: 400;
          margin: 0;
          text-align: center;
        }

        /* Position structures */
        .top-layout-flow {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .bottom-layout-flow {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          margin-top: 24px;
        }

        .desc-below {
          margin-top: 48px;
        }

        .desc-above {
          margin-bottom: 48px;
        }

        /* Junction dots sitting on the timeline */
        .timeline-junction-node {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background-color: #FFFFFF;
          border-width: 3px;
          border-style: solid;
          border-radius: 50%;
          z-index: 4;
          display: none; /* Only show in vertical view */
        }

        /* Tablet & Mobile Stacked responsive view */
        @media (max-width: 991px) {
          .timeline-horizontal-axis {
            display: none;
          }

          .timeline-steps-grid {
            grid-template-cols: 1fr !important;
            gap: 40px !important;
            max-width: 500px;
            margin: 0 auto;
            position: relative;
          }

          .timeline-steps-grid::before {
            content: '';
            position: absolute;
            top: 20px;
            bottom: 20px;
            left: 24px;
            width: 2px;
            background-color: rgba(0, 0, 0, 0.08);
            z-index: 1;
          }

          .timeline-step-card-wrapper {
            flex-direction: row !important;
            align-items: flex-start !important;
            width: 100%;
            text-align: left !important;
          }

          .timeline-junction-node {
            display: block;
            left: 24px !important;
            transform: translate(-50%, 0) !important;
            margin-top: 20px;
          }

          .top-layout-flow, .bottom-layout-flow {
            flex-direction: column !important;
            align-items: flex-start !important;
            margin: 0 !important;
            padding-left: 56px;
            width: 100%;
          }

          .timeline-badge-group {
            flex-direction: row !important;
            gap: 12px;
            margin: 0 0 16px 0 !important;
          }

          .badge-stem-line {
            display: none;
          }

          .dome-semicircle {
            width: 100% !important;
            height: 80px !important;
            border-radius: 12px !important; /* Elegant rounded card on mobile */
            justify-content: flex-start !important;
            padding: 0 24px !important;
          }

          .inner-title-text {
            text-align: left !important;
            max-width: 100% !important;
            font-size: 15px !important;
            margin: 0 !important;
          }

          .circular-icon-holder {
            position: relative !important;
            left: auto !important;
            transform: none !important;
            margin-right: 16px;
            width: 44px !important;
            height: 44px !important;
            flex-shrink: 0;
          }

          .icon-bottom, .icon-top {
            bottom: auto !important;
            top: auto !important;
          }

          .editorial-desc-box {
            max-width: 100% !important;
            padding: 12px 0 0 0 !important;
            margin: 0 !important;
          }

          .editorial-desc-box p {
            text-align: left !important;
            font-size: 13.5px !important;
          }

          .dr-nandani-timeline-section h2 {
            margin-bottom: 48px !important;
            font-size: 24px !important;
          }
        }
      `}</style>
    </EditableSection>
  );
}
