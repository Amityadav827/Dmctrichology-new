"use client";
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { fetchWhyChooseDMC } from '../services/api';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

const blueIconFilter = 'brightness(0) saturate(100%) invert(31%) sepia(22%) saturate(1838%) hue-rotate(181deg) brightness(91%) contrast(89%)';

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
  const subtitle = data ? (data.badgeText || '') : 'ABOUT US CARE';
  const description = data ? (data.description || '') : 'At DMC Trichology, A Top Hair Transplant Trichologist With Advanced Training And Expertise, And Committed Staff Members, Work To Provide Our Clients With Excellent Hair Loss And Hair Transplant Results.';
  const mainImage = data ? (data.mainImage || '') : "https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/nymnxvv9rzeyfjeif7oe.png";
  const bottomImage = data ? (data.bottomImage || '') : "https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/xe3vngtetdirbpovotgi.png";
  const bgColor = data ? (data.backgroundColor || '#ffffff') : '#ffffff';

  const safeFeatures = Array.isArray(data?.features) ? data.features : null;
  const activeFeatures = (safeFeatures && safeFeatures.length > 0)
    ? safeFeatures.filter(f => f.enabled !== false)
    : defaultFeatures;

  return (
    <EditableSection sectionId="why-choose-dmc" label="Why Choose DMC">
      <section className="about-us-care" style={{ padding: '60px 5%', backgroundColor: bgColor, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
          
          {/* Left Side: Large Image */}
          <div style={{ flex: '1 1 450px', position: 'relative' }}>
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
          <div style={{ flex: '1 1 450px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
               <img 
                 src="https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png" 
                 alt="icon" 
                 style={{ width: '40px', height: 'auto', filter: blueIconFilter }} 
               />
               <EditableText sectionId="why-choose-dmc" fieldPath="badgeText" tag="span" className="section-subtitle">
                 {subtitle}
               </EditableText>
            </div>

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
            <div style={{ 
              display: 'flex', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
              backgroundColor: '#3B5998',
              height: 'auto',
              minHeight: '180px'
            }}>
              {/* Box Left: Image */}
              <div style={{ width: '40%' }}>
                <img 
                  src={bottomImage} 
                  alt="Hair Detail" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Box Right: Points with Background */}
              <div style={{ 
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
          }
          @media (max-width: 640px) {
            .points-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default AboutUsCare;
