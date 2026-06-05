"use client";
import React, { useState, useEffect } from 'react';
import { fetchHomeFAQ } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const blueIconFilter = 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)';

export default function FaqSection({ initialData = null }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState(initialData?.categories?.[0]?.title || '');

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      if (initialData.categories?.length > 0) {
        setActiveTab(initialData.categories[0].title);
      }
      return;
    }

    const loadData = async () => {
      const res = await fetchHomeFAQ();
      if (res?.success) {
        setData(res.data);
        if (res.data.categories?.length > 0) {
          setActiveTab(res.data.categories[0].title);
        }
      }
    };
    loadData();

    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'faq-section') {
        const { fieldPath, value } = e.detail;
        setData(prev => {
          if (!prev) return prev;
          const newData = { ...prev };
          if (fieldPath.includes('.')) {
            const parts = fieldPath.split('.');
            let curr = newData;
            for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]];
            curr[parts[parts.length - 1]] = value;
          } else {
            newData[fieldPath] = value;
          }
          return newData;
        });
      }
    };

    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, [initialData]);

  if (!data?.enabled && data !== null) return null;

  const badgeText = data?.badgeText || "TRUSTED CARE SERVICES";
  const heading = data?.heading || "Frequently Asked Question?";
  const categories = data?.categories || [];
  const activeCategory = categories.find(c => c.title === activeTab) || categories[0];
  const buttonText = data?.buttonText || "View All Questions";

  return (
    <EditableSection sectionId="faq-section" label="Frequently Asked Question?">
      <section style={{ padding: '80px 5%', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          {/* Header Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '30px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto', filter: blueIconFilter }} />
                <EditableText sectionId="faq-section" fieldPath="badgeText" tag="span" className="section-subtitle">
                  {badgeText}
                </EditableText>
              </div>
              <h2 className="section-title">
                <EditableText sectionId="faq-section" fieldPath="heading" tag="span">
                  {heading}
                </EditableText>
              </h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', backgroundColor: '#fff', border: '1px solid #E5E5E5', borderRadius: '50px', padding: '5px', gap: '5px' }}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(cat.title)}
                  style={{
                    padding: '12px 25px',
                    borderRadius: '50px',
                    border: 'none',
                    backgroundColor: activeTab === cat.title ? '#3B5998' : 'transparent',
                    color: activeTab === cat.title ? '#fff' : '#000',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Marcellus', serif"
                  }}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
            {(activeCategory?.faqs || []).map((faq, index) => {
              const catIndex = categories.indexOf(activeCategory);
              const isFirstFaqCard = index === 0;
              const isFirstRightFaqCard = index === 1;
              const isSecondLeftFaqCard = index === 2;
              const isSecondRightFaqCard = index === 3;
              const isThirdLeftFaqCard = index === 4;
              const isThirdRightFaqCard = index === 5;
              const iconSrc = isFirstFaqCard
                ? '/icons/faq-first-icon.svg'
                : isFirstRightFaqCard
                  ? '/icons/faq-first-right-icon.svg'
                : isSecondLeftFaqCard
                  ? '/icons/faq-second-left-icon.svg'
                  : isSecondRightFaqCard
                    ? '/icons/faq-second-right-icon.svg'
                  : isThirdLeftFaqCard
                    ? '/icons/faq-third-left-icon.svg'
                  : isThirdRightFaqCard
                    ? '/icons/faq-third-right-icon.svg'
                  : faq.icon;
              return (
                <div
                  key={index}
                  className="faq-card"
                  style={{
                    backgroundColor: '#E8EAF6',
                    borderRadius: '40px',
                    padding: '20px',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    border: '1px solid #4D4D4D',
                    transition: 'all 0.3s ease',
                    minHeight: '120px'
                  }}
                >
                  <div className="faq-icon-circle" style={{ flexShrink: 0 }}>
                    <img 
                      className={`faq-icon-img ${isFirstFaqCard ? 'faq-first-icon-img' : ''} ${isFirstRightFaqCard ? 'faq-first-right-icon-img' : ''} ${isSecondLeftFaqCard ? 'faq-second-left-icon-img' : ''} ${isSecondRightFaqCard ? 'faq-second-right-icon-img' : ''} ${isThirdLeftFaqCard ? 'faq-third-left-icon-img' : ''} ${isThirdRightFaqCard ? 'faq-third-right-icon-img' : ''}`}
                      src={iconSrc} 
                      alt="icon" 
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px', color: '#000000', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '10px', lineHeight: '1.3' }}>
                      <EditableText sectionId="faq-section" fieldPath={`categories.${catIndex}.faqs.${index}.question`} tag="span">
                        {faq.question}
                      </EditableText>
                    </h3>
                    <p style={{ fontSize: '14px', color: '#000000', fontFamily: "'Marcellus', serif", lineHeight: '1.6' }}>
                      <EditableText sectionId="faq-section" fieldPath={`categories.${catIndex}.faqs.${index}.answer`} tag="span">
                        {faq.answer}
                      </EditableText>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <a href="/faqs" className="view-all-faq-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '10px 10px 10px 28px', borderRadius: '50px', border: '1px solid #E5E5E5', backgroundColor: '#fff', color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '600', fontFamily: "'Marcellus', serif" }}>
              <EditableText sectionId="faq-section" fieldPath="buttonText" tag="span">
                {buttonText}
              </EditableText>
              <span className="faq-btn-arrow-wrap">
                <img src="/icons/faq-view-all-icon.svg" className="faq-btn-arrow" alt="arrow" style={{ width: '12px', height: '9px' }} />
              </span>
            </a>
          </div>
        </div>

        <style jsx>{`
          .faq-card:hover {
            background-color: #3B5998 !important;
            border-color: #4D4D4D !important;
            color: #fff;
            transform: none;
            box-shadow: 0 15px 30px rgba(59,89,152,0.18);
          }

          .faq-card:hover h3,
          .faq-card:hover p {
            color: #fff !important;
          }

          .faq-icon-circle {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background-color: #3B5998;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
          }

          .faq-icon-img {
            transition: none;
            filter: brightness(0) invert(1);
          }

          .faq-card:hover .faq-icon-circle {
            background-color: #fff;
          }

          .faq-card:hover .faq-first-icon-img,
          .faq-card:hover .faq-first-right-icon-img,
          .faq-card:hover .faq-second-left-icon-img,
          .faq-card:hover .faq-second-right-icon-img,
          .faq-card:hover .faq-third-left-icon-img,
          .faq-card:hover .faq-third-right-icon-img {
            filter: brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%);
          }

          .faq-first-icon-img {
            width: 32px !important;
            height: 29px !important;
          }

          .faq-second-left-icon-img {
            width: 28px !important;
            height: 33px !important;
          }

          .faq-third-left-icon-img {
            width: 26px !important;
            height: 35px !important;
          }

          .faq-first-right-icon-img {
            width: 25px !important;
            height: 36px !important;
          }

          .faq-second-right-icon-img {
            width: 28px !important;
            height: 35px !important;
            filter: brightness(0) invert(1);
          }

          .faq-card:hover .faq-second-right-icon-img {
            filter: brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%);
          }

          .faq-third-right-icon-img {
            width: 28px !important;
            height: 35px !important;
          }

          .view-all-faq-btn {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          }

          .view-all-faq-btn:hover {
            background-color: #3B5998 !important;
            color: #fff !important;
            border-color: #3B5998 !important;
            box-shadow: 0 12px 24px rgba(59,89,152,0.18);
          }

          .faq-btn-arrow-wrap {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #3B5998;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-45deg);
            transition: transform 0.3s ease, background-color 0.3s ease;
          }

          .view-all-faq-btn:hover .faq-btn-arrow-wrap {
            background-color: #fff;
            transform: rotate(0deg);
          }

          .view-all-faq-btn:hover .faq-btn-arrow {
            filter: brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%);
          }

          @media (max-width: 1199px) {
            section {
              padding: 64px 4% !important;
              overflow: hidden;
            }
            section .section-title {
              font-size: clamp(34px, 5vw, 48px) !important;
              line-height: 1.1 !important;
            }
            div[style*="gridTemplateColumns"] {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            div[style*="border-radius: 50px"] {
              max-width: 100%;
              overflow-x: auto;
            }
          }
          @media (max-width: 768px) {
            section {
              padding: 48px 16px !important;
            }
            section > div > div:first-child {
              margin-bottom: 34px !important;
            }
            section .section-title {
              font-size: clamp(30px, 8.5vw, 40px) !important;
            }
            .faq-grid {
              grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)) !important;
            }
            .faq-card {
              flex-direction: column;
              align-items: flex-start !important;
              border-radius: 24px !important;
              padding: 20px !important;
              gap: 14px !important;
            }
            .faq-card h3 {
              font-size: 20px !important;
            }
            .view-all-faq-btn {
              width: 100%;
              justify-content: center;
            }
          }
          @media (max-width: 390px) {
            .faq-card h3 {
              font-size: 18px !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
