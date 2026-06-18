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
  const description = data ? (data.description || '') : 'At DMC Trichology, Advanced Hair Transplant Techniques Restore Your Hairline And Boost Confidence';

  return (
    <EditableSection sectionId="about-us" label="About Us">
      <section className="welcome-section" style={{ padding: '100px 5%', backgroundColor: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                      src="https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962112281-lsmvsocjusyrery1hjum.png" 
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
              font-size: 26px !important;
              line-height: 1.25 !important;
            }
            .welcome-section > div > p {
              font-size: 18px !important;
              line-height: 1.6 !important;
              margin-bottom: 32px !important;
            }
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
            .stats-grid h3 {
              font-size: 28px !important;
            }
            .stats-grid > div > p {
              font-size: 13px !important;
            }
            .stats-grid p {
              overflow-wrap: anywhere;
            }
          }
          @media (max-width: 480px) {
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
            .stats-grid {
              gap: 26px 14px !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default AboutUs;
