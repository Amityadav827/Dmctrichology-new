"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const VirtualTourHero = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = React.useState(initialData || {});

  React.useEffect(() => {
    if (isEditMode && siteConfig) {
      const updatedData = { ...data };
      let hasChanges = false;

      Object.keys(siteConfig).forEach((key) => {
        if (key.startsWith('virtual-tour-hero.hero.')) {
          hasChanges = true;
          const field = key.replace('virtual-tour-hero.hero.', '');
          updatedData[field] = siteConfig[key];
        }
      });

      if (hasChanges) setData(updatedData);
    }
  }, [isEditMode, siteConfig]);

  React.useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'virtual-tour-hero') {
        const { fieldPath, value } = e.detail;
        setData((prev) => {
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
    title = 'Virtual Tour',
    breadcrumbText = 'Virtual Tour',
  } = data || {};

  return (
    <>
      <EditableSection sectionId="virtual-tour-hero" label="Virtual Tour Hero Banner">
        <section className="vt-page-hero">
          <div className="vt-page-hero-inner">
            <h1>
              <EditableText sectionId="virtual-tour-hero" fieldPath="hero.title">
                {String(title || 'Virtual Tour')}
              </EditableText>
            </h1>

            <div className="vt-page-breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <span>
                <EditableText sectionId="virtual-tour-hero" fieldPath="hero.breadcrumbText">
                  {String(breadcrumbText || 'Virtual Tour')}
                </EditableText>
              </span>
            </div>
          </div>
        </section>
      </EditableSection>

      <style>{`
        .vt-page-hero {
          width: 100%;
          margin-top: 0;
          padding: 80px 5% 60px;
          background: #EEF0FA;
          box-sizing: border-box;
        }

        .vt-page-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          margin-top: 110px;
        }

        .vt-page-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 46px);
          line-height: 1.18;
          font-weight: 400;
          color: #111111;
          margin: 0 0 18px;
        }

        .vt-page-breadcrumb {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #111111;
        }

        .vt-page-breadcrumb a {
          color: #111111;
          text-decoration: none;
        }

        .vt-page-breadcrumb span {
          display: inline-flex;
        }

        @media (max-width: 767px) {
          .vt-page-hero {
            margin-top: 0;
            padding: 30px 16px 42px;
          }

          .vt-page-hero-inner {
            margin-top: 100px;
          }

          .vt-page-hero h1 {
            font-size: 30px;
            margin-bottom: 12px;
          }

          .vt-page-breadcrumb {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default VirtualTourHero;
