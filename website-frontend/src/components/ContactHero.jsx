"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';

import { useBuilder } from '../context/BuilderContext';

const ContactHero = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = React.useState(initialData || {});

  // Real-time sync from Visual Builder
  React.useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.sectionId === 'contact-hero') {
      setData(prev => ({ ...prev, ...siteConfig.data }));
    }
  }, [isEditMode, siteConfig]);

  React.useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  const {
    title = "Contact Us",
    breadcrumbText = "Contact Us",
    bannerImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    overlayOpacity = 0.5,
    bannerHeight = "400px"
  } = data || {};

  return (
    <EditableSection sectionId="contact-hero" label="Contact Hero Banner">
      <section 
        className="service-hero-premium" 
        style={{ 
          backgroundImage: `url(${bannerImage})`,
          minHeight: bannerHeight,
          position: 'relative'
        }}
      >
        {/* Dynamic Overlay */}
        <div 
          className="hero-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
            zIndex: 1
          }}
        />

        <div className="max-w-[1400px] mx-auto w-full relative" style={{ zIndex: 2 }}>
          {/* Heading on Top */}
          <h1 className="service-hero-title" style={{ color: overlayOpacity > 0.4 ? '#ffffff' : '#111111' }}>
            <EditableText sectionId="contact-hero" fieldPath="hero.title">
              {title}
            </EditableText>
          </h1>

          {/* Breadcrumb Below */}
          <div className="service-hero-breadcrumb" style={{ color: overlayOpacity > 0.4 ? 'rgba(255,255,255,0.8)' : '#555555' }}>
            <span className="current" style={{ color: overlayOpacity > 0.4 ? '#ffffff' : '#111111' }}>Home</span>
            <span className="sep" style={{ color: overlayOpacity > 0.4 ? 'rgba(255,255,255,0.4)' : '#cccccc' }}>/</span>
            <span className="current" style={{ color: overlayOpacity > 0.4 ? '#ffffff' : '#111111' }}>
               <EditableText sectionId="contact-hero" fieldPath="hero.breadcrumbText">
                  {breadcrumbText}
               </EditableText>
            </span>
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default ContactHero;
