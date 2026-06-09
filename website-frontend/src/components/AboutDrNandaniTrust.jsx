"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import EditableImage from './Editable/EditableImage';
import RichTextContent from './RichTextContent';

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

export default function AboutDrNandaniTrust({
  data = {},
  sectionId = "about-nandani-trust",
  label = "Why Patients Trust Dr. Nandani",
  splitLayout = false
}) {
  const eyebrow = data.eyebrow || "TRUSTED CARE SERVICES";
  const heading = data.heading || "Why Do Patients Trust Dr. Nandani Dadu As A Hair Transplant Doctor In Delhi?";
  const image = data.image || "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";
  const imageAlt = data.imageAlt || "Hair transplant treatment planning";
  const trustPoints = (data.trustPoints && data.trustPoints.length > 0) ? data.trustPoints : defaultTrustPoints;
  const conclusion = data.conclusionParagraph || "Dr. Nandani Dadu is a renowned hair transplant doctor in Delhi. She is an expert who provides safe, effective, and natural-looking results to all her patients. The doctor performs a thorough scalp examination to determine the extent of hair loss and then suggests the most suitable hair transplant technique. Those willing to restore their hair and are looking for expert help must consult Dr. Nandani Dadu now!";

  const splitTrust = Boolean(splitLayout) && trustPoints.length > 1;
  // Balance the two columns by total text length (conclusion sits in section 2)
  const splitMid = (() => {
    const blockLen = (p) => String(p?.description || '').length + String(p?.title || '').length;
    const total = trustPoints.reduce((s, p) => s + blockLen(p), 0) + String(conclusion || '').length;
    let acc = 0;
    for (let i = 0; i < trustPoints.length; i++) {
      acc += blockLen(trustPoints[i]);
      if (acc >= total / 2) return i + 1;
    }
    return trustPoints.length;
  })();

  const trustImage = (
    <div className="nandani-patient-trust-image">
      <EditableImage
        sectionId={sectionId}
        fieldPath="trustSection.image"
        src={image}
        alt={imageAlt}
      />
    </div>
  );

  const eyebrowBlock = (
    <div className="nandani-section-eyebrow">
      <span />
      <EditableText sectionId={sectionId} fieldPath="trustSection.eyebrow" tag="small">
        {eyebrow}
      </EditableText>
    </div>
  );

  const headingBlock = (
    <h2>
      <EditableText sectionId={sectionId} fieldPath="trustSection.heading" tag="span">
        {heading}
      </EditableText>
    </h2>
  );

  const renderPoints = (points, offset = 0) => (
    <div className="nandani-trust-blocks">
      {points.map((point, i) => {
        const idx = i + offset;
        return (
          <article key={idx}>
            <h3>
              <EditableText sectionId={sectionId} fieldPath={`trustSection.trustPoints.${idx}.title`} tag="span">
                {point.title}
              </EditableText>
            </h3>
            <RichTextContent value={point.description} className="nandani-trust-description" />
          </article>
        );
      })}
    </div>
  );

  return (
    <EditableSection sectionId={sectionId} label={label}>
      {splitTrust ? (
        <>
          <section className="nandani-patient-trust-section">
            <div className="nandani-patient-trust-inner nandani-trust-inner-split">
              {trustImage}
              <div className="nandani-patient-trust-content">
                {eyebrowBlock}
                {headingBlock}
                {renderPoints(trustPoints.slice(0, splitMid), 0)}
              </div>
            </div>
          </section>

          <section className="nandani-patient-trust-section nandani-trust-section-2">
            <div className="nandani-patient-trust-inner nandani-trust-inner-reverse">
              <div className="nandani-patient-trust-content">
                {renderPoints(trustPoints.slice(splitMid), splitMid)}
                {conclusion && (
                  <RichTextContent value={conclusion} className="nandani-trust-conclusion" />
                )}
              </div>
              {trustImage}
            </div>
          </section>
        </>
      ) : (
        <section className="nandani-patient-trust-section">
          <div className="nandani-patient-trust-inner">
            {trustImage}
            <div className="nandani-patient-trust-content">
              {eyebrowBlock}
              {headingBlock}
              {renderPoints(trustPoints, 0)}
              {conclusion && (
                <RichTextContent value={conclusion} className="nandani-trust-conclusion" />
              )}
            </div>
          </div>
        </section>
      )}

      <style jsx global>{`
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
          font-size: 44px;
          line-height: 1.17;
          font-weight: 400;
          color: #111111;
          margin: 0 0 34px;
        }

        .nandani-trust-blocks {
          display: grid;
          gap: 30px;
        }

        .nandani-trust-blocks article h3 {
          font-family: 'Marcellus', serif;
          font-size: 23px;
          line-height: 1.35;
          font-weight: 400;
          color: #111111;
          margin: 0 0 6px;
        }

        .nandani-trust-description,
        .nandani-trust-description :global(p),
        .nandani-trust-conclusion {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: #333333;
          margin: 0;
        }

        .nandani-trust-description :global(p),
        .nandani-trust-conclusion :global(p) {
          margin: 0 0 18px;
        }

        .nandani-trust-description :global(p:last-child),
        .nandani-trust-conclusion :global(p:last-child) {
          margin-bottom: 0;
        }

        .nandani-trust-conclusion :global(h1),
        .nandani-trust-conclusion :global(h2),
        .nandani-trust-conclusion :global(h3) {
          font-family: 'Marcellus', serif;
          font-weight: 400;
          color: #111111;
          line-height: 1.22;
          margin: 22px 0 12px;
        }

        .nandani-trust-conclusion :global(h1) {
          font-size: 32px;
        }

        .nandani-trust-conclusion :global(h2) {
          font-size: 28px;
        }

        .nandani-trust-conclusion :global(h3) {
          font-size: 23px;
          line-height: 1.35;
          margin: 26px 0 6px;
        }

        .nandani-trust-conclusion :global(ul),
        .nandani-trust-conclusion :global(ol) {
          margin: 0 0 16px 22px;
          padding: 0;
        }

        .nandani-trust-conclusion :global(li) {
          margin-bottom: 8px;
        }

        .nandani-trust-conclusion {
          border-top: 1px solid rgba(17, 17, 17, 0.14);
          margin-top: 28px;
          padding-top: 28px;
        }

        .nandani-trust-section-2 {
          padding-top: 0;
        }

        .nandani-trust-inner-reverse {
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
        }

        .nandani-trust-inner-reverse .nandani-trust-conclusion {
          border-top: none;
          margin-top: 0;
          padding-top: 0;
        }

        .nandani-trust-inner-split .nandani-patient-trust-image,
        .nandani-trust-inner-reverse .nandani-patient-trust-image {
          position: sticky;
          top: 24px;
          align-self: start;
        }

        @media (max-width: 980px) {
          .nandani-patient-trust-inner {
            grid-template-columns: 1fr;
            gap: 42px;
          }
          .nandani-trust-inner-reverse .nandani-patient-trust-image {
            order: -1;
            position: static;
          }
          .nandani-trust-inner-split .nandani-patient-trust-image {
            position: static;
          }

          .nandani-patient-trust-image,
          .nandani-patient-trust-image :global(img) {
            min-height: 420px;
          }
        }

        @media (max-width: 767px) {
          .nandani-patient-trust-content h2 {
            font-size: 26px;
            line-height: 1.25;
          }
          .nandani-trust-blocks article h3,
          .nandani-trust-conclusion :global(h3) {
            font-size: 20px;
          }
          .nandani-trust-description,
          .nandani-trust-description :global(p),
          .nandani-trust-conclusion,
          .nandani-trust-conclusion :global(p) {
            font-size: 16px;
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
