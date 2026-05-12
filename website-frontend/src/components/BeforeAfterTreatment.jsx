"use client";
import { useState, useEffect } from 'react';
import EditableText from './Editable/EditableText';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';

const BeforeAfterTreatment = ({ data = {} }) => {
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
        if (key.startsWith('before-after-section.beforeAfter.')) {
          const field = key.replace('before-after-section.beforeAfter.', '');
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

  const beforePoints = sectionData.beforePoints || [];
  const afterPoints = sectionData.afterPoints || [];
  const bgColor = sectionData.sectionBackground || '#EAEAF2';

  return (
    <EditableSection sectionId="before-after-section" label="Before / After Treatment">
      <section 
        className="details-before-after-section" 
        data-section-id="before-after-section"
        style={{ backgroundColor: bgColor }}
      >
        <div className="details-ba-container">
          
          {/* Before Card */}
          <div className="details-ba-column">
            <h3 className="details-ba-title">
              <EditableText sectionId="before-after-section" fieldPath="beforeAfter.beforeTitle">
                {sectionData.beforeTitle || 'Before Treatment'}
              </EditableText>
            </h3>
            <div className="details-ba-card">
              {beforePoints.length > 0 ? (
                <ul className="details-ba-list">
                  {beforePoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="details-ba-empty">No points added yet.</p>
              )}
            </div>
          </div>

          {/* After Card */}
          <div className="details-ba-column">
            <h3 className="details-ba-title">
              <EditableText sectionId="before-after-section" fieldPath="beforeAfter.afterTitle">
                {sectionData.afterTitle || 'After Treatment'}
              </EditableText>
            </h3>
            <div className="details-ba-card">
              {afterPoints.length > 0 ? (
                <ul className="details-ba-list">
                  {afterPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="details-ba-empty">No points added yet.</p>
              )}
            </div>
          </div>

        </div>
      </section>
    </EditableSection>
  );
};

export default BeforeAfterTreatment;
