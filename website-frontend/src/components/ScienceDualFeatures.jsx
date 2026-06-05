"use client";
import React, { useEffect, useMemo, useState } from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const FALLBACK_IMAGE = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp';

const ScienceDualFeatures = ({ data: initialData = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('leftCard');

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      const updatedData = { ...data };
      let hasChanges = false;

      Object.keys(siteConfig).forEach((key) => {
        if (key.startsWith('science-dual-features.dualFeatureSection.')) {
          hasChanges = true;
          const path = key.replace('science-dual-features.dualFeatureSection.', '');
          if (path.includes('.')) {
            const [cardSide, field] = path.split('.');
            if (!updatedData[cardSide]) updatedData[cardSide] = {};
            updatedData[cardSide][field] = siteConfig[key];
          } else {
            updatedData[path] = siteConfig[key];
          }
        }
      });

      if (hasChanges) setData(updatedData);
    }
  }, [isEditMode, siteConfig]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'science-dual-features') {
        const { fieldPath, value } = e.detail;
        if (fieldPath.startsWith('dualFeatureSection.')) {
          const parts = fieldPath.split('.');
          if (parts.length === 3) {
            const [, cardSide, key] = parts;
            setData((prev) => ({
              ...prev,
              [cardSide]: { ...prev[cardSide], [key]: value }
            }));
          } else {
            setData((prev) => ({ ...prev, [parts[1]]: value }));
          }
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const left = data?.leftCard || {};
  const right = data?.rightCard || {};
  const active = activeTab === 'leftCard' ? left : right;
  const activeFieldPath = activeTab === 'leftCard'
    ? 'dualFeatureSection.leftCard'
    : 'dualFeatureSection.rightCard';

  const tabs = useMemo(() => ([
    {
      key: 'leftCard',
      title: left.title || 'A Unique Approach In Hair Transplant Surgery',
    },
    {
      key: 'rightCard',
      title: right.title || 'Why To Choose DMC-Golden Touch Technique®',
    },
  ]), [left.title, right.title]);

  const image = active.image || left.image || right.image || FALLBACK_IMAGE;
  const bullets = Array.isArray(active.bullets) ? active.bullets : [];

  return (
    <EditableSection sectionId="science-dual-features" label="Science Dual Features">
      <section className="science-tabs-section">
        <div className="science-tabs-container">
          <div className="science-tabs-nav" role="tablist" aria-label="Science content tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`science-tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
              >
                <span>{tab.title}</span>
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>

          <div className="science-tab-card">
            <div className="science-tab-image">
              {image ? (
                <img src={image} alt={String(active.title || 'Science at DMC')} />
              ) : (
                <div className="science-tab-placeholder" aria-hidden="true" />
              )}
            </div>

            <div className="science-tab-content">
              <h3>
                <EditableText sectionId="science-dual-features" fieldPath={`${activeFieldPath}.title`} tag="span">
                  {String(active.title || tabs.find((tab) => tab.key === activeTab)?.title || '')}
                </EditableText>
              </h3>

              <EditableText sectionId="science-dual-features" fieldPath={`${activeFieldPath}.description`} tag="p" className="science-tab-description">
                {String(active.description || '')}
              </EditableText>

              {bullets.length > 0 && (
                <ul className="science-tab-bullets">
                  {bullets.map((bullet, index) => (
                    <li key={`${bullet}-${index}`}>
                      <span>✓</span>
                      <p>{bullet}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .science-tabs-section {
          background: #EEF0FA;
          padding: 78px 5% 96px;
          overflow: hidden;
        }

        .science-tabs-container {
          max-width: 1320px;
          margin: 0 auto;
        }

        .science-tabs-nav {
          display: flex;
          align-items: stretch;
          gap: 30px;
          margin-bottom: 28px;
        }

        .science-tab-button {
          width: min(420px, 100%);
          min-height: 88px;
          border: 0;
          border-radius: 22px;
          background: #b8c6d7;
          color: #111111;
          padding: 16px 20px 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          font-family: 'Marcellus', serif;
          font-size: 22px;
          line-height: 1.28;
          font-weight: 400;
          text-align: left;
          cursor: pointer;
          transition: background 0.28s ease, color 0.28s ease, transform 0.28s ease;
        }

        .science-tab-button:hover {
          transform: translateY(-2px);
        }

        .science-tab-button.active {
          background: #3B5998;
          color: #ffffff;
        }

        .science-tab-button i {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.78);
          color: #111111;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-style: normal;
          flex: 0 0 auto;
        }

        .science-tab-card {
          background: #3B5998;
          border-radius: 22px;
          padding: 46px 52px;
          display: grid;
          grid-template-columns: 340px minmax(0, 1fr);
          gap: 42px;
          align-items: center;
          min-height: 430px;
        }

        .science-tab-image {
          width: 100%;
          aspect-ratio: 1 / 1.1;
          border-radius: 12px;
          overflow: hidden;
          background: #d9d9d9;
        }

        .science-tab-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .science-tab-placeholder {
          width: 100%;
          height: 100%;
          background: #d9d9d9;
        }

        .science-tab-content {
          color: #ffffff;
          animation: scienceTabFade 0.32s ease both;
        }

        @keyframes scienceTabFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .science-tab-content h3 {
          font-family: 'Marcellus', serif;
          font-size: clamp(28px, 2.4vw, 36px);
          line-height: 1.25;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 26px;
        }

        .science-tab-description {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(255,255,255,0.9);
          margin: 0 0 28px;
          white-space: pre-line;
        }

        .science-tab-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 22px;
        }

        .science-tab-bullets li {
          display: grid;
          grid-template-columns: 18px minmax(0, 1fr);
          gap: 16px;
          align-items: flex-start;
          margin: 0;
        }

        .science-tab-bullets span {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff;
          color: #3B5998;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          font-weight: 900;
          margin-top: 3px;
        }

        .science-tab-bullets p {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          line-height: 1.65;
          color: #ffffff;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .science-tabs-section {
            padding: 66px 5% 82px;
          }

          .science-tabs-nav {
            gap: 18px;
          }

          .science-tab-button {
            font-size: 18px;
            min-height: 78px;
            padding: 14px 16px 14px 22px;
          }

          .science-tab-card {
            grid-template-columns: 280px minmax(0, 1fr);
            gap: 32px;
            padding: 36px;
          }
        }

        @media (max-width: 767px) {
          .science-tabs-section {
            padding: 48px 16px 68px;
          }

          .science-tabs-nav {
            flex-direction: column;
            gap: 14px;
          }

          .science-tab-button {
            width: 100%;
            min-height: 72px;
            border-radius: 18px;
            font-size: 17px;
          }

          .science-tab-button i {
            width: 42px;
            height: 42px;
          }

          .science-tab-card {
            grid-template-columns: 1fr;
            padding: 22px;
            gap: 28px;
            border-radius: 20px;
          }

          .science-tab-image {
            aspect-ratio: 1 / 0.82;
          }

          .science-tab-content h3 {
            font-size: 26px;
          }

          .science-tab-description {
            font-size: 14px;
            line-height: 1.7;
          }

          .science-tab-bullets {
            gap: 16px;
          }

          .science-tab-bullets p {
            font-size: 14px;
          }
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceDualFeatures;
