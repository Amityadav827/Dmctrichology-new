"use client";
import React, { useEffect, useState } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const ScienceIntro = ({ data: initialData = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      const updatedData = { ...data };
      let hasChanges = false;

      Object.keys(siteConfig).forEach((key) => {
        if (key.startsWith('science-intro.introSection.')) {
          hasChanges = true;
          const field = key.replace('science-intro.introSection.', '');
          updatedData[field] = siteConfig[key];
        }
      });

      if (hasChanges) setData(updatedData);
    }
  }, [isEditMode, siteConfig]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'science-intro') {
        const { fieldPath, value } = e.detail;
        if (fieldPath.startsWith('introSection.')) {
          const key = fieldPath.split('.')[1];
          setData((prev) => ({ ...prev, [key]: value }));
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const image = data?.image || data?.introImage || data?.backgroundImage || '';

  return (
    <EditableSection sectionId="science-intro" label="Science Intro Section">
      <section className="science-intro-section">
        <div className="science-intro-container">
          <div className="science-intro-content">
            <h2>
              <EditableText sectionId="science-intro" fieldPath="introSection.heading" tag="span">
                {String(data?.heading || 'Golden Touch Technique® Hair Transplantation')}
              </EditableText>
            </h2>

            <EditableText sectionId="science-intro" fieldPath="introSection.description" tag="p" className="science-intro-description">
              {String(data?.description || 'DMC-GOLDEN TOUCH TECHNIQUE® is a highly advanced hair transplant procedure exclusively curated in-house to deliver natural finished results.')}
            </EditableText>
          </div>

          <div className="science-intro-image-wrap">
            {image ? (
              <img src={image} alt={String(data?.heading || 'Science At DMC Trichology')} />
            ) : (
              <div className="science-intro-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>
      </section>

      <style>{`
        .science-intro-section {
          background: #ffffff;
          padding: 112px 5% 118px;
          overflow: hidden;
        }

        .science-intro-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(420px, 0.82fr);
          gap: 78px;
          align-items: center;
        }

        .science-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0;
          margin-bottom: 34px;
        }

        .science-eyebrow span {
          width: 92px;
          height: 1px;
          background: rgba(59, 89, 152, 0.55);
        }

        .science-eyebrow i {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3B5998;
          display: inline-block;
          margin-right: 12px;
        }

        .science-eyebrow p {
          margin: 0;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          line-height: 1;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          color: #333333;
        }

        .science-intro-content h2 {
          font-family: 'Marcellus', serif;
          font-size: 44px;
          line-height: 1.2;
          font-weight: 400;
          color: #222222;
          margin: 0 0 34px;
          max-width: 760px;
        }

        .science-intro-description {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.9;
          color: #444444;
          margin: 0;
          max-width: 760px;
          white-space: pre-line;
        }

        .science-intro-image-wrap {
          width: 100%;
          min-height: 520px;
          border-radius: 32px;
          overflow: hidden;
          background: #d9d9d9;
        }

        .science-intro-image-wrap img {
          width: 100%;
          height: 100%;
          min-height: 520px;
          object-fit: cover;
          display: block;
        }

        .science-intro-placeholder {
          width: 100%;
          min-height: 520px;
          background: #d9d9d9;
        }

        @media (max-width: 1024px) {
          .science-intro-section {
            padding: 82px 5% 90px;
          }

          .science-intro-container {
            grid-template-columns: 1fr;
            gap: 46px;
          }

          .science-intro-image-wrap {
            order: -1;
            min-height: 420px;
          }

          .science-intro-image-wrap img,
          .science-intro-placeholder {
            min-height: 420px;
          }
        }

        @media (max-width: 640px) {
          .science-intro-section {
            padding: 58px 16px 66px;
          }

          .science-intro-container {
            gap: 34px;
          }

          .science-eyebrow {
            margin-bottom: 22px;
          }

          .science-eyebrow span {
            width: 46px;
          }

          .science-eyebrow p {
            font-size: 9px;
          }

          .science-intro-content h2 {
            font-size: 34px;
            margin-bottom: 22px;
          }

          .science-intro-description {
            font-size: 15px;
            line-height: 1.8;
          }

          .science-intro-image-wrap,
          .science-intro-image-wrap img,
          .science-intro-placeholder {
            min-height: 300px;
            border-radius: 24px;
          }
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceIntro;
