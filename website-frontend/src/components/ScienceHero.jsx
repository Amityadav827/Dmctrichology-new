"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';

const ScienceHero = ({ data: initialData = {} }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'science-hero') {
        const { fieldPath, value } = e.detail;
        if (fieldPath.startsWith('hero.')) {
          const key = fieldPath.split('.')[1];
          setData(prev => ({ ...prev, [key]: value }));
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const bgImage = data?.bannerImage || 'https://res.cloudinary.com/dseixl6px/image/upload/v1714467794/sample.jpg';

  return (
    <EditableSection sectionId="science-hero" label="Science Hero Banner">
      <section 
        className="sci-hero-section"
        style={{ 
          minHeight: data?.bannerHeight || '60vh',
          backgroundColor: data?.backgroundColor || '#3b5998'
        }}
      >
        <div className="sci-hero-bg" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="sci-hero-overlay" style={{ opacity: data?.overlayOpacity ?? 0.55 }}></div>
        </div>

        {/* Floating Particles for premium feel */}
        <div className="sci-particle sci-p1"></div>
        <div className="sci-particle sci-p2"></div>
        <div className="sci-particle sci-p3"></div>

        <div className="sci-hero-content">
          <div className="sci-breadcrumb">
            {data?.breadcrumbText || 'Home > Science at DMC Trichology'}
          </div>
          
          <h2 className="sci-hero-eyebrow">{data?.subtitle || 'ADVANCED HAIR RESTORATION SCIENCE'}</h2>
          <h1 className="sci-hero-title">{data?.title || 'Science at DMC Trichology'}</h1>
          
          {data?.ctaLink && data?.ctaLink !== '#' && (
            <a href={data?.ctaLink} className="sci-hero-cta">
              {data?.ctaText || 'Book Consultation'}
            </a>
          )}
        </div>
      </section>

      <style>{`
        .sci-hero-section {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 80px 5%;
        }

        .sci-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
        }

        .sci-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0d0d1a 0%, #3b5998 100%);
          mix-blend-mode: multiply;
        }

        .sci-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          animation: float 10s infinite ease-in-out alternate;
          z-index: 1;
        }

        .sci-p1 { width: 300px; height: 300px; top: -100px; left: -100px; }
        .sci-p2 { width: 200px; height: 200px; bottom: -50px; right: -50px; animation-delay: -3s; }
        .sci-p3 { width: 150px; height: 150px; top: 30%; right: 20%; animation-delay: -6s; background: rgba(255,255,255,0.05); }

        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.05); }
        }

        .sci-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          color: white;
          animation: sciFadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes sciFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sci-breadcrumb {
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 30px;
        }

        .sci-hero-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #8bb4f6; /* Soft blue glow */
          margin-bottom: 20px;
        }

        .sci-hero-title {
          font-family: 'Marcellus', serif !important;
          font-size: 64px !important;
          font-weight: 400;
          line-height: 1.1 !important;
          margin-bottom: 40px !important;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .sci-hero-cta {
          display: inline-block;
          padding: 16px 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-radius: 100px;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .sci-hero-cta:hover {
          background: white;
          color: #3b5998;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          .sci-hero-title { font-size: 42px !important; }
          .sci-hero-eyebrow { font-size: 12px; }
          .sci-hero-section { padding: 120px 20px 80px; }
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceHero;
