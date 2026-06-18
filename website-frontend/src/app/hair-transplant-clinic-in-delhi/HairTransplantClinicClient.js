"use client";

import React from 'react';
import AboutDrNandaniHero from '../../components/AboutDrNandaniHero';
import AboutDrNandaniSpecialist from '../../components/AboutDrNandaniSpecialist';
import AboutDrNandaniTimeline from '../../components/AboutDrNandaniTimeline';
import AboutDrNandaniEducationExperience from '../../components/AboutDrNandaniEducationExperience';
import AboutDrNandaniTrust from '../../components/AboutDrNandaniTrust';
import AboutDrNandaniOtherSpecialities from '../../components/AboutDrNandaniOtherSpecialities';
import AboutDrNandaniTestimonials from '../../components/AboutDrNandaniTestimonials';
import FaqSection from '../../components/FaqSection';

export default function HairTransplantClinicClient({ pageData, faqData }) {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <AboutDrNandaniHero
        data={pageData.hero}
        breadcrumbData={pageData.breadcrumb}
        formSettings={pageData.formSettings}
        leadEndpoint="/contact"
        leadService="Hair Transplant Clinic In Delhi Consultation"
        showEyebrow={false}
        sectionIds={{
          hero: 'hair-transplant-clinic-hero',
          breadcrumb: 'hair-transplant-clinic-breadcrumb'
        }}
      />
      <AboutDrNandaniSpecialist data={pageData.specialist} showEyebrow={false} />
      <AboutDrNandaniTimeline data={pageData.timeline} showDescription layoutVariant="clinicCompact" showEyebrow={false} />
      <AboutDrNandaniTrust data={pageData.trustSection} showEyebrow={false} />
      <AboutDrNandaniEducationExperience
        data={pageData.educationExperience}
        credentialsData={pageData.credentialsSection}
        showImages={false}
      />
      <AboutDrNandaniOtherSpecialities data={pageData.otherSpecialitiesSection} />
      <AboutDrNandaniTestimonials data={pageData.testimonialsSection} useDefaultTestimonials={false} showEyebrow={false} />
      <FaqSection initialData={faqData} iconOverride="https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1781108623663-534508060.svg" showBadge={false} />
    </main>
  );
}
