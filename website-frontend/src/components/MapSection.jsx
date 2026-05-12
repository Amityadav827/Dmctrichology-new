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
            gap: '20px',
            zIndex: 10,
            width: 'fit-content'
          }}
        >
          {/* Pin Icon Container */}
          <div 
            style={{ 
              width: '75px', 
              height: '75px', 
              backgroundColor: '#fff', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
              flexShrink: 0
            }}
          >
            <MapPin size={35} color={iconColor} fill={iconColor} />
          </div>

          {/* Blue Rounded Card */}
          <div 
            style={{
              backgroundColor: cardBackground,
              padding: '12px',
              borderRadius: '32px',
              color: textColor,
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              minWidth: '380px'
            }}
          >
            {/* Left Glass Preview Area */}
            <div 
              style={{
                width: '160px',
                height: '110px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                marginRight: '28px'
              }}
            />

            {/* Right Text Content */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 
                style={{ 
                  margin: 0, 
                  fontFamily: "'Marcellus', serif", 
                  fontSize: '38px',
                  fontWeight: 700,
                  lineHeight: '1.1',
                  letterSpacing: '0.5px',
                  color: textColor
                }}
              >
                <EditableText sectionId="contact-map" fieldPath="city" tag="span">
                  {city}
                </EditableText>
              </h3>
              <p 
                style={{ 
                  margin: '6px 0 0', 
                  fontFamily: "'Lato', sans-serif", 
                  fontSize: '16px',
                  fontWeight: 400,
                  opacity: 0.8,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: textColor
                }}
              >
                <EditableText sectionId="contact-map" fieldPath="area" tag="span">
                  {area}
                </EditableText>
              </p>
            </div>
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
