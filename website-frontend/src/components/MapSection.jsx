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
            gap: '15px',
            zIndex: 10
          }}
        >
          <div 
            style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: '#fff', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <MapPin size={24} color={iconColor} fill={iconColor} fillOpacity={0.1} />
          </div>

          <div 
            style={{
              backgroundColor: cardBackground,
              padding: '15px 30px',
              borderRadius: '12px',
              color: textColor,
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
              minWidth: '200px'
            }}
          >
            <h3 
              style={{ 
                margin: 0, 
                fontFamily: "'Marcellus', serif", 
                fontSize: '18px',
                fontWeight: 400
              }}
            >
              <EditableText sectionId="contact-map" fieldPath="city" tag="span">
                {city}
              </EditableText>
            </h3>
            <p 
              style={{ 
                margin: 0, 
                fontFamily: "'Lato', sans-serif", 
                fontSize: '13px',
                opacity: 0.8
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
              gap: 10px;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default MapSection;
