"use client";
import React, { useState, useEffect } from 'react';
import EditableSection from './Editable/EditableSection';

const ScienceDualFeatures = ({ data: initialData = {} }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'science-dual-features') {
        const { fieldPath, value } = e.detail;
        if (fieldPath.startsWith('dualFeatureSection.')) {
          // Can be dualFeatureSection.leftCard.title etc
          const parts = fieldPath.split('.');
          if (parts.length === 3) {
            const [_, cardSide, key] = parts;
            setData(prev => ({
              ...prev,
              [cardSide]: { ...prev[cardSide], [key]: value }
            }));
          } else {
             setData(prev => ({ ...prev, [parts[1]]: value }));
          }
        }
      }
    };
    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  const left = data?.leftCard || {};
  const right = data?.rightCard || {};

  return (
    <EditableSection sectionId="science-dual-features" label="Science Dual Features">
      <section className="sci-dual-section">
        <div className="sci-dual-container">
          
          <div className="sci-dual-card">
             {left.image && <div className="sci-dual-img" style={{ backgroundImage: `url(${left.image})` }}></div>}
             <div className="sci-dual-content">
               <h3 className="sci-dual-title">{left.title || 'Advanced Diagnostics'}</h3>
               <p className="sci-dual-desc">{left.description || 'We utilize state-of-the-art diagnostic tools to understand the root cause of your hair loss.'}</p>
               <ul className="sci-dual-list">
                 {(left.bullets || []).map((bullet, i) => (
                   <li key={i}>{bullet}</li>
                 ))}
               </ul>
             </div>
          </div>

          <div className="sci-dual-card sci-dual-right">
             {right.image && <div className="sci-dual-img" style={{ backgroundImage: `url(${right.image})` }}></div>}
             <div className="sci-dual-content">
               <h3 className="sci-dual-title">{right.title || 'Precision Treatment'}</h3>
               <p className="sci-dual-desc">{right.description || 'Our treatments are tailored to your unique genetic and physiological profile for optimal results.'}</p>
               <ul className="sci-dual-list">
                 {(right.bullets || []).map((bullet, i) => (
                   <li key={i}>{bullet}</li>
                 ))}
               </ul>
             </div>
          </div>

        </div>
      </section>

      <style>{`
        .sci-dual-section {
          padding: 80px 5% 120px;
          background: #ffffff;
        }

        .sci-dual-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .sci-dual-card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          display: flex;
          flex-direction: column;
        }

        .sci-dual-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(59, 89, 152, 0.1);
        }

        .sci-dual-img {
          height: 240px;
          background-size: cover;
          background-position: center;
          background-color: #f8fafc; /* placeholder color */
        }

        .sci-dual-content {
          padding: 40px;
          flex-grow: 1;
        }

        .sci-dual-title {
          font-family: 'Marcellus', serif !important;
          font-size: 28px !important;
          color: #1a2740 !important;
          margin: 0 0 16px !important;
        }

        .sci-dual-desc {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #64748b;
          margin: 0 0 24px;
        }

        .sci-dual-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sci-dual-list li {
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          color: #475569;
          margin-bottom: 12px;
          position: relative;
          padding-left: 24px;
        }

        .sci-dual-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 0;
          color: #3b5998;
          font-weight: bold;
        }

        @media (max-width: 900px) {
          .sci-dual-container { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .sci-dual-content { padding: 30px 20px; }
          .sci-dual-img { height: 200px; }
          .sci-dual-section { padding: 60px 5% 80px; }
        }
      `}</style>
    </EditableSection>
  );
};

export default ScienceDualFeatures;
