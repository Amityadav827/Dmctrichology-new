"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const PressMediaHero = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = React.useState(initialData || {});

  React.useEffect(() => {
    if (isEditMode && siteConfig) {
      const updatedData = { ...data };
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('press-media-hero.hero.')) {
          hasChanges = true;
          const field = key.replace('press-media-hero.hero.', '');
          updatedData[field] = siteConfig[key];
        }
      });

      if (hasChanges) setData(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, siteConfig]);

  React.useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'press-media-hero') {
        const { fieldPath, value } = e.detail;
        setData(prev => {
          const next = { ...prev };
          const field = fieldPath.replace('hero.', '');
          next[field] = value;
          return next;
        });
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const {
    title = 'Press & Media',
    breadcrumbText = 'Press & Media',
  } = data || {};

  return (
    <>
      <EditableSection sectionId="press-media-hero" label="Press Media Hero Banner">
        <section className="pm-hero-banner">
          <div className="pm-hero-content">
            <h1 className="pm-hero-title">
              <EditableText sectionId="press-media-hero" fieldPath="hero.title">
                {String(title || 'Press & Media')}
              </EditableText>
            </h1>

            <div className="pm-hero-breadcrumb">
              <a href="/" className="pm-bc-home">Home</a>
              <span className="pm-bc-sep">/</span>
              <span className="pm-bc-current">
                <EditableText sectionId="press-media-hero" fieldPath="hero.breadcrumbText">
                  {String(breadcrumbText || 'Press & Media')}
                </EditableText>
              </span>
            </div>
          </div>
        </section>
      </EditableSection>

      <style>{`
        .pm-hero-banner {
          width: 100%;
          margin-top: 112px;
          padding: 80px 5% 60px;
          background: #EEF0FA;
          box-sizing: border-box;
          text-align: center;
        }

        .pm-hero-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .pm-hero-title {
          font-family: 'Marcellus', serif !important;
          font-size: clamp(34px, 3.4vw, 46px) !important;
          line-height: 1.18 !important;
          font-weight: 400 !important;
          color: #111111 !important;
          margin: 0 0 20px !important;
          letter-spacing: 0 !important;
          text-shadow: none !important;
        }

        .pm-hero-breadcrumb {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          line-height: 1.4;
          color: #111111;
        }

        .pm-bc-home {
          color: #111111;
          text-decoration: none;
        }

        .pm-bc-current,
        .pm-bc-sep {
          color: #111111;
        }

        @media (max-width: 1024px) {
          .pm-hero-banner {
            margin-top: 104px;
            padding: 70px 5% 52px;
          }
        }

        @media (max-width: 767px) {
          .pm-hero-banner {
            margin-top: 0;
            padding: 156px 16px 42px;
          }

          .pm-hero-title {
            font-size: clamp(30px, 8vw, 38px) !important;
          }
        }
      `}</style>
    </>
  );
};

export default PressMediaHero;
