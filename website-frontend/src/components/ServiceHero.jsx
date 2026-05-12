"use client";
import { useState, useEffect } from 'react';
import EditableText from './Editable/EditableText';
import Link from 'next/link';
import { useBuilder } from '../context/BuilderContext';

const ServiceHero = ({ data }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [heroData, setHeroData] = useState(data || {});

  // Sync state when props change (for SSR data)
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroData(data);
    }
  }, [data]);

  // Sync state with Visual Builder for live preview
  useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.hero) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroData(siteConfig.hero);
    }
  }, [isEditMode, siteConfig]);

  const pageTitle = heroData.pageTitle || 'Our Premium Services';
  const breadcrumbCurrent = heroData.breadcrumbText || 'Services'; 
  const bannerImage = heroData.bannerImage || 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png';

  return (
    <section 
      data-section-id="service-hero"
      className="service-hero-premium"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Heading on Top */}
        <h1 className="service-hero-title">
          <EditableText sectionId="service-hero" fieldPath="hero.pageTitle">
            {pageTitle}
          </EditableText>
        </h1>

        {/* Breadcrumb Below */}
        <div className="service-hero-breadcrumb">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span className="current">
             <EditableText sectionId="service-hero" fieldPath="hero.breadcrumbText">
                {breadcrumbCurrent}
             </EditableText>
          </span>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
