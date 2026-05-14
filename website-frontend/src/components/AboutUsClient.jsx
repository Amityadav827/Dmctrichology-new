"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilder } from '../context/BuilderContext';
import AboutUsHero from '@/components/AboutUsHero';
import AboutUsStory from '@/components/AboutUsStory';
import AboutUsJourney from '@/components/AboutUsJourney';
import AboutUsVision from '@/components/AboutUsVision';
import AboutUsExperts from '@/components/AboutUsExperts';
import AboutUsTestimonials from '@/components/AboutUsTestimonials';

export default function AboutUsClient({ initialData }) {
  const [aboutData, setAboutData] = useState(initialData);
  const { siteConfig } = useBuilder();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';

  // Sync with siteConfig (updates from Sidebar/External)
  useEffect(() => {
    if (!siteConfig || Object.keys(siteConfig).length === 0) return;

    setAboutData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        // Expected key format: "sectionId.field.path"
        const [sectionId, ...pathParts] = key.split('.');
        const fieldPath = pathParts.join('.');
        
        // Map sectionId to data object if needed, but for AboutUs 
        // the fieldPath already starts with "hero", "story" etc.
        // So we just use fieldPath.
        
        const parts = fieldPath.split('.');
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        
        if (current[parts[parts.length - 1]] !== siteConfig[key]) {
          current[parts[parts.length - 1]] = siteConfig[key];
          hasChanges = true;
        }
      });

      return hasChanges ? newData : prev;
    });
  }, [siteConfig]);

  // Sync with local on-page edits
  useEffect(() => {
    if (!isEditing) return;

    const handleCmsUpdate = (e) => {
      const { fieldPath, value } = e.detail;
      setAboutData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        const parts = fieldPath.split('.');
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        return newData;
      });
    };

    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, [isEditing]);

  if (!aboutData) return null;

  return (
    <main className="about-us-page-wrapper">
      <AboutUsHero data={aboutData.hero} />
      <AboutUsStory data={aboutData.story} />
      <AboutUsVision data={aboutData.vision} />
      <AboutUsJourney data={aboutData.journey} />
      <AboutUsExperts data={aboutData.experts} />
      <AboutUsTestimonials data={aboutData.testimonials} />
    </main>
  );
}
