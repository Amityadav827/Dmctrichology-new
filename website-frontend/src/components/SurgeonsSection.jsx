"use client";
import React, { useState, useEffect } from 'react';
import { Check, MoveRight } from 'lucide-react';
import { fetchSurgeons } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const blueIconFilter = 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)';

const SurgeonsSection = () => {
  const [data, setData] = useState(null);
  const [activeSurgeon, setActiveSurgeon] = useState(null);

  useEffect(() => {
    fetchSurgeons().then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
        if (res.data.surgeons && res.data.surgeons.length > 0) {
          setActiveSurgeon(res.data.surgeons[0]);
        }
      }
    });
  }, []);

  if (data && data.enabled === false) return null;

  const heading = data ? (data.heading || '') : 'Meet Our Hair Transplant Surgeons';
  const badgeText = data ? (data.badgeText || '') : 'TRUSTED CARE SERVICES';
  const safeSurgeons = Array.isArray(data?.surgeons) ? data.surgeons : [];

  // Use activeSurgeon state but ensure it's still in the current data list
  const currentSurgeon = safeSurgeons.find(s => s._id === activeSurgeon?._id) || safeSurgeons[0];
  const realActiveIndex = safeSurgeons.indexOf(currentSurgeon);

  return (
    <EditableSection sectionId="surgeons-section" label="Meet Our Surgeons">
      <section className="surgeons-section" style={{ padding: '100px 5%', backgroundColor: '#E8EAF6' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <img 
                src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
                alt="icon" 
                style={{ width: '40px', height: 'auto', filter: blueIconFilter }} 
              />
              <EditableText sectionId="surgeons-section" fieldPath="badgeText" tag="span" className="section-subtitle">
                {badgeText}
              </EditableText>
            </div>
            <h2 className="section-title">
              <EditableText sectionId="surgeons-section" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start' }}>
            
            {/* Left Column: List */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {safeSurgeons.map((surgeon, index) => (
                <div 
                  key={index}
                  className={`surgeon-tab ${currentSurgeon?._id === surgeon._id ? 'active' : ''}`}
                  onClick={() => setActiveSurgeon(surgeon)}
                  style={{ 
                    padding: '25px 30px', 
                    borderRadius: '25px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '18px', fontFamily: "'Marcellus', serif" }}>
                    <EditableText sectionId="surgeons-section" fieldPath={`surgeons.${index}.name`} tag="span">
                      {surgeon.name}
                    </EditableText>
                  </span>
                  <div className="surgeon-tab-arrow">
                    <img 
                      src="https://res.cloudinary.com/dseixl6px/image/upload/v1777613952/dmc-trichology/xc065ftxo6zamcldpd59.png" 
                      alt="arrow" 
                      style={{ width: '40px', height: 'auto' }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Detail Card */}
            {currentSurgeon && (
              <div style={{ 
                flex: '2 1 600px', 
                backgroundColor: '#3B5998', 
                borderRadius: '40px', 
                padding: '30px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '30px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
              }}>
                {/* Image */}
                <div style={{ flex: '1 1 300px' }}>
                  <img 
                    src={currentSurgeon.image} 
                    alt={currentSurgeon.name} 
                    style={{ width: '100%', borderRadius: '25px', height: '100%', objectFit: 'cover' }} 
                  />
                </div>

                {/* Info */}
                <div style={{ flex: '1 1 300px', padding: '10px 0' }}>
                  <div style={{ marginBottom: '20px', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src="/icons/surgeons/surgeon-badge.svg" 
                      alt="icon" 
                      style={{ width: '26px', height: '26px', objectFit: 'contain' }} 
                    />
                  </div>

                  <h3 style={{ 
                    fontSize: '28px', 
                    color: '#ffffff', 
                    fontFamily: "'Marcellus', serif", 
                    marginBottom: '15px',
                    fontWeight: '400'
                  }}>
                    <EditableText sectionId="surgeons-section" fieldPath={`surgeons.${realActiveIndex}.name`} tag="span">
                      {currentSurgeon.name}
                    </EditableText>
                  </h3>

                  <p style={{ 
                    fontSize: '14px', 
                    lineHeight: '22px', 
                    color: '#ffffff', 
                    fontFamily: "'Marcellus', serif",
                    marginBottom: '20px'
                  }}>
                    <EditableText sectionId="surgeons-section" fieldPath={`surgeons.${realActiveIndex}.role`} tag="span">
                      {currentSurgeon.role}
                    </EditableText>
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                    {Array.isArray(currentSurgeon.features) && currentSurgeon.features.map((feature, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.75)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 18px' }}>
                          <Check size={12} color="#ffffff" strokeWidth={3} />
                        </span>
                        <span style={{ fontSize: '13px', color: '#ffffff', fontFamily: "'Marcellus', serif" }}>
                          <EditableText sectionId="surgeons-section" fieldPath={`surgeons.${realActiveIndex}.features.${i}`} tag="span">
                            {feature}
                          </EditableText>
                        </span>
                      </div>
                    ))}
                  </div>

                  <a href={currentSurgeon.buttonLink || '/team-of-dmc'} className="surgeon-detail-btn" style={{ 
                    padding: '12px 25px', 
                    borderRadius: '30px', 
                    border: '1px solid #ffffff', 
                    fontFamily: "'Marcellus', serif",
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: '#ffffff',
                    width: 'fit-content'
                  }}>
                    <EditableText sectionId="surgeons-section" fieldPath={`surgeons.${realActiveIndex}.buttonText`} tag="span">
                      {currentSurgeon.buttonText || 'Get Details'}
                    </EditableText>
                    <span className="surgeon-detail-arrow" aria-hidden="true">
                      <MoveRight size={15} strokeWidth={2} />
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .surgeon-tab {
            background-color: #A8B7CA;
            color: #000;
          }

          .surgeon-tab.active,
          .surgeon-tab:hover {
            background-color: #3B5998;
            color: #fff;
          }

          .surgeon-tab-arrow {
            transform: none;
            transition: transform 0.3s ease;
          }

          .surgeon-tab.active .surgeon-tab-arrow,
          .surgeon-tab:hover .surgeon-tab-arrow {
            transform: rotate(-45deg);
          }

          .surgeon-detail-btn {
            background-color: transparent;
            transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
          }

          .surgeon-detail-btn:hover {
            background-color: #ffffff;
            color: #3B5998 !important;
            border-color: #ffffff !important;
            box-shadow: 0 10px 24px rgba(255, 255, 255, 0.14);
          }

          .surgeon-detail-btn:hover span:first-child {
            color: #3B5998 !important;
          }

          .surgeon-detail-btn:focus-visible {
            outline: 2px solid #ffffff;
            outline-offset: 3px;
          }

          .surgeon-detail-arrow {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #ffffff;
            color: #3B5998;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-45deg);
            transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
          }

          .surgeon-detail-btn:hover .surgeon-detail-arrow {
            background-color: #3B5998;
            color: #ffffff;
            transform: rotate(0deg) translateX(3px);
          }

          @media (max-width: 1024px) {
            .surgeons-section { padding: 60px 5% !important; }
            .surgeons-section > div > div:last-child {
              gap: 28px !important;
            }
            .surgeons-section .section-title {
              font-size: clamp(34px, 5vw, 48px) !important;
              line-height: 1.1 !important;
            }
          }
          @media (max-width: 767px) {
            .surgeons-section {
              padding: 48px 16px !important;
            }
            .surgeons-section > div > div:first-child {
              margin-bottom: 32px !important;
            }
            .surgeons-section .section-title {
              font-size: clamp(30px, 8.5vw, 40px) !important;
            }
            .surgeon-tab {
              padding: 18px 20px !important;
              border-radius: 20px !important;
            }
            .surgeon-tab span {
              font-size: 16px !important;
            }
            .surgeons-section div[style*="background-color: rgb(59, 89, 152)"] {
              padding: 18px !important;
              border-radius: 24px !important;
              gap: 20px !important;
            }
            .surgeons-section img {
              max-width: 100%;
            }
            .surgeon-detail-btn {
              width: 100% !important;
              justify-content: center;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default SurgeonsSection;
