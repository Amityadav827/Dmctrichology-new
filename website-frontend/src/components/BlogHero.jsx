"use client";
import React from 'react';
import EditableSection from './Editable/EditableSection';
import EditableText from './Editable/EditableText';
import { useBuilder } from '../context/BuilderContext';

const BlogHero = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [data, setData] = React.useState(initialData || {});

  // Real-time sync from Visual Builder
  React.useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.sectionId === 'blog-hero') {
      setData(prev => ({ ...prev, ...siteConfig.data }));
    }
  }, [isEditMode, siteConfig]);

  React.useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  const {
    title = "Blog",
    breadcrumbText = "Blog",
    bannerImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    overlayOpacity = 0.5,
    bannerHeight = "400px"
  } = data || {};

  return (
    <EditableSection sectionId="blog-hero" label="Blog Hero Banner">
      <section 
        className="service-hero-premium"
        style={{ 
          backgroundImage: `url(${bannerImage})`,
          minHeight: bannerHeight || '400px'
        }}
      >
        {/* Content Layer */}
        <div className="max-w-[1400px] mx-auto w-full">
          <h1 className="service-hero-title">
            <EditableText sectionId="blog-hero" fieldPath="hero.title">
              {title}
            </EditableText>
          </h1>

          <div className="service-hero-breadcrumb">
            <span style={{ cursor: 'pointer' }}>Home</span>
            <span className="sep">/</span>
            <span className="current">
               <EditableText sectionId="blog-hero" fieldPath="hero.breadcrumbText">
                  {breadcrumbText}
               </EditableText>
            </span>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .service-hero-premium h1 {
            font-size: 36px !important;
          }
        }
      `}</style>
    </EditableSection>
  );
};

export default BlogHero;
