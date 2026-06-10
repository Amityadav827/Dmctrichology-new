"use client";
import { useState, useEffect } from 'react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';
import Link from 'next/link';

const IdealFrequency = ({ data = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [sectionData, setSectionData] = useState(data);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setSectionData(data);
  }, [data]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...sectionData };
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('ideal-frequency-section.idealFrequency.')) {
          const field = key.replace('ideal-frequency-section.idealFrequency.', '');
          nextData[field] = siteConfig[key];
          hasUpdates = true;
        }
      });
      if (hasUpdates) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSectionData(nextData);
      }
    }
  }, [isEditMode, siteConfig]);

  const idealFor = sectionData.idealForPoints || [];
  const notIdealFor = sectionData.notIdealForPoints || [];
  
  return (
    <EditableSection sectionId="ideal-frequency-section" label="Ideal Frequency & CTA">
      <section className="details-ideal-freq-section" data-section-id="ideal-frequency-section">
        <div className="details-if-container">
          
          {/* LEFT: Frequency & Suitability Cards */}
          <div className="details-if-left">
            
            {/* Top Bar */}
            <div className="details-freq-topcard">
              <h3 className="details-freq-title">
                <EditableText sectionId="ideal-frequency-section" fieldPath="idealFrequency.frequencyTitle">
                  {sectionData.frequencyTitle || 'Ideal frequency'}
                </EditableText>
              </h3>
              <p className="details-freq-desc">
                <EditableText sectionId="ideal-frequency-section" fieldPath="idealFrequency.frequencyDescription">
                  {sectionData.frequencyDescription || 'After 6-8 sessions, 80% - 90% hair reduction can be seen'}
                </EditableText>
              </p>
            </div>

            {/* Bottom Split Cards */}
            <div className="details-suitability-row">
              {/* Ideal For */}
              <div className="details-suit-card">
                <div className="details-suit-header">Ideal for</div>
                <ul className="details-suit-list">
                  {idealFor.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </div>

              {/* Not Ideal For */}
              <div className="details-suit-card details-suit-card-alt">
                <div className="details-suit-header">Not Ideal for</div>
                <ul className="details-suit-list">
                  {notIdealFor.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </div>
            </div>

          </div>

          {/* RIGHT: Consultation CTA */}
          <div className="details-if-right">
            <h3 className="details-cta-title">
              <EditableText sectionId="ideal-frequency-section" fieldPath="idealFrequency.ctaTitle">
                {sectionData.ctaTitle || 'Not sure which treatment is right for YOU?'}
              </EditableText>
            </h3>
            
            <div className="details-cta-image-wrapper">
              <img 
                src={sectionData.ctaImage || 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png'} 
                alt="Consultation" 
                className="details-cta-img"
              />
            </div>

            <p className="details-cta-desc">
              <EditableText sectionId="ideal-frequency-section" fieldPath="idealFrequency.ctaDescription">
                {sectionData.ctaDescription || "We can help with that! Schedule a free online consultation with one of our expert Doctors and we'll help you create a customized plan."}
              </EditableText>
            </p>

            <Link href={sectionData.ctaButtonLink || '/contact-us'} className="details-cta-btn">
              <EditableText sectionId="ideal-frequency-section" fieldPath="idealFrequency.ctaButtonText">
                {sectionData.ctaButtonText || 'Book a free online consultation'}
              </EditableText>
              <span className="details-cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b5998" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </Link>
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default IdealFrequency;
