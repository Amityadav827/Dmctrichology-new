"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import RichTextContent from './RichTextContent';

const defaultSteps = [
  {
    title: "Compassionate Approach",
    description: "Empathy towards patients makes them feel comfortable and informed.",
    icon: ""
  },
  {
    title: "Artistic Skills",
    description: "Expert knowledge and artistic approach ensure the latest and most effective treatments.",
    icon: ""
  },
  {
    title: "Customized Treatment Plan",
    description: "Provide tailored treatments for every unique individual and their needs.",
    icon: ""
  },
  {
    title: "Advanced Technologies",
    description: "Uses specialized techniques and equipment to achieve maximum results.",
    icon: ""
  }
];

function DefaultFeatureIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M7 8c-2 1.4-3 3-3 5.2C4 17.5 7.2 20 12 20s8-2.5 8-6.8c0-2.2-1-3.8-3-5.2" />
      <path d="M8 5c1.2 1 2.5 1.5 4 1.5S14.8 6 16 5" />
      <path d="M8.5 13.5 11 16l4.5-5" />
    </svg>
  );
}

export default function AboutDrNandaniTimeline({ data = {}, showDescription = false }) {
  const eyebrow = data.eyebrow || "TRUSTED CARE SERVICES";
  const heading = data.heading || "What Makes Dr. Nandani Dadu The Best Hair Transplant Surgeon In Delhi?";
  const description = data.description || "";
  const steps = (data.steps && data.steps.length > 0) ? data.steps : defaultSteps;

  return (
    <EditableSection sectionId="about-nandani-timeline" label="Dr Nandani Feature List">
      <section className="nandani-feature-list-section">
        <div className="nandani-feature-list-inner">
          <div className="nandani-section-eyebrow">
            <span />
            <EditableText sectionId="about-nandani-timeline" fieldPath="timeline.eyebrow" tag="small">
              {eyebrow}
            </EditableText>
          </div>

          <h2 className="nandani-feature-list-title">
            <EditableText sectionId="about-nandani-timeline" fieldPath="timeline.heading" tag="span">
              {heading}
            </EditableText>
          </h2>

          {showDescription && description && (
            <RichTextContent value={description} className="nandani-feature-list-description" />
          )}

          <div className="nandani-feature-rows">
            {steps.map((step, idx) => (
              <article className="nandani-feature-row" key={idx}>
                <div className="nandani-feature-icon">
                  {step.icon ? (
                    <img src={step.icon} alt={step.title || "Feature icon"} />
                  ) : (
                    <DefaultFeatureIcon />
                  )}
                </div>

                <h3>
                  <EditableText sectionId="about-nandani-timeline" fieldPath={`timeline.steps.${idx}.title`} tag="span">
                    {step.title}
                  </EditableText>
                </h3>

                <RichTextContent value={step.description} className="nandani-feature-description" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .nandani-feature-list-section {
          width: 100%;
          background: #ffffff;
          padding: 92px 5%;
        }

        .nandani-feature-list-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        .nandani-section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .nandani-section-eyebrow span {
          width: 58px;
          height: 1px;
          background: #3b5998;
          position: relative;
        }

        .nandani-section-eyebrow span::after {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #3b5998;
          position: absolute;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
        }

        .nandani-section-eyebrow small {
          font-family: 'Lato', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #333333;
          text-transform: uppercase;
        }

        .nandani-feature-list-title {
          font-family: 'Marcellus', serif;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.18;
          font-weight: 400;
          color: #111111;
          margin: 0 0 24px;
          max-width: 1120px;
        }

        .nandani-feature-list-description,
        .nandani-feature-list-description :global(p),
        .nandani-feature-list-description :global(li) {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: #333333;
          font-weight: 400;
        }

        .nandani-feature-list-description {
          max-width: 980px;
          margin: 0 0 34px;
        }

        .nandani-feature-list-description :global(p) {
          margin: 0 0 14px;
        }

        .nandani-feature-list-description :global(p:last-child) {
          margin-bottom: 0;
        }

        .nandani-feature-list-description :global(ul),
        .nandani-feature-list-description :global(ol) {
          margin: 0 0 14px 22px;
          padding: 0;
        }

        .nandani-feature-list-description :global(a) {
          color: #3b5998;
          text-decoration: underline;
        }

        .nandani-feature-rows {
          border-top: 1px solid rgba(17, 17, 17, 0.16);
        }

        .nandani-feature-row {
          display: grid;
          grid-template-columns: 150px minmax(220px, 0.9fr) minmax(320px, 1.3fr);
          gap: 44px;
          align-items: center;
          min-height: 132px;
          border-bottom: 1px solid rgba(17, 17, 17, 0.16);
          padding: 26px 0;
        }

        .nandani-feature-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #3b5998;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 14px 30px rgba(59, 89, 152, 0.2);
        }

        .nandani-feature-icon img {
          width: 30px;
          height: 30px;
          object-fit: contain;
          display: block;
        }

        .nandani-feature-row h3 {
          font-family: 'Marcellus', serif;
          font-size: clamp(22px, 2.2vw, 31px);
          font-weight: 400;
          line-height: 1.25;
          color: #111111;
          margin: 0;
        }

        .nandani-feature-row p,
        .nandani-feature-description,
        .nandani-feature-description :global(p),
        .nandani-feature-description :global(li) {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #333333;
          margin: 0;
        }
        .nandani-feature-description :global(ul),
        .nandani-feature-description :global(ol) {
          margin: 0 0 0 20px;
          padding: 0;
        }

        @media (max-width: 900px) {
          .nandani-feature-list-section {
            padding: 72px 5%;
          }

          .nandani-feature-row {
            grid-template-columns: 1fr;
            gap: 16px;
            align-items: flex-start;
            min-height: auto;
            padding: 28px;
            margin-bottom: 18px;
            border: 1px solid rgba(17, 17, 17, 0.12);
            border-radius: 22px;
            background: #f7f8fc;
          }

          .nandani-feature-rows {
            border-top: 0;
          }

          .nandani-feature-row h3 {
            font-size: 25px;
          }
        }

        @media (max-width: 480px) {
          .nandani-feature-list-section {
            padding: 58px 5%;
          }

          .nandani-feature-row {
            padding: 22px;
            border-radius: 18px;
          }

          .nandani-feature-icon {
            width: 52px;
            height: 52px;
          }
        }
      `}</style>
    </EditableSection>
  );
}
