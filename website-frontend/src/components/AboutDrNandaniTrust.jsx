"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import EditableImage from './Editable/EditableImage';

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
    title: "Expert In Complex Procedures",
    description: "She also takes a keen interest in performing complex procedures, such as repair hair transplants, body hair transplants, high-density transplants, her signature approach, DMC-Golden Touch, and more."
  },
  {
    title: "Expert Precision For Natural Results",
    description: "When it comes to hair transplants, the key factor is that the results should look natural. Dr. Dadu utilises her artistic abilities to provide a natural hairline. It gives patients confidence and leaves no proof that they underwent a hair transplant."
  }
];

export default function AboutDrNandaniTrust({ data = {} }) {
  const eyebrow = data.eyebrow || "TRUSTED CARE SERVICES";
  const heading = data.heading || "Why Do Patients Trust Dr. Nandani Dadu As A Hair Transplant Doctor In Delhi?";
  const image = data.image || "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";
  const imageAlt = data.imageAlt || "Hair transplant treatment planning";
  const trustPoints = (data.trustPoints && data.trustPoints.length > 0) ? data.trustPoints : defaultTrustPoints;
  const conclusion = data.conclusionParagraph || "Dr. Nandani Dadu is a renowned hair transplant doctor in Delhi. She is an expert who provides safe, effective, and natural-looking results to all her patients. The doctor performs a thorough scalp examination to determine the extent of hair loss and then suggests the most suitable hair transplant technique. Those willing to restore their hair and are looking for expert help must consult Dr. Nandani Dadu now!";

  return (
    <EditableSection sectionId="about-nandani-trust" label="Why Patients Trust Dr. Nandani">
      <section className="nandani-patient-trust-section">
        <div className="nandani-patient-trust-inner">
          <div className="nandani-patient-trust-image">
            <EditableImage
              sectionId="about-nandani-trust"
              fieldPath="trustSection.image"
              src={image}
              alt={imageAlt}
            />
          </div>

          <div className="nandani-patient-trust-content">
            <div className="nandani-section-eyebrow">
              <span />
              <EditableText sectionId="about-nandani-trust" fieldPath="trustSection.eyebrow" tag="small">
                {eyebrow}
              </EditableText>
            </div>

            <h2>
              <EditableText sectionId="about-nandani-trust" fieldPath="trustSection.heading" tag="span">
                {heading}
              </EditableText>
            </h2>

            <div className="nandani-trust-blocks">
              {trustPoints.map((point, idx) => (
                <article key={idx}>
                  <h3>
                    <EditableText sectionId="about-nandani-trust" fieldPath={`trustSection.trustPoints.${idx}.title`} tag="span">
                      {point.title}
                    </EditableText>
                  </h3>
                  <p>
                    <EditableText sectionId="about-nandani-trust" fieldPath={`trustSection.trustPoints.${idx}.description`} tag="span">
                      {point.description}
                    </EditableText>
                  </p>
                </article>
              ))}
            </div>

            {conclusion && (
              <p className="nandani-trust-conclusion">
                <EditableText sectionId="about-nandani-trust" fieldPath="trustSection.conclusionParagraph" tag="span">
                  {conclusion}
                </EditableText>
              </p>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .nandani-patient-trust-section {
          width: 100%;
          background: #e8eaf6;
          padding: 92px 5%;
        }

        .nandani-patient-trust-inner {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1fr);
          gap: 78px;
          align-items: center;
        }

        .nandani-patient-trust-image {
          width: 100%;
          border-radius: 30px;
          overflow: hidden;
          min-height: 560px;
          box-shadow: 0 24px 54px rgba(59, 89, 152, 0.14);
          background: #d7d9e4;
        }

        .nandani-patient-trust-image :global(img) {
          width: 100%;
          height: 100%;
          min-height: 560px;
          object-fit: cover;
          display: block;
        }

        .nandani-section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 26px;
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

        .nandani-patient-trust-content h2 {
          font-family: 'Marcellus', serif;
          font-size: clamp(33px, 4vw, 48px);
          line-height: 1.17;
          font-weight: 400;
          color: #111111;
          margin: 0 0 34px;
        }

        .nandani-trust-blocks {
          display: grid;
          gap: 26px;
        }

        .nandani-trust-blocks article h3 {
          font-family: 'Marcellus', serif;
          font-size: 22px;
          line-height: 1.28;
          font-weight: 400;
          color: #111111;
          margin: 0 0 10px;
        }

        .nandani-trust-blocks article p,
        .nandani-trust-conclusion {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.75;
          color: #333333;
          margin: 0;
        }

        .nandani-trust-conclusion {
          border-top: 1px solid rgba(17, 17, 17, 0.14);
          margin-top: 28px;
          padding-top: 28px;
        }

        @media (max-width: 980px) {
          .nandani-patient-trust-inner {
            grid-template-columns: 1fr;
            gap: 42px;
          }

          .nandani-patient-trust-image,
          .nandani-patient-trust-image :global(img) {
            min-height: 420px;
          }
        }

        @media (max-width: 520px) {
          .nandani-patient-trust-section {
            padding: 64px 5%;
          }

          .nandani-patient-trust-image,
          .nandani-patient-trust-image :global(img) {
            min-height: 300px;
            border-radius: 22px;
          }

          .nandani-trust-blocks article h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </EditableSection>
  );
}
