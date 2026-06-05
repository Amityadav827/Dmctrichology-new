"use client";

import React, { useEffect, useMemo, useState } from 'react';
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

const DEFAULT_IMAGE = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp';

const SECTION_MAP = {
  'about-nivedita-hero.': 'hero',
  'about-nivedita-breadcrumb.': 'breadcrumb',
  'about-nivedita-specialist.': 'specialist',
  'about-nivedita-timeline.': 'timeline',
  'about-nivedita-education.': 'educationExperience',
  'about-nivedita-credentials.': 'credentialsSection',
  'about-nivedita-trust.': 'trustSection',
  'about-nivedita-other-specialities.': 'otherSpecialitiesSection',
  'about-nivedita-testimonials.': 'testimonialsSection'
};

const SECTION_ID_MAP = {
  'about-nivedita-hero': 'hero',
  'about-nivedita-breadcrumb': 'breadcrumb',
  'about-nivedita-specialist': 'specialist',
  'about-nivedita-timeline': 'timeline',
  'about-nivedita-education': 'educationExperience',
  'about-nivedita-credentials': 'credentialsSection',
  'about-nivedita-trust': 'trustSection',
  'about-nivedita-other-specialities': 'otherSpecialitiesSection',
  'about-nivedita-testimonials': 'testimonialsSection'
};

