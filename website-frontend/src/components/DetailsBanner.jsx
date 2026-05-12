"use client";
import { useState, useEffect } from 'react';
import EditableText from './Editable/EditableText';
import Link from 'next/link';
import { useBuilder } from '../context/BuilderContext';
import EditableSection from './Editable/EditableSection';

const DetailsBanner = ({ data = {} }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [bannerData, setBannerData] = useState(data);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setBannerData(data);
  }, [data]);

  useEffect(() => {
    if (isEditMode && siteConfig) {
      let hasUpdates = false;
      const nextData = { ...bannerData };
      Object.keys(siteConfig).forEach(key => {
        if (key.startsWith('details-banner.banner.')) {
          const field = key.replace('details-banner.banner.', '');
          nextData[field] = siteConfig[key];
          hasUpdates = true;
        }
      });
      if (hasUpdates) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBannerData(nextData);
      }
    }
  }, [isEditMode, siteConfig]);

  const pageTitle = bannerData.pageTitle || 'Service Details';
  const breadcrumbText = bannerData.breadcrumbText || 'Details';
  const bannerImage = bannerData.bannerImage || '';

  return (
    <EditableSection sectionId="details-banner" label="Details Banner">
      <section
        data-section-id="details-banner"
        className="service-hero-premium"
        style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
      >
        <div className="max-w-[1400px] mx-auto w-full">
          <h1 className="service-hero-title">
            <EditableText sectionId="details-banner" fieldPath="banner.pageTitle">
              {pageTitle}
            </EditableText>
          </h1>
          <div className="service-hero-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">
              <EditableText sectionId="details-banner" fieldPath="banner.breadcrumbText">
                {breadcrumbText}
              </EditableText>
            </span>
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default DetailsBanner;
