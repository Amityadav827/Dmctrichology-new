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
        sectionIds={{
          hero: 'hair-transplant-clinic-hero',
          breadcrumb: 'hair-transplant-clinic-breadcrumb'
        }}
      />
      <AboutDrNandaniSpecialist data={pageData.specialist} />
      <AboutDrNandaniTimeline data={pageData.timeline} showDescription />
      <AboutDrNandaniTrust data={pageData.trustSection} />
      <AboutDrNandaniEducationExperience
        data={pageData.educationExperience}
        credentialsData={pageData.credentialsSection}
      />
      <AboutDrNandaniOtherSpecialities data={pageData.otherSpecialitiesSection} />
      <AboutDrNandaniTestimonials data={pageData.testimonialsSection} />
      <FaqSection initialData={faqData} />
    </main>
  );
}
