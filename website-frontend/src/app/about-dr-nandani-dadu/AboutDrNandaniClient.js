"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilder } from '../../context/BuilderContext';
import AboutDrNandaniHero from '../../components/AboutDrNandaniHero';
import AboutDrNandaniIntro from '../../components/AboutDrNandaniIntro';

export default function AboutDrNandaniClient({ initialData }) {
  const [pageData, setPageData] = useState(initialData);
  const { siteConfig } = useBuilder();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';

  // 1. Sync settings from parent Visual Live Builder Frame (Vite)
  useEffect(() => {
    if (!siteConfig || Object.keys(siteConfig).length === 0) return;

    setPageData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let hasChanges = false;

      // Section mappings registered inside VisualLiveBuilder
      const sectionPrefixes = [
        'about-nandani-hero.',
        'about-nandani-intro.'
      ];

      Object.keys(siteConfig).forEach(key => {
        const prefix = sectionPrefixes.find(p => key.startsWith(p));
        if (!prefix) return;

        // Extract key and nested paths (e.g. "hero.badge", "intro.bulletList.0")
        const fieldPath = key.replace(prefix, '');
        const parts = fieldPath.split('.');
        
        let current = newData;
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
  }, [siteConfig]);

  // 2. Sync page state with local inline edit updates (e.g. text/image typing blurs)
  useEffect(() => {
    if (!isEditing) return;

    const handleCmsUpdate = (e) => {
      const { sectionId, fieldPath, value } = e.detail;
      setPageData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        const parts = fieldPath.split('.');
        let current = newData;
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

  if (!pageData) return null;

  return (
    <main style={{ backgroundColor: '#0D0D1A', minHeight: '100vh' }}>
      <AboutDrNandaniHero data={pageData} />
      <AboutDrNandaniIntro data={pageData.intro} />
    </main>
  );
}
