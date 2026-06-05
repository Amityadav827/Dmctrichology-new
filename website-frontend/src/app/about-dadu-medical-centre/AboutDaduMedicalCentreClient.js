"use client";

import React, { useMemo } from 'react';
import AboutDrNandaniHero from '../../components/AboutDrNandaniHero';
import AboutDrNandaniSpecialist from '../../components/AboutDrNandaniSpecialist';
import AboutDrNandaniTimeline from '../../components/AboutDrNandaniTimeline';
import AboutDrNandaniTrust from '../../components/AboutDrNandaniTrust';
import AboutDrNandaniEducationExperience from '../../components/AboutDrNandaniEducationExperience';
import AboutDrNandaniOtherSpecialities from '../../components/AboutDrNandaniOtherSpecialities';
import AboutDrNandaniTestimonials from '../../components/AboutDrNandaniTestimonials';
import FaqSection from '../../components/FaqSection';

const DEFAULT_IMAGE = 'https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp';

function stripHtml(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickImage(data = {}) {
  const hero = data.hero || {};
  const intro = data.intro || {};
  const holistic = data.holisticApproach || {};
  const infra = data.infrastructure || {};
  const galleryImage = Array.isArray(infra.gallery) && infra.gallery.length > 0
    ? (infra.gallery[0]?.image || infra.gallery[0]?.url || '')
    : '';

  return hero.leftImage || hero.heroImage || hero.backgroundImage || intro.image || holistic.image || galleryImage || DEFAULT_IMAGE;
}

function normalizeDaduData(pageData = {}) {
  const hero = pageData.hero || {};
  const intro = pageData.intro || {};
  const hairCentre = pageData.hairTreatmentCentre || {};
  const holistic = pageData.holisticApproach || {};
  const patientFirst = pageData.patientFirstApproach || {};
  const expertise = pageData.ourExpertise || {};
  const expertiseDetails = pageData.expertiseDetails || {};
  const infrastructure = pageData.infrastructure || {};
  const primaryImage = pickImage(pageData);
  const gallery = Array.isArray(infrastructure.gallery) ? infrastructure.gallery : [];
  const topImage = gallery[0]?.image || gallery[0]?.url || holistic.image || primaryImage;
  const bottomImage = gallery[1]?.image || gallery[1]?.url || intro.image || primaryImage;
  const bullets = Array.isArray(expertiseDetails.bulletPoints) && expertiseDetails.bulletPoints.length > 0
    ? expertiseDetails.bulletPoints
    : [
        'Hair loss treatments with Advanced HGP 2.0',
        'Root Restore Therapy',
        'Mesotherapy',
        'Clinical therapeutic procedures for hair regrowth',
        'In-house trichology salon for optimum scalp health.'
      ];

  const introDescription = stripHtml(hero.description || intro.sectionDescription || hairCentre.description);
  const hairCentreText = stripHtml(hairCentre.description);
  const holisticText = stripHtml(holistic.description);
  const patientFirstText = stripHtml(patientFirst.description);
  const expertiseText = stripHtml(expertise.description || expertiseDetails.description);

  return {
    hero: {
      mainHeading: hero.badgeText || 'ABOUT DMC TRICHOLOGY',
      doctorName: hero.mainHeading || 'About DMC Trichology',
      degreeText: hero.subtitle || "INDIA'S PREMIUM HAIR & SCALP SPECIALIST SOLUTION",
      descriptionParagraph: introDescription || 'DMC Trichology provides advanced skin and hair treatment procedures with a patient-first clinical approach.',
      doctorImage: primaryImage,
      galleryImage: primaryImage,
      submitButtonText: hero.submitButtonText || 'Schedule Your Visit'
    },
    breadcrumb: {
      title: hero.mainHeading || 'About DMC Trichology',
      parentLabel: 'Home',
      parentUrl: '/',
      currentPageText: hero.mainHeading || 'About DMC Trichology'
    },
    formSettings: {
      title: hero.formTitle || 'Request Private Consultation',
      subtitle: hero.subtitle || 'Reserve your DMC Trichology consultation session.',
      successMessage: 'Your consultation request has been successfully submitted. Our team will reach out to you shortly.'
    },
    specialist: {
      heading: 'Why Choose Dadu Medical Centre',
      description1: hairCentreText || 'DMC Trichology focuses on scalp and hair health with advanced clinical science and patient-centred care.',
      description2: holisticText || 'Our trichology experts evaluate hair loss concerns in detail and recommend personalized treatment plans.',
      highlightedText: 'DMC Trichology offers advanced hair and scalp solutions including:',
      bullets,
      featureCards: [
        { title: 'Advanced Hair Restoration' },
        { title: 'Holistic Scalp Diagnosis' },
        { title: 'Patient-First Care' },
        { title: 'Premium Clinical Infrastructure' }
      ],
      sectionBgColor: '#FFFFFF',
      cardBgColor: '#3b5998'
    },
    timeline: {
      eyebrow: 'TRUSTED CARE SERVICES',
      heading: 'Key Highlights Section',
      sectionBgColor: '#FFFFFF',
      steps: [
        {
          title: 'Holistic & Integrative Approach',
          description: holisticText || 'Comprehensive analysis of hair loss concerns through clinical evaluation and advanced trichology protocols.'
        },
        {
          title: 'Patient-First Approach',
          description: patientFirstText || 'Comfort, safety, and step-by-step guidance remain central to every treatment journey.'
        },
        {
          title: 'Advanced Expertise',
          description: expertiseText || 'Microsurgical, artistic, and advanced hair restoration solutions supported by experienced doctors.'
        },
        {
          title: 'Modern Infrastructure',
          description: 'Premium clinical spaces and advanced treatment systems designed for reliable DMC Trichology care.'
        }
      ]
    },
    trustSection: {
      eyebrow: 'TRUSTED CARE SERVICES',
      heading: 'Trust & Expertise Section',
      image: holistic.image || primaryImage,
      imageAlt: holistic.imageAlt || 'DMC Trichology clinical care',
      trustPoints: [
        {
          title: 'Hair Treatment Centre In Delhi',
          description: hairCentreText || 'A professional-grade one-stop solution for hair and scalp health in New Delhi.'
        },
        {
          title: 'Holistic Evaluation',
          description: holisticText || 'DMC Trichology evaluates clinical history, lifestyle, scalp health, and other factors before treatment planning.'
        },
        {
          title: 'Patient-First Experience',
          description: patientFirstText || 'Every patient is guided through a comfortable, safe, and confidence-building treatment process.'
        },
        {
          title: 'Advanced Trichology Expertise',
          description: expertiseText || 'The centre combines advanced doctors, modern techniques, and DMC-Golden Touch hair restoration expertise.'
        }
      ],
      conclusionParagraph: stripHtml(expertiseDetails.description) || 'DMC Trichology takes pride in offering advanced technologies, expert doctors, and personalized care for hair and scalp concerns.'
    },
    educationExperience: {
      experienceTabLabel: 'Experience',
      educationTabLabel: 'Care Systems',
      credentialsTabLabel: 'Credentials',
      topImage,
      bottomImage,
      experienceItems: [
        {
          role: 'DMC Trichology Clinical Expertise',
          hospital: 'Dadu Medical Centre, New Delhi',
          duration: 'Over decades of research & practice'
        },
        {
          role: 'Holistic Hair Loss Evaluation',
          hospital: 'Clinical examination, trichoscopy, blood & hormonal evaluation',
          duration: 'Personalized treatment planning'
        },
        {
          role: 'Advanced Hair Restoration Protocols',
          hospital: 'DMC-Golden Touch and non-surgical trichology solutions',
          duration: 'Ongoing'
        }
      ],
      educationItems: [
        {
          degree: 'Comprehensive Trichology Systems',
          institution: 'Clinical analysis, scalp diagnosis, and lifestyle evaluation',
          year: 'DMC Protocol'
        },
        {
          degree: 'Patient Care Methodology',
          institution: 'Counselling, product guidance, nutrition advice, and follow-up care',
          year: 'DMC Protocol'
        }
      ]
    },
    credentialsSection: {
      heading: 'Credentials',
      credentialsList: bullets.map(text => ({ text }))
    },
    otherSpecialitiesSection: {
      heading: 'Additional Services / Specialities Section',
      introParagraph: stripHtml(expertiseDetails.description) || 'DMC Trichology offers a professional-grade range of trichology and cosmetic treatment procedures.',
      specialitiesList: bullets.map(title => ({ title })),
      conclusionParagraph: patientFirstText || 'For more information contact DMC Trichology at Vasant Vihar (South Delhi) and Rajouri Garden (West Delhi).',
      image: intro.image || primaryImage,
      imageAlt: 'DMC Trichology additional services'
    },
    testimonialsSection: {
      heading: 'Patient Testimonials',
      testimonials: [
        {
          text: 'DMC Trichology placeholder testimonial for the About Dadu Medical Centre page. Replace this with a real patient testimonial when available from the dashboard.',
          patientName: 'DMC Patient',
          disclaimer: '* Temporary placeholder. Opinions/Results may vary from person to person.',
          stars: 5
        },
        {
          text: 'DMC Trichology placeholder testimonial for the About Dadu Medical Centre page. Replace this with a real patient testimonial when available from the dashboard.',
          patientName: 'DMC Patient',
          disclaimer: '* Temporary placeholder. Opinions/Results may vary from person to person.',
          stars: 5
        },
        {
          text: 'DMC Trichology placeholder testimonial for the About Dadu Medical Centre page. Replace this with a real patient testimonial when available from the dashboard.',
          patientName: 'DMC Patient',
          disclaimer: '* Temporary placeholder. Opinions/Results may vary from person to person.',
          stars: 5
        },
        {
          text: 'DMC Trichology placeholder testimonial for the About Dadu Medical Centre page. Replace this with a real patient testimonial when available from the dashboard.',
          patientName: 'DMC Patient',
          disclaimer: '* Temporary placeholder. Opinions/Results may vary from person to person.',
          stars: 5
        }
      ]
    }
  };
}

export default function AboutDaduMedicalCentreClient({ initialData, initialFaqData = null }) {
  const templateData = useMemo(() => normalizeDaduData(initialData), [initialData]);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <AboutDrNandaniHero
        data={templateData.hero}
        breadcrumbData={templateData.breadcrumb}
        formSettings={templateData.formSettings}
        leadEndpoint="/contact"
        leadService="About Dadu Medical Centre Consultation Form"
        sectionIds={{
          hero: 'about-dadu-medical-centre-hero',
          breadcrumb: 'about-dadu-medical-centre-breadcrumb'
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
