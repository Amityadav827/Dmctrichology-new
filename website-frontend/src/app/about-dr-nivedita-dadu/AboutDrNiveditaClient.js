"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilder } from '../../context/BuilderContext';
import AboutDrNiveditaHero from '../../components/AboutDrNiveditaHero';
import AboutDrNiveditaBreadcrumb from '../../components/AboutDrNiveditaBreadcrumb';
import AboutDrNiveditaSpecialist from '../../components/AboutDrNiveditaSpecialist';
import AboutDrNiveditaMembership from '../../components/AboutDrNiveditaMembership';
import AboutDrNiveditaEducationExperience from '../../components/AboutDrNiveditaEducationExperience';
import AboutDrNiveditaCredentials from '../../components/AboutDrNiveditaCredentials';
import AboutDrNiveditaOtherSpecialities from '../../components/AboutDrNiveditaOtherSpecialities';

// Map sectionId prefix → pageData key
const SECTION_MAP = {
  'about-nivedita-hero.':                 'hero',
  'about-nivedita-breadcrumb.':           'breadcrumb',
  'about-nivedita-specialist.':           'specialist',
  'about-nivedita-membership.':           'membership',
  'about-nivedita-education.':            'educationExperience',
  'about-nivedita-credentials.':          'credentialsSection',
  'about-nivedita-other-specialities.':   'otherSpecialitiesSection',
};

const SECTION_ID_MAP = {
  'about-nivedita-hero':                'hero',
  'about-nivedita-breadcrumb':          'breadcrumb',
  'about-nivedita-specialist':          'specialist',
  'about-nivedita-membership':          'membership',
  'about-nivedita-education':           'educationExperience',
  'about-nivedita-credentials':         'credentialsSection',
  'about-nivedita-other-specialities':  'otherSpecialitiesSection',
};

function applyDeepPath(obj, fieldPath, value) {
  const parts = fieldPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

export default function AboutDrNiveditaClient({ initialData }) {
  const [pageData, setPageData] = useState(initialData);
  const { siteConfig } = useBuilder();
  const searchParams = useSearchParams();

  // Sync Visual Live Builder changes
  useEffect(() => {
    if (!siteConfig || Object.keys(siteConfig).length === 0) return;

    setPageData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        const matchedPrefix = Object.keys(SECTION_MAP).find(p => key.startsWith(p));
        if (!matchedPrefix) return;

        const dataKey = SECTION_MAP[matchedPrefix];
        const fieldPath = key.slice(matchedPrefix.length);
        const value = siteConfig[key];

        if (!newData[dataKey]) newData[dataKey] = {};
        const before = JSON.stringify(newData[dataKey]);
        applyDeepPath(newData[dataKey], fieldPath, value);
        if (JSON.stringify(newData[dataKey]) !== before) hasChanges = true;
      });

      return hasChanges ? newData : prev;
    });
  }, [siteConfig]);

  // Listen for inline CMS click-to-edit updates
  useEffect(() => {
    const handleCmsUpdate = (event) => {
      const { sectionId, fieldPath, value } = event.detail || {};
      if (!sectionId || !fieldPath) return;

      const dataKey = SECTION_ID_MAP[sectionId];
      if (!dataKey) return;

      setPageData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        if (!newData[dataKey]) newData[dataKey] = {};
        applyDeepPath(newData[dataKey], fieldPath, value);
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
      <AboutDrNiveditaMembership data={pageData.membership || {}} />
      <AboutDrNiveditaEducationExperience data={pageData.educationExperience || {}} />
      <AboutDrNiveditaCredentials data={pageData.credentialsSection || {}} />
      <AboutDrNiveditaOtherSpecialities data={pageData.otherSpecialitiesSection || {}} />
    </main>
  );
}