function applyDeepPath(obj, fieldPath, value) {
  const parts = fieldPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = Number.isNaN(Number(parts[i + 1])) ? {} : [];
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

function stripHtml(html = '') {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeNiveditaData(pageData = {}) {
  const hero = pageData.hero || {};
  const breadcrumb = pageData.breadcrumb || {};
  const specialist = pageData.specialist || {};
  const education = pageData.educationExperience || {};
  const credentials = pageData.credentialsSection || {};
  const patientCare = pageData.patientCareSection || {};
  const otherSpecialities = pageData.otherSpecialitiesSection || {};

  const careIntro = stripHtml(patientCare.leftCardContent);
  const careProfessional = stripHtml(patientCare.rightCardContent);
  const expertiseIntro = stripHtml(credentials.leftText);

  return {
    hero: {
      ...hero,
      doctorImage: hero.doctorImage || DEFAULT_IMAGE,
      galleryImage: hero.galleryImage || hero.doctorImage || DEFAULT_IMAGE,
      doctorName: hero.doctorName || 'Dr. Nivedita Dadu',
      mainHeading: hero.mainHeading || 'EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI',
      degreeText: hero.degreeText || 'MBBS, MD (Dermatology)',
      descriptionParagraph: hero.descriptionParagraph || 'Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence.'
    },
    breadcrumb: {
      ...breadcrumb,
      title: breadcrumb.title || 'About Dr. Nivedita Dadu',
      parentLabel: breadcrumb.parentLabel || 'Home',
      parentUrl: breadcrumb.parentUrl || '/',
      currentPageText: breadcrumb.currentPageText || 'About Dr. Nivedita Dadu'
    },
    formSettings: pageData.formSettings || {
      title: 'Request Private Consultation',
      subtitle: 'Reserve your bespoke dermatology and trichology consultation session.',
      successMessage: 'Your consultation request has been successfully submitted to Dr. Nivedita Dadu. Our team will reach out to you shortly.'
    },
    specialist: {
      ...specialist,
      heading: specialist.heading || 'Best Dermatologist & Hair Specialist in Delhi',
      highlightedText: specialist.highlightedText || 'She specializes in cutting-edge treatments including:',
      bullets: specialist.bullets?.length ? specialist.bullets : [
        'Advanced PRP & GFC Therapy',
        'FUE Hair Transplant Surgery',
        'Scalp Micropigmentation',
        'LLLT (Laser Hair Therapy)',
        'Custom Trichological Protocols'
      ]
    },
    timeline: pageData.timeline || {
      eyebrow: 'TRUSTED CARE SERVICES',
      heading: 'What Makes Dr. Nivedita Dadu A Trusted Dermatologist & Trichologist In Delhi?',
      steps: [
        {
          title: 'Clinical Excellence',
          description: 'Distinguished dermatologist and trichologist recognized for exceptional patient outcomes and research contributions.'
        },
        {
          title: 'Advanced Diagnostics',
          description: 'Combines dermatology expertise with trichological science for precise scalp and hair diagnosis.'
        },
        {
          title: 'Personalized Protocols',
          description: 'Delivers evidence-based care plans tailored to each patient and treatment goal.'
        },
        {
          title: 'Patient-Centred Care',
          description: careIntro || 'Offers personalized skin and hair care with compassion, clinical depth, and respect for every patient.'
        }
      ]
    },
    trustSection: pageData.trustSection || {
      eyebrow: 'TRUSTED CARE SERVICES',
      heading: 'Why Do Patients Trust Dr. Nivedita Dadu As A Dermatologist & Hair Specialist In Delhi?',
      image: otherSpecialities.image || hero.doctorImage || DEFAULT_IMAGE,
      imageAlt: otherSpecialities.imageAlt || 'Dr. Nivedita Dadu consultation',
      trustPoints: [
        {
          title: 'Unparalleled Dermatology Expertise',
          description: specialist.description1 || 'Dr. Nivedita Dadu is a distinguished dermatologist and trichologist recognized for exceptional patient outcomes.'
        },
        {
          title: 'Comprehensive Hair & Skin Treatments',
          description: specialist.description2 || 'She combines dermatology and trichological sciences to deliver comprehensive scalp and hair solutions.'
        },
        {
          title: 'Professional Clinical Care',
          description: careProfessional || 'She maintains a highly professional environment to offer quality clinical care and customized treatment solutions.'
        },
        {
          title: 'Evidence-Based Treatment Planning',
          description: expertiseIntro || 'Her treatment approach combines advanced technology, patient education, and individualized care.'
        }
      ],
      conclusionParagraph: careIntro || 'Dr. Nivedita Dadu is known for professional-grade, personalized skin and hair care treatments at DMC Trichology.'
    },
    educationExperience: {
      ...education,
      experienceTabLabel: education.experienceTabLabel || 'Experience',
      educationTabLabel: education.educationTabLabel || 'Education',
      credentialsTabLabel: education.credentialsTabLabel || credentials.heading || 'Credentials',
      topImage: education.topImage || hero.doctorImage || DEFAULT_IMAGE,
      bottomImage: education.bottomImage || otherSpecialities.image || DEFAULT_IMAGE
    },
    credentialsSection: {
      ...credentials,
      credentialsList: credentials.credentialsList?.length ? credentials.credentialsList : [
        { text: 'Fellowship In Aesthetic Dermatology' },
        { text: 'Fellowship In Hair Science' },
        { text: 'Member - IADVL (Indian Association of Dermatologists)' }
      ]
    },
    otherSpecialitiesSection: {
      ...otherSpecialities,
      image: otherSpecialities.image || hero.doctorImage || DEFAULT_IMAGE,
      imageAlt: otherSpecialities.imageAlt || 'Dr. Nivedita Other Specialities'
    },
    testimonialsSection: pageData.testimonialsSection || {
      heading: 'Patient Testimonials',
      testimonials: [
        {
          text: 'Dr. Nivedita Dadu is an excellent dermatologist and trichologist. Her approach is patient, detailed, and very reassuring throughout the treatment journey.',
          patientName: 'DMC Patient',
          disclaimer: '* Opinions/Results may vary from person to person.',
          stars: 5
        },
        {
          text: 'The consultation was thorough and the treatment plan was explained clearly. I felt confident and comfortable at every step.',
          patientName: 'DMC Patient',
          disclaimer: '* Opinions/Results may vary from person to person.',
          stars: 5
        },
        {
          text: 'Dr. Nivedita Dadu combines professional expertise with compassionate care. The clinic experience was smooth and premium.',
          patientName: 'DMC Patient',
          disclaimer: '* Opinions/Results may vary from person to person.',
          stars: 5
        },
        {
          text: 'Her guidance helped me understand my hair and scalp concerns better. The treatment process felt personalized and reliable.',
          patientName: 'DMC Patient',
          disclaimer: '* Opinions/Results may vary from person to person.',
          stars: 5
        }
      ]
    }
  };
}

export default function AboutDrNiveditaClient({ initialData, initialFaqData = null }) {
  const [pageData, setPageData] = useState(initialData);
  const { isEditMode, siteConfig } = useBuilder();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';

  useEffect(() => {
    if (!isEditing && !isEditMode) return;
    if (!siteConfig || Object.keys(siteConfig).length === 0) return;

    setPageData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let hasChanges = false;

      Object.keys(siteConfig).forEach(key => {
        const matchedPrefix = Object.keys(SECTION_MAP).find(prefix => key.startsWith(prefix));
        if (!matchedPrefix) return;

        const dataKey = SECTION_MAP[matchedPrefix];
        const fieldPath = key.slice(matchedPrefix.length);
        const before = JSON.stringify(newData[dataKey] || {});

        if (!newData[dataKey]) newData[dataKey] = {};
        applyDeepPath(newData[dataKey], fieldPath, siteConfig[key]);
        if (JSON.stringify(newData[dataKey]) !== before) hasChanges = true;
      });

      return hasChanges ? newData : prev;
    });
  }, [isEditing, isEditMode, siteConfig]);

  useEffect(() => {
    if (!isEditing) return;

    const handleCmsUpdate = (event) => {
      const { sectionId, fieldPath, value } = event.detail || {};
      const dataKey = SECTION_ID_MAP[sectionId];
      if (!dataKey || !fieldPath) return;

      setPageData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        if (!newData[dataKey]) newData[dataKey] = {};
        applyDeepPath(newData[dataKey], fieldPath, value);
        return newData;
      });
    };

    window.addEventListener('cms-update', handleCmsUpdate);
    return () => window.removeEventListener('cms-update', handleCmsUpdate);
  }, [isEditing]);

  const templateData = useMemo(() => normalizeNiveditaData(pageData), [pageData]);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <AboutDrNandaniHero
        data={templateData.hero}
        breadcrumbData={templateData.breadcrumb}
        formSettings={templateData.formSettings}
        leadEndpoint="/about-dr-nivedita/lead"
        leadService="Dr. Nivedita Consultation Form"
        sectionIds={{
          hero: 'about-nivedita-hero',
          breadcrumb: 'about-nivedita-breadcrumb'
        }}
      />
      <AboutDrNandaniSpecialist data={templateData.specialist} />
      <AboutDrNandaniTimeline data={templateData.timeline} />
      <AboutDrNandaniTrust data={templateData.trustSection} />
      <AboutDrNandaniEducationExperience
        data={templateData.educationExperience}
        credentialsData={templateData.credentialsSection}
      />
      <AboutDrNandaniOtherSpecialities data={templateData.otherSpecialitiesSection} />
      <AboutDrNandaniTestimonials data={templateData.testimonialsSection} />
      <FaqSection initialData={initialFaqData} />
    </main>
  );
}
