"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const PressMediaHero = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = React.useState(initialData || {});

  // Real-time sync from Visual Builder (postMessage UPDATE_CONFIG)
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

  // Sync when initial server data changes
  React.useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  // Real-time sync from cms-update custom events (e.g. PressMediaSection on home)
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
    backgroundColor = '#3b5998',
    overlayOpacity = 0.55,
    bannerHeight = '420px',
    bannerImage = '',
  } = data || {};

  return (
    <>
      <EditableSection sectionId="press-media-hero" label="Press Media Hero Banner">
        <section
          className="pm-hero-banner"
          style={{
            minHeight: bannerHeight,
            backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
          }}
        >
          {/* Gradient overlay */}
          <div
            className="pm-hero-overlay"
            style={{ opacity: overlayOpacity }}
          />

          {/* Floating particles */}
          <div className="pm-hero-particles" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`pm-particle pm-particle-${i + 1}`} />
            ))}
          </div>

          {/* Content */}
          <div className="pm-hero-content max-w-[1400px] mx-auto w-full">
            <div className="pm-hero-badge">Press &amp; Media Coverage</div>

            <h1 className="pm-hero-title">
              <EditableText sectionId="press-media-hero" fieldPath="hero.title">
                {String(title || '')}
              </EditableText>
            </h1>

            <div className="pm-hero-breadcrumb">
              <a href="/" className="pm-bc-home">Home</a>
              <span className="pm-bc-sep" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="pm-bc-current">
                <EditableText sectionId="press-media-hero" fieldPath="hero.breadcrumbText">
                  {String(breadcrumbText || '')}
                </EditableText>
              </span>
            </div>
          </div>
        </section>
      </EditableSection>

      <style>{`
        .pm-hero-banner {
          background-color: ${backgroundColor};
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 170px 5% 100px;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: pmHeroBannerIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes pmHeroBannerIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pm-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0,0,0,0.6) 0%,
            ${backgroundColor}CC 50%,
            rgba(0,0,0,0.3) 100%
          );
          z-index: 1;
        }

        /* Animated floating particles */
        .pm-hero-particles {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .pm-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          animation: pmFloat linear infinite;
        }

        .pm-particle-1 { width: 80px; height: 80px; top: 10%; left: 8%;  animation-duration: 14s; animation-delay: 0s; }
        .pm-particle-2 { width: 50px; height: 50px; top: 60%; left: 12%; animation-duration: 18s; animation-delay: 2s; }
        .pm-particle-3 { width: 120px; height: 120px; top: 5%;  right: 10%; animation-duration: 22s; animation-delay: 1s; }
        .pm-particle-4 { width: 40px; height: 40px; top: 75%; right: 15%; animation-duration: 16s; animation-delay: 3s; }
        .pm-particle-5 { width: 70px; height: 70px; top: 30%; left: 50%; animation-duration: 20s; animation-delay: 0.5s; }
        .pm-particle-6 { width: 30px; height: 30px; top: 85%; left: 40%; animation-duration: 12s; animation-delay: 4s; }
        .pm-particle-7 { width: 90px; height: 90px; top: 20%; right: 35%; animation-duration: 25s; animation-delay: 1.5s; }
        .pm-particle-8 { width: 55px; height: 55px; top: 50%; right: 5%;  animation-duration: 17s; animation-delay: 2.5s; }

        @keyframes pmFloat {
          0%   { transform: translateY(0)    rotate(0deg);   opacity: 0.6; }
          33%  { transform: translateY(-30px) rotate(120deg); opacity: 0.3; }
          66%  { transform: translateY(20px)  rotate(240deg); opacity: 0.5; }
          100% { transform: translateY(0)    rotate(360deg); opacity: 0.6; }
        }

        /* Content sits above overlay + particles */
        .pm-hero-content {
          position: relative;
          z-index: 3;
          animation: pmContentFadeIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }

        @keyframes pmContentFadeIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Premium badge */
        .pm-hero-badge {
          display: inline-block;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 100px;
          padding: 6px 20px;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.08);
        }

        .pm-hero-title {
          font-family: 'Marcellus', serif !important;
          font-size: 60px !important;
          font-weight: 400 !important;
          color: #ffffff !important;
          margin: 0 0 20px !important;
          letter-spacing: 1px !important;
          line-height: 1.15 !important;
          text-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        .pm-hero-breadcrumb {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Marcellus', serif;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }

        .pm-bc-home {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .pm-bc-home:hover { color: #ffffff; }

        .pm-bc-sep {
          color: rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
        }

        .pm-bc-current { color: #ffffff; font-weight: 400; }

        @media (max-width: 768px) {
          .pm-hero-banner { padding: 140px 5% 80px; min-height: 320px !important; }
          .pm-hero-title { font-size: 40px !important; }
          .pm-particle-3, .pm-particle-7 { display: none; }
        }

        @media (max-width: 480px) {
          .pm-hero-title { font-size: 32px !important; }
          .pm-hero-badge { font-size: 10px; }
        }
      `}</style>
    </>
  );
};

export default PressMediaHero;
