"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';


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
    googleMapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.444704381882!2d77.16010531508083!3d28.55641798244799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1df64319087d%3A0xe6759c22f07f2324!2sDMC%20Trichology%20Vasant%20Vihar!5e0!3m2!1sen!2sin!4v1625471234567!5m2!1sen!2sin",
    mapHeight = "600px",
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
      </section>
    </EditableSection>
  );
};

export default MapSection;
