"use client";
import React, { useEffect, useState } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const ScienceHero = ({ data: initialData = {} }) => {
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
        if (key.startsWith('science-hero.hero.')) {
          hasChanges = true;
          const field = key.replace('science-hero.hero.', '');
          updatedData[field] = siteConfig[key];
        }
      });

      if (hasChanges) setData(updatedData);
    }
  }, [isEditMode, siteConfig]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'science-hero') {
        const { fieldPath, value } = e.detail;
        if (fieldPath.startsWith('hero.')) {
          const key = fieldPath.split('.')[1];
          setData((prev) => ({ ...prev, [key]: value }));
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  return (
    <EditableSection sectionId="science-hero" label="Science Hero Banner">
      <section className="science-page-hero">
        <div className="science-page-hero-inner">
          <h1>
            <EditableText sectionId="science-hero" fieldPath="hero.title" tag="span">
              {String(data?.title || 'Science At DMC Trichology')}
            </EditableText>
          </h1>

          <div className="science-page-breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>
              <EditableText sectionId="science-hero" fieldPath="hero.breadcrumbText" tag="span">
                {String(data?.breadcrumbText || 'Science At DMC Trichology')}
              </EditableText>
            </span>
          </div>
        </div>
      </section>

      <style>{`
        .science-page-hero {
          width: 100%;
          margin-top: 0;
          padding: 80px 5% 60px;
          background: #EEF0FA;
          box-sizing: border-box;
        }

        .science-page-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          margin-top: 110px;
        }

        .science-page-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 46px);
          line-height: 1.18;
          font-weight: 400;
          color: #111111;
          margin: 0 0 18px;
        }

        .science-page-breadcrumb {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #111111;
        }

        .science-page-breadcrumb a {
          color: #111111;
          text-decoration: none;
        }

        .science-page-breadcrumb span {
          display: inline-flex;
        }

        @media (max-width: 767px) {
          .science-page-hero {
            margin-top: 0;
            padding: 30px 16px 42px;
          }

          .science-page-hero-inner {
            margin-top: 100px;
          }

          .science-page-hero h1 {
            font-size: 30px;
            margin-bottom: 12px;
          }

          .science-page-breadcrumb {
            font-size: 12px;
          }
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceHero;
