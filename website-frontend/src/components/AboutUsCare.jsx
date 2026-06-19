"use client";
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { fetchWhyChooseDMC } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const defaultFeatures = [
  { text: "Golden Technique", enabled: true },
  { text: "Minimal Procedure", enabled: true },
  { text: "Natural Results", enabled: true },
  { text: "Safe Procedure", enabled: true },
  { text: "Expert Team", enabled: true },
  { text: "Affordable Quality", enabled: true },
  { text: "FUE MesoGrow", enabled: true },
  { text: "Top Trichologist", enabled: true }
];

const AboutUsCare = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchWhyChooseDMC().then(res => {
      if (res && res.success && res.data) {
        setData(res.data);
      }
    });
  }, []);

  if (data && data.enabled === false) return null;

  const heading = data ? (data.heading || '') : 'WHY CHOOSE DMC TRICHOLOGY?';
  const description = data ? (data.description || '') : 'At DMC Trichology, A Top Hair Transplant Trichologist With Advanced Training And Expertise, And Committed Staff Members, Work To Provide Our Clients With Excellent Hair Loss And Hair Transplant Results.';
  const mainImage = data ? (data.mainImage || '') : "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962140217-nymnxvv9rzeyfjeif7oe.png";
  const bottomImage = data ? (data.bottomImage || '') : "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1777962141909-xe3vngtetdirbpovotgi.png";
  const bgColor = data ? (data.backgroundColor || '#ffffff') : '#ffffff';

  const safeFeatures = Array.isArray(data?.features) ? data.features : null;
  const activeFeatures = (safeFeatures && safeFeatures.length > 0)
    ? safeFeatures.filter(f => f.enabled !== false)
    : defaultFeatures;

  return (
    <EditableSection sectionId="why-choose-dmc" label="Why Choose DMC">
      <section className="about-us-care" style={{ padding: '60px 5%', backgroundColor: bgColor, position: 'relative', overflow: 'hidden' }}>
        <div className="about-us-care-layout" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
          
          {/* Left Side: Large Image */}
          <div className="about-us-care-image-column" style={{ flex: '1 1 350px', position: 'relative' }}>
            <div style={{ 
              width: '100%'
            }}>
              <img 
                src={mainImage} 
                alt="Doctor at Work" 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>


          {/* Right Side: Content */}
          <div className="about-us-care-content-column" style={{ flex: '1 1 350px' }}>
            <h2 className="section-title">
              <EditableText sectionId="why-choose-dmc" fieldPath="heading" tag="span">
                {heading}
              </EditableText>
            </h2>

            <p style={{ 
              fontSize: '14px', 
              lineHeight: '22px', 
              color: '#666', 
              fontFamily: "'Marcellus', serif",
              marginBottom: '30px',
              maxWidth: '500px'
            }}>
              <EditableText sectionId="why-choose-dmc" fieldPath="description" tag="span">
                {description}
              </EditableText>
            </p>

            {/* Feature Box */}
            <div className="about-us-care-feature-box" style={{ 
              display: 'flex', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
              backgroundColor: '#3B5998',
              height: 'auto',
              minHeight: '180px'
            }}>
              {/* Box Left: Image */}
              <div className="about-us-care-feature-media" style={{ width: '40%' }}>
                <img 
                  src={bottomImage} 
                  alt="Hair Detail" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Box Right: Points with Background */}
              <div className="about-us-care-points-grid" style={{ 
                width: '60%', 
                padding: '28px 24px', 
                backgroundColor: '#3B5998',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignContent: 'center',
                columnGap: '26px',
                rowGap: '16px',
                position: 'relative'
              }}>
                {activeFeatures.map((item, index) => {
                  const realIndex = safeFeatures ? data.features.indexOf(item) : index;
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2, minWidth: 0 }}>
                      <span style={{ width: '20px', height: '20px', flex: '0 0 20px', borderRadius: '50%', backgroundColor: '#E8EAF6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={13} color="#3B5998" strokeWidth={3} />
                      </span>
                      <span style={{ color: '#fff', fontSize: '13px', lineHeight: '1.35', fontFamily: "'Marcellus', serif" }}>
                        <EditableText sectionId="why-choose-dmc" fieldPath={`features.${realIndex}.text`} tag="span">
                          {item.text}
                        </EditableText>
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>


        <style jsx>{`
          @media (max-width: 1024px) {
            .about-us-care { padding: 60px 5% !important; }
            .about-us-care-layout {
              gap: 32px !important;
            }
            .about-us-care img {
              max-width: 100%;
            }
          }
          @media (max-width: 640px) {
            .about-us-care {
              padding: 48px 16px !important;
            }
            .about-us-care-layout {
              flex-direction: column !important;
              gap: 28px !important;
            }
            .about-us-care-image-column,
            .about-us-care-content-column {
              width: 100% !important;
              flex: 1 1 100% !important;
            }
            .about-us-care .section-title {
              font-size: 24px !important;
              line-height: 1.2 !important;
              margin-bottom: 14px !important;
            }
            .about-us-care p[style*="max-width: 500px"] {
              max-width: 100% !important;
              margin-bottom: 24px !important;
            }
            .about-us-care-feature-box {
              flex-direction: column !important;
              border-radius: 22px !important;
            }
            .about-us-care-feature-media,
            .about-us-care-points-grid {
              width: 100% !important;
            }
            .about-us-care-feature-media img {
              display: block;
              width: 100% !important;
              height: 190px !important;
              object-fit: cover !important;
            }
            .about-us-care-points-grid {
              grid-template-columns: 1fr 1fr !important;
              padding: 20px 18px !important;
              column-gap: 14px !important;
              row-gap: 14px !important;
            }
            .about-us-care-points-grid > div {
              align-items: flex-start !important;
              gap: 8px !important;
            }
            .about-us-care-points-grid span[style*="font-size: 13px"] {
              font-size: 11px !important;
              line-height: 1.3 !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default AboutUsCare;
