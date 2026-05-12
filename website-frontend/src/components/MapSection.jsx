"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { MapPin } from 'lucide-react';

import { useBuilder } from '../context/BuilderContext';

const MapSection = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = React.useState(initialData || {});

  // Real-time sync from Visual Builder
  React.useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.sectionId === 'contact-map') {
      setData(prev => ({ ...prev, ...siteConfig.data }));
    }
  }, [isEditMode, siteConfig]);

  React.useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  const {
    city = "New Delhi",
    area = "Vasant Vihar",
    googleMapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.444704381882!2d77.16010531508083!3d28.55641798244799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1df64319087d%3A0xe6759c22f07f2324!2sDMC%20Trichology%20Vasant%20Vihar!5e0!3m2!1sen!2sin!4v1625471234567!5m2!1sen!2sin",
    mapHeight = "600px",
    cardBackground = "#2D4A8A",
    iconColor = "#C8102E",
    textColor = "#FFFFFF"
  } = data || {};

  return (
    <EditableSection sectionId="contact-map" label="Location Map Section">
      <section className="map-section" style={{ position: 'relative', width: '100%', height: mapHeight, backgroundColor: '#f0f0f0' }}>
        {/* Map Embed */}
        <iframe
          src={googleMapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Clinic Location"
        ></iframe>

        {/* Floating Location Card */}
        <div 
          className="location-floating-card"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            zIndex: 10,
            width: 'fit-content'
          }}
        >
          {/* Custom Pin Image (No BG) */}
          <div style={{ flexShrink: 0 }}>
            <img 
              src="https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778570823936-861958394.png" 
              alt="Pin" 
              style={{ width: '60px', height: 'auto', display: 'block' }} 
            />
          </div>

          {/* Transparent Glass Area (Border only) */}
          <div 
            style={{
              width: '160px',
              height: '70px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '20px',
              border: '1.5px solid rgba(255, 255, 255, 0.5)',
              margin: '0 15px'
            }}
          />

          {/* Text Area with Blue Background */}
          <div 
            style={{
              backgroundColor: cardBackground,
              padding: '12px 25px',
              borderRadius: '24px',
              color: textColor,
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: '220px',
              height: '70px'
            }}
          >
            <h3 
              style={{ 
                margin: 0, 
                fontFamily: "'Marcellus', serif", 
                fontSize: '22px',
                fontWeight: 700,
                lineHeight: '1.2',
                color: textColor
              }}
            >
              <EditableText sectionId="contact-map" fieldPath="city" tag="span">
                {city}
              </EditableText>
            </h3>
            <p 
              style={{ 
                margin: '2px 0 0', 
                fontFamily: "'Lato', sans-serif", 
                fontSize: '12px',
                fontWeight: 400,
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: textColor
              }}
            >
              <EditableText sectionId="contact-map" fieldPath="area" tag="span">
                {area}
              </EditableText>
            </p>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .location-floating-card {
              flex-direction: column;
              gap: 15px !important;
              width: 90% !important;
            }
            .location-floating-card > div:last-child {
              min-width: unset !important;
              width: 100%;
              flex-direction: column;
              padding: 20px !important;
              text-align: center;
              border-radius: 24px !important;
            }
            .location-floating-card > div:last-child > div:first-child {
              margin-right: 0 !important;
              margin-bottom: 15px;
              width: 100% !important;
              height: 80px !important;
            }
            .location-floating-card h3 {
              font-size: 28px !important;
            }
            .location-floating-card p {
              font-size: 15px !important;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default MapSection;
