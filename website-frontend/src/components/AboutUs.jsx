"use client";
import { useState, useEffect } from 'react';
import { fetchAboutUs } from '../services/api';
import CountUpStat from './CountUpStat';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const blueIconFilter = 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)';

const AboutUs = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAboutUs().then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  // Only use fallbacks if data has not loaded yet (null state)
  // Once data loads from DB, always render DB values — no hardcoded override
  const stats = data?.stats || [
    { value: '2k+', label: 'Patients Healed', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
    { value: '15+', label: 'Certified Doctors', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
    { value: '4.9', label: 'Average Patient Rating', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
    { value: '100+', label: 'New Equipments', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true }
  ];

  const title = data ? (data.title || '') : 'WELCOME TO DMC TRICHOLOGY®';
  const subtitle = data ? (data.subtitle || '') : 'ABOUT US CARE';
  const description = data ? (data.description || '') : 'At DMC Trichology, Advanced Hair Transplant Techniques Restore Your Hairline And Boost Confidence';
  const sectionIcon = data?.icon || "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png";

  return (
    <EditableSection sectionId="about-us" label="About Us">
      <section className="welcome-section" style={{ padding: '100px 5%', backgroundColor: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <img 
              src={sectionIcon} 
              alt="icon" 
              style={{ width: '40px', height: 'auto', filter: blueIconFilter }} 
            />
            <EditableText sectionId="about-us" fieldPath="subtitle" tag="span" className="section-subtitle">
              {subtitle}
            </EditableText>
          </div>

          <h2 className="section-title">
            <EditableText sectionId="about-us" fieldPath="title" tag="span">
              {title}
            </EditableText>
          </h2>

          <p style={{ 
            fontSize: '44px', 
            lineHeight: '60px',
            color: '#333', 
            fontFamily: "'Marcellus', serif", 
            marginBottom: '60px',
            maxWidth: '1200px',
            margin: '0 auto 60px'
          }}>
            <EditableText sectionId="about-us" fieldPath="description" tag="span">
              {description}
            </EditableText>
          </p>

          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '40px',
            marginTop: '40px'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '42px', color: '#333333', fontFamily: "'Marcellus', serif", marginBottom: '10px', fontWeight: '400' }}>
                  <EditableText sectionId="about-us" fieldPath={`stats.${index}.value`} tag="span">
                    <CountUpStat value={stat.value} />
                  </EditableText>
                </h3>
                <p style={{ fontSize: '18px', color: '#333333', fontFamily: "'Marcellus', serif", marginBottom: '20px' }}>
                  <EditableText sectionId="about-us" fieldPath={`stats.${index}.label`} tag="span">
                    {stat.label}
                  </EditableText>
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  {stat.showDivider !== false && (
                    <img 
                      src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
                      alt="divider" 
                      style={{ width: '60px', height: 'auto', marginBottom: '10px', filter: blueIconFilter }} 
                    />
                  )}
                  <p style={{ fontSize: '12px', color: '#777', fontFamily: "'Marcellus', serif", maxWidth: '180px', lineHeight: '1.6' }}>
                    <EditableText sectionId="about-us" fieldPath={`stats.${index}.description`} tag="span">
                      {stat.description}
                    </EditableText>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 1199px) {
            .welcome-section {
              padding: 72px 4% !important;
              overflow: hidden;
            }
            .welcome-section .section-title {
              font-size: clamp(34px, 5vw, 48px) !important;
              line-height: 1.1 !important;
            }
            .stats-grid {
              gap: 30px !important;
            }
          }
          @media (max-width: 768px) {
            .welcome-section {
              padding: 52px 16px !important;
            }
            .welcome-section .section-title {
              font-size: clamp(30px, 8.5vw, 40px) !important;
            }
            .welcome-section > div > p {
              font-size: clamp(22px, 7vw, 30px) !important;
              line-height: 1.25 !important;
              margin-bottom: 38px !important;
            }
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
            .stats-grid h3 {
              font-size: 34px !important;
            }
            .stats-grid p {
              overflow-wrap: anywhere;
            }
          }
          @media (max-width: 480px) {
            .stats-grid { grid-template-columns: 1fr !important; }
            .stats-grid {
              gap: 28px !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default AboutUs;
