"use client";
import React, { useState, useEffect } from 'react';
import { fetchHomeFAQ } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function FaqSection() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [activeFaqId, setActiveFaqId] = useState(null);

  useEffect(() => {
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
  }, []);

  if (!data?.enabled && data !== null) return null;

  const badgeText = data?.badgeText || "TRUSTED CARE SERVICES";
  const heading = data?.heading || "Frequently Asked Question?";
  const categories = data?.categories || [];
  const activeCategory = categories.find(c => c.title === activeTab) || categories[0];
  const buttonText = data?.buttonText || "View All Questions";
  const buttonLink = data?.buttonLink || "#";

  return (
    <EditableSection sectionId="faq-section" label="Frequently Asked Question?">
      <section style={{ padding: '80px 5%', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          {/* Header Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '30px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" alt="icon" style={{ width: '40px', height: 'auto' }} />
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
                    backgroundColor: activeTab === cat.title ? '#000' : 'transparent',
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
            {(activeCategory?.faqs || []).map((faq, index) => {
              const catIndex = categories.indexOf(activeCategory);
              const isActive = activeFaqId === `${catIndex}-${index}`;
              return (
                <div
                  key={index}
                  onClick={() => setActiveFaqId(`${catIndex}-${index}`)}
                  className={`faq-card ${isActive ? 'active' : ''}`}
                  style={{
                    backgroundColor: isActive ? '#000' : '#F9F7F2',
                    borderRadius: '40px',
                    padding: '20px',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    border: '1px solid #4D4D4D',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    minHeight: '120px'
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <img 
                      src={faq.icon} 
                      alt="FAQ Icon" 
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        transition: 'transform 0.3s ease',
                        filter: isActive ? 'brightness(0) invert(1)' : 'none'
                      }} 
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '22px', color: isActive ? '#fff' : '#333', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '10px', lineHeight: '1.3' }}>
                      <EditableText sectionId="faq-section" fieldPath={`categories.${catIndex}.faqs.${index}.question`} tag="span">
                        {faq.question}
                      </EditableText>
                    </h3>
                    <p style={{ fontSize: '14px', color: isActive ? 'rgba(255,255,255,0.8)' : '#666', fontFamily: "'Marcellus', serif", lineHeight: '1.6' }}>
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
            <button className="view-all-faq-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 30px', borderRadius: '50px', border: '1px solid #E5E5E5', backgroundColor: '#fff', color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '600', fontFamily: "'Marcellus', serif" }}>
              <EditableText sectionId="faq-section" fieldPath="buttonText" tag="span">
                {buttonText}
              </EditableText>
              <img src="https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/dh9kblxoinqmi5kvoona.png" className="btn-arrow" alt="arrow" style={{ width: '32px', height: '32px' }} />
            </button>
          </div>
        </div>

        <style jsx>{`
          .faq-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #000 !important; }
          .view-all-faq-btn:hover { background-color: #000 !important; color: #fff !important; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
          .view-all-faq-btn:hover .btn-arrow { transform: translateX(8px); filter: brightness(0) invert(1); }
          @media (max-width: 768px) {
            div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
