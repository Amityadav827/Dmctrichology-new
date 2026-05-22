"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilder } from '../../context/BuilderContext';
import AboutDrNiveditaHero from '../../components/AboutDrNiveditaHero';
import AboutDrNiveditaBreadcrumb from '../../components/AboutDrNiveditaBreadcrumb';
import AboutDrNiveditaSpecialist from '../../components/AboutDrNiveditaSpecialist';

export default function AboutDrNiveditaClient({ initialData }) {
  const [pageData, setPageData] = useState(initialData);
  const { siteConfig } = useBuilder();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';

  // Sync settings from Visual Live Builder
  useEffect(() => {
    if (!siteConfig || Object.keys(siteConfig).length === 0) return;

    setPageData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let hasChanges = false;

      const sectionPrefixes = [
        'about-nivedita-hero.',
        'about-nivedita-breadcrumb.',
        'about-nivedita-specialist.'
      ];

      Object.keys(siteConfig).forEach(key => {
        const matchedPrefix = sectionPrefixes.find(p => key.startsWith(p));
        if (!matchedPrefix) return;

        const fieldPath = key.slice(matchedPrefix.length);
        const value = siteConfig[key];
        let current;

        if (matchedPrefix === 'about-nivedita-hero.') {
          if (!newData.hero) newData.hero = {};
          current = newData.hero;
        } else if (matchedPrefix === 'about-nivedita-breadcrumb.') {
          if (!newData.breadcrumb) newData.breadcrumb = {};
          current = newData.breadcrumb;
        } else if (matchedPrefix === 'about-nivedita-specialist.') {
          if (!newData.specialist) newData.specialist = {};
          current = newData.specialist;
        } else {
          current = newData;
        }

        const parts = fieldPath.split('.');
        let obj = current;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!obj[parts[i]]) obj[parts[i]] = {};
          obj = obj[parts[i]];
        }
        const lastKey = parts[parts.length - 1];
        if (obj[lastKey] !== value) {
          obj[lastKey] = value;
          hasChanges = true;
        }
      });

      return hasChanges ? newData : prev;
    });
  }, [siteConfig]);

  // Listen for inline CMS updates
  useEffect(() => {
    const handleCmsUpdate = (event) => {
      const { sectionId, fieldPath, value } = event.detail || {};
      if (!sectionId || !fieldPath) return;

      setPageData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        let current;

        if (sectionId === 'about-nivedita-hero') {
          if (!newData.hero) newData.hero = {};
          current = newData.hero;
        } else if (sectionId === 'about-nivedita-breadcrumb') {
          if (!newData.breadcrumb) newData.breadcrumb = {};
          current = newData.breadcrumb;
        } else if (sectionId === 'about-nivedita-specialist') {
          if (!newData.specialist) newData.specialist = {};
          current = newData.specialist;
        } else {
          current = newData;
        }

        const parts = fieldPath.split('.');
        let obj = current;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!obj[parts[i]]) obj[parts[i]] = {};
          obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
        return newData;
      });
    };

    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, []);

  return (
    <main>
      <AboutDrNiveditaHero data={pageData.hero || {}} />
      <AboutDrNiveditaBreadcrumb data={pageData.breadcrumb || {}} />
      <AboutDrNiveditaSpecialist data={pageData.specialist || {}} />
    </main>
  );
}
