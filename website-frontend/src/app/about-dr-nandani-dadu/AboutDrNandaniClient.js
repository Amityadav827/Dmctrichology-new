"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilder } from '../../context/BuilderContext';
import AboutDrNandaniHero from '../../components/AboutDrNandaniHero';
import AboutDrNandaniSpecialist from '../../components/AboutDrNandaniSpecialist';
import AboutDrNandaniTimeline from '../../components/AboutDrNandaniTimeline';
import AboutDrNandaniEducationExperience from '../../components/AboutDrNandaniEducationExperience';
import AboutDrNandaniTrust from '../../components/AboutDrNandaniTrust';
import AboutDrNandaniOtherSpecialities from '../../components/AboutDrNandaniOtherSpecialities';
import AboutDrNandaniTestimonials from '../../components/AboutDrNandaniTestimonials';
import FaqSection from '../../components/FaqSection';

export default function AboutDrNandaniClient({ initialData, initialFaqData = null }) {
  const [pageData, setPageData] = useState(initialData);
  const { isEditMode, siteConfig } = useBuilder();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';

  // 1. Sync settings from parent Visual Live Builder Frame (Vite)
  useEffect(() => {
    if (!isEditing && !isEditMode) return;
    if (!siteConfig || Object.keys(siteConfig).length === 0) return;

    setPageData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let hasChanges = false;

      // Section mappings registered inside VisualLiveBuilder
      const sectionPrefixes = [
        'about-nandani-hero.',
        'about-nandani-breadcrumb.',
        'about-nandani-specialist.',
        'about-nandani-timeline.',
        'about-nandani-education.',
        'about-nandani-credentials.',
        'about-nandani-trust.',
        'about-nandani-other-specialities.',
        'about-nandani-testimonials.',
        'about-nandani-faq.'
      ];

      Object.keys(siteConfig).forEach(key => {
        const prefix = sectionPrefixes.find(p => key.startsWith(p));
        if (!prefix) return;

        // Extract key and nested paths (e.g. "doctorName")
        const fieldPath = key.replace(prefix, '');
        const parts = fieldPath.split('.');
        
        let current;
        if (prefix === 'about-nandani-hero.') {
          if (!newData.hero) newData.hero = {};
          current = newData.hero;
        } else if (prefix === 'about-nandani-breadcrumb.') {
          if (!newData.breadcrumb) newData.breadcrumb = {};
          current = newData.breadcrumb;
        } else if (prefix === 'about-nandani-specialist.') {
          if (!newData.specialist) newData.specialist = {};
          current = newData.specialist;
        } else if (prefix === 'about-nandani-timeline.') {
          if (!newData.timeline) newData.timeline = {};
          current = newData.timeline;
        } else if (prefix === 'about-nandani-education.') {
          if (!newData.educationExperience) newData.educationExperience = {};
          current = newData.educationExperience;
        } else if (prefix === 'about-nandani-credentials.') {
          if (!newData.credentialsSection) newData.credentialsSection = {};
          current = newData.credentialsSection;
        } else if (prefix === 'about-nandani-trust.') {
          if (!newData.trustSection) newData.trustSection = {};
          current = newData.trustSection;
        } else if (prefix === 'about-nandani-other-specialities.') {
          if (!newData.otherSpecialitiesSection) newData.otherSpecialitiesSection = {};
          current = newData.otherSpecialitiesSection;
        } else if (prefix === 'about-nandani-testimonials.') {
          if (!newData.testimonialsSection) newData.testimonialsSection = {};
          current = newData.testimonialsSection;
        } else if (prefix === 'about-nandani-faq.') {
          if (!newData.faqSection) newData.faqSection = {};
          current = newData.faqSection;
        } else {
          current = newData;
        }

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!current[part]) {
            current[part] = isNaN(parts[i+1]) ? {} : [];
          }
          current = current[part];
        }
        
        const lastPart = parts[parts.length - 1];
        if (current[lastPart] !== siteConfig[key]) {
          current[lastPart] = siteConfig[key];
          hasChanges = true;
        }
      });

      return hasChanges ? newData : prev;
    });
  }, [isEditing, isEditMode, siteConfig]);

  // 2. Sync page state with local inline edit updates (e.g. text/image typing blurs)
  useEffect(() => {
    if (!isEditing) return;

    const handleCmsUpdate = (e) => {
      const { sectionId, fieldPath, value } = e.detail;
      setPageData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        const parts = fieldPath.split('.');
        let current;
        if (sectionId === 'about-nandani-hero') {
          if (!newData.hero) newData.hero = {};
          current = newData.hero;
        } else if (sectionId === 'about-nandani-breadcrumb') {
          if (!newData.breadcrumb) newData.breadcrumb = {};
          current = newData.breadcrumb;
        } else if (sectionId === 'about-nandani-specialist') {
          if (!newData.specialist) newData.specialist = {};
          current = newData.specialist;
        } else if (sectionId === 'about-nandani-timeline') {
          if (!newData.timeline) newData.timeline = {};
          current = newData.timeline;
        } else if (sectionId === 'about-nandani-education') {
          if (!newData.educationExperience) newData.educationExperience = {};
          current = newData.educationExperience;
        } else if (sectionId === 'about-nandani-credentials') {
          if (!newData.credentialsSection) newData.credentialsSection = {};
          current = newData.credentialsSection;
        } else if (sectionId === 'about-nandani-trust') {
          if (!newData.trustSection) newData.trustSection = {};
          current = newData.trustSection;
        } else if (sectionId === 'about-nandani-other-specialities') {
          if (!newData.otherSpecialitiesSection) newData.otherSpecialitiesSection = {};
          current = newData.otherSpecialitiesSection;
        } else if (sectionId === 'about-nandani-testimonials') {
          if (!newData.testimonialsSection) newData.testimonialsSection = {};
          current = newData.testimonialsSection;
        } else if (sectionId === 'about-nandani-faq') {
          if (!newData.faqSection) newData.faqSection = {};
          current = newData.faqSection;
        } else {
          current = newData;
        }

        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = isNaN(parts[i+1]) ? {} : [];
          }
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        return newData;
      });
    };

    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, [isEditing]);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <AboutDrNandaniHero
        data={pageData.hero || {}}
        breadcrumbData={pageData.breadcrumb || {}}
        formSettings={pageData.formSettings || {}}
      />
      <AboutDrNandaniSpecialist data={pageData.specialist || {}} />
      <AboutDrNandaniTimeline data={pageData.timeline || {}} />
      <AboutDrNandaniTrust data={pageData.trustSection || {}} />
      <AboutDrNandaniEducationExperience
        data={pageData.educationExperience || {}}
        credentialsData={pageData.credentialsSection || {}}
      />
      <AboutDrNandaniOtherSpecialities data={pageData.otherSpecialitiesSection || {}} />
      <AboutDrNandaniTestimonials data={pageData.testimonialsSection || {}} />
      <FaqSection initialData={initialFaqData} />
    </main>
  );
}
