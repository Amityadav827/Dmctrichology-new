"use client";
import React, { useState, useEffect } from 'react';
import { fetchTreatmentPlan } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

export default function TreatmentSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchTreatmentPlan();
      if (res?.success) setData(res.data);
    };
    loadData();

    const handleCmsUpdate = (e) => {
      if (e.detail.sectionId === 'treatment-plan-section') {
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

  const badgeText = data?.badgeText || "TREATMENT PLAN";
  const heading = data?.heading || "Know the Right Treatment for You";
  const cards = data?.cards || [];

  return (
    <EditableSection sectionId="treatment-plan-section" label="KNOW THE RIGHT TREATMENT">
      <section style={{ padding: '0', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '20px',
              flexWrap: 'nowrap'
            }}>
               <img 
                 src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
                 alt="icon" 
                 style={{ width: '45px', height: 'auto', objectFit: 'contain' }} 
               />
               <EditableText sectionId="treatment-plan-section" fieldPath="badgeText" tag="span" className="section-subtitle" style={{ whiteSpace: 'nowrap' }}>
                 {badgeText}
               </EditableText>
            </div>
            <h2 className="section-title">
              <EditableText sectionId="treatment-plan-section" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>
          </div>

          {/* Cards Container */}
          <div className="treatment-grid" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {cards.map((card, index) => (
              <div key={index} style={{ 
                flex: '1 1 600px', 
                display: 'flex', 
                backgroundColor: '#F7F8F8', 
                borderRadius: '30px', 
                overflow: 'hidden',
                minHeight: '300px'
              }}>
                {/* Image Side */}
                <div style={{ flex: '0 0 45%', minHeight: '300px' }}>
                  <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                {/* Content Side */}
                <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '28px', color: '#333333', fontFamily: "'Marcellus', serif", fontWeight: '400', marginBottom: '15px' }}>
                    <EditableText sectionId="treatment-plan-section" fieldPath={`cards.${index}.title`} tag="span">
                      {card.title}
                    </EditableText>
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', fontFamily: "'Marcellus', serif", lineHeight: '1.6', marginBottom: '30px' }}>
                    <EditableText sectionId="treatment-plan-section" fieldPath={`cards.${index}.description`} tag="span">
                      {card.description}
                    </EditableText>
                  </p>
                  
                  <a href={card.buttonLink || '#'} className="treatment-btn" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    backgroundColor: '#000', 
                    color: '#fff', 
                    padding: '12px 25px', 
                    borderRadius: '10px', 
                    textDecoration: 'none',
                    width: 'fit-content',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: "'Marcellus', serif",
                    transition: 'all 0.3s ease'
                  }}>
                    <EditableText sectionId="treatment-plan-section" fieldPath={`cards.${index}.buttonText`} tag="span">
                      {card.buttonText}
                    </EditableText>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .treatment-btn:hover {
            background-color: #E4B753 !important;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          .treatment-btn:hover svg {
            transform: translateX(5px);
            transition: transform 0.3s ease;
          }
          @media (max-width: 992px) {
            .treatment-grid > div {
              flex-direction: column !important;
            }
            .treatment-grid > div > div {
              flex: none !important;
              width: 100% !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
}
