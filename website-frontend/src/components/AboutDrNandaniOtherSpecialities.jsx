"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function AboutDrNandaniOtherSpecialities({ data = {} }) {
  const {
    heading = "Other Specialities",
    introParagraph = "Apart from being a leading expert in Trichological Sciences, Dr. Nandini Dadu is also a diligent specialist in cosmetology, performing a number of cosmetic procedures such as :",
    specialitiesList = [
      { title: "Skin Laser Treatments," },
      { title: "Implantations," },
      { title: "Collagen & other Injectable Wrinkle Fillers.etc." }
    ],
    conclusionParagraph = "For more information contact the **best hair specialist in Delhi** at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi).",
    image = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp",
    imageAlt = "Other Specialities"
  } = data;

  const renderFormattedText = (text) => {
    if (!text) return "";
    const processed = String(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/<strong>(.*?)<\/strong>/g, '<strong>$1</strong>');

    return <span dangerouslySetInnerHTML={{ __html: processed }} />;
  };

  return (
    <EditableSection sectionId="about-nandani-other-specialities" label="Other Specialities Section">
      <section className="dr-nandani-other-specialities-wrapper">
        <div className="dr-nandani-other-specialities-card">
          <div className="dr-nandani-other-image-card">
            <img
              src={image || "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp"}
              alt={imageAlt || "Other Specialities"}
            />
          </div>

          <div className="dr-nandani-other-content">
            <div className="dr-nandani-other-icon" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M12 20V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M12 12C8.9 11.4 7 9.4 6.2 6.2c3.2.4 5.1 2.2 5.8 5.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M12 14c3.2-.6 5.1-2.6 5.8-5.8-3.2.4-5.1 2.2-5.8 5.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>

            <h2>
              <EditableText sectionId="about-nandani-other-specialities" fieldPath="otherSpecialitiesSection.heading">
                {heading}
              </EditableText>
            </h2>

            <p className="dr-nandani-other-intro">
              <EditableText sectionId="about-nandani-other-specialities" fieldPath="otherSpecialitiesSection.introParagraph">
                {renderFormattedText(introParagraph)}
              </EditableText>
            </p>

            <div className="dr-nandani-other-list">
              {specialitiesList.map((bullet, idx) => (
                <div className="dr-nandani-other-list-item" key={`${bullet.title}-${idx}`}>
                  <span aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24">
                      <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p>
                    <EditableText sectionId="about-nandani-other-specialities" fieldPath={`otherSpecialitiesSection.specialitiesList.${idx}.title`}>
                      {bullet.title}
                    </EditableText>
                  </p>
                </div>
              ))}
            </div>

            <p className="dr-nandani-other-conclusion">
              <EditableText sectionId="about-nandani-other-specialities" fieldPath="otherSpecialitiesSection.conclusionParagraph">
                {renderFormattedText(conclusionParagraph)}
              </EditableText>
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dr-nandani-other-specialities-wrapper {
          width: 100%;
          padding: 0 24px;
          background: #ffffff;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
        }
        .dr-nandani-other-specialities-card {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
          border-radius: 24px;
          background: #EEF0FA;
          display: grid;
          grid-template-columns: minmax(260px, 0.35fr) minmax(0, 0.65fr);
          gap: 32px;
          align-items: center;
          box-sizing: border-box;
        }
        .dr-nandani-other-image-card {
          width: 100%;
          height: 100%;
          min-height: 346px;
          border-radius: 20px;
          overflow: hidden;
          background: #d9d9d9;
        }
        .dr-nandani-other-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .dr-nandani-other-content {
          padding: 8px 0;
        }
        .dr-nandani-other-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #3B5998;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .dr-nandani-other-content h2 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3vw, 44px);
          line-height: 1.08;
          font-weight: 400;
          color: #111111;
          margin: 0 0 18px;
        }
        .dr-nandani-other-intro,
        .dr-nandani-other-conclusion {
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.7;
          color: #2b2b2b;
          margin: 0;
          max-width: 760px;
        }
        .dr-nandani-other-list {
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin: 24px 0 26px;
        }
        .dr-nandani-other-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dr-nandani-other-list-item span {
          width: 18px;
          height: 18px;
          flex: 0 0 18px;
          border-radius: 50%;
          background: #3B5998;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .dr-nandani-other-list-item p {
          margin: 0;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.4;
          color: #111111;
        }
        .dr-nandani-other-conclusion strong {
          font-weight: 700;
        }
        @media (max-width: 1024px) {
          .dr-nandani-other-specialities-card {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .dr-nandani-other-image-card {
            min-height: 420px;
          }
        }
        @media (max-width: 767px) {
          .dr-nandani-other-specialities-wrapper {
            padding: 52px 16px;
          }
          .dr-nandani-other-specialities-card {
            padding: 24px;
            border-radius: 24px;
          }
          .dr-nandani-other-image-card {
            min-height: auto;
            aspect-ratio: 1 / 1.08;
          }
          .dr-nandani-other-icon {
            width: 52px;
            height: 52px;
            margin-bottom: 16px;
          }
          .dr-nandani-other-content h2 {
            font-size: clamp(30px, 9vw, 38px);
          }
          .dr-nandani-other-intro,
          .dr-nandani-other-conclusion,
          .dr-nandani-other-list-item p {
            font-size: 13px;
          }
        }
      `}</style>
    </EditableSection>
  );
}
