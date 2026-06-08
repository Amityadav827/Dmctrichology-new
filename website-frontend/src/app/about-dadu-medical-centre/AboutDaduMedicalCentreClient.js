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

function hasFaqContent(faqSection) {
  return Boolean(
    faqSection?.categories?.some(category => Array.isArray(category.faqs) && category.faqs.length > 0) ||
    faqSection?.faqItems?.length ||
    faqSection?.faqs?.length
  );
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
  const directSpecialist = pageData.specialist || {};
  const directTimeline = pageData.timeline || {};
  const directTrust = pageData.trustSection || {};
  const directEducation = pageData.educationExperience || {};
  const directCredentials = pageData.credentialsSection || {};
  const directOther = pageData.otherSpecialitiesSection || {};
  const directTestimonials = pageData.testimonialsSection || {};
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

  const introDescription = hero.description || intro.sectionDescription || hairCentre.description || '';
  const hairCentreText = hairCentre.description || '';
  const holisticText = holistic.description || '';
  const patientFirstText = patientFirst.description || '';
  const expertiseText = expertise.description || expertiseDetails.description || '';
  const expertiseDetailsText = expertiseDetails.description || expertiseText;

  return {
    hero: {
      ...hero,
      mainHeading: hero.mainHeading || hero.badgeText || 'ABOUT DMC TRICHOLOGY',
      doctorName: hero.doctorName || hero.heading || hero.mainHeading || 'About DMC Trichology',
      degreeText: hero.degreeText || hero.subtitle || "INDIA'S PREMIUM HAIR & SCALP SPECIALIST SOLUTION",
      descriptionParagraph: hero.descriptionParagraph || introDescription || 'DMC Trichology provides advanced skin and hair treatment procedures with a patient-first clinical approach.',
      mainImage: hero.mainImage || hero.galleryImage || hero.doctorImage || hero.leftImage || hero.heroImage || hero.backgroundImage || primaryImage,
      doctorImage: hero.doctorImage || hero.leftImage || hero.heroImage || primaryImage,
      galleryImage: hero.galleryImage || hero.leftImage || hero.heroImage || primaryImage,
      submitButtonText: hero.submitButtonText || 'Schedule Your Visit'
    },
    breadcrumb: {
      title: hero.mainHeading || 'About DMC Trichology',
      parentLabel: 'Home',
      parentUrl: '/',
      currentPageText: hero.mainHeading || 'About DMC Trichology'
    },
    formSettings: {
      ...(pageData.formSettings || {}),
      title: pageData.formSettings?.title || hero.formTitle || 'Request Private Consultation',
      subtitle: pageData.formSettings?.subtitle || hero.subtitle || 'Reserve your DMC Trichology consultation session.',
      successMessage: pageData.formSettings?.successMessage || 'Your consultation request has been successfully submitted. Our team will reach out to you shortly.'
    },
    specialist: {
      ...directSpecialist,
      heading: directSpecialist.heading || intro.sectionHeading || hairCentre.heading || 'Why Choose Dadu Medical Centre',
      description1: directSpecialist.description1 || hairCentreText || 'DMC Trichology focuses on scalp and hair health with advanced clinical science and patient-centred care.',
      description2: directSpecialist.description2 || holisticText || 'Our trichology experts evaluate hair loss concerns in detail and recommend personalized treatment plans.',
      highlightedText: directSpecialist.highlightedText || expertiseDetails.heading || expertise.heading || 'DMC Trichology offers advanced hair and scalp solutions including:',
      bullets: directSpecialist.bullets?.length ? directSpecialist.bullets : bullets,
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
      ...directTimeline,
      eyebrow: 'TRUSTED CARE SERVICES',
      eyebrow: directTimeline.eyebrow || 'TRUSTED CARE SERVICES',
      heading: directTimeline.heading || patientFirst.heading || holistic.heading || 'Key Highlights Section',
      sectionBgColor: '#FFFFFF',
      steps: directTimeline.steps?.length ? directTimeline.steps : [
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
      ...directTrust,
      eyebrow: 'TRUSTED CARE SERVICES',
      eyebrow: directTrust.eyebrow || 'TRUSTED CARE SERVICES',
      heading: directTrust.heading || expertise.heading || 'Trust & Expertise Section',
      image: directTrust.image || holistic.image || primaryImage,
      imageAlt: directTrust.imageAlt || holistic.imageAlt || 'DMC Trichology clinical care',
      trustPoints: directTrust.trustPoints?.length ? directTrust.trustPoints : [
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
      conclusionParagraph: directTrust.conclusionParagraph || expertiseDetailsText || 'DMC Trichology takes pride in offering advanced technologies, expert doctors, and personalized care for hair and scalp concerns.'
    },
    educationExperience: {
      ...directEducation,
      experienceTabLabel: directEducation.experienceTabLabel || 'Experience',
      educationTabLabel: directEducation.educationTabLabel || 'Care Systems',
      credentialsTabLabel: directEducation.credentialsTabLabel || 'Credentials',
      topImage: directEducation.topImage || topImage,
      bottomImage: directEducation.bottomImage || bottomImage,
      experienceItems: directEducation.experienceItems?.length ? directEducation.experienceItems : [
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
      educationItems: directEducation.educationItems?.length ? directEducation.educationItems : [
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
      ...directCredentials,
      heading: directCredentials.heading || expertiseDetails.heading || 'Credentials',
      credentialsList: directCredentials.credentialsList?.length ? directCredentials.credentialsList : bullets.map(text => ({ text })),
      leftHeading: directCredentials.leftHeading || hairCentre.heading || 'Expertise',
      leftText: directCredentials.leftText || hairCentreText,
      rightHeading: directCredentials.rightHeading || patientFirst.heading || 'Commitment',
      rightText: directCredentials.rightText || patientFirstText,
      bannerImage: directCredentials.bannerImage || expertise.backgroundImage || primaryImage
    },
    otherSpecialitiesSection: {
      ...directOther,
      heading: directOther.heading || 'Additional Services / Specialities Section',
      introParagraph: directOther.introParagraph || expertiseDetailsText || 'DMC Trichology offers a professional-grade range of trichology and cosmetic treatment procedures.',
      specialitiesList: directOther.specialitiesList?.length ? directOther.specialitiesList : bullets.map(title => ({ title })),
      conclusionParagraph: directOther.conclusionParagraph || patientFirstText || 'For more information contact DMC Trichology at Vasant Vihar (South Delhi) and Rajouri Garden (West Delhi).',
      image: directOther.image || intro.image || primaryImage,
      imageAlt: directOther.imageAlt || 'DMC Trichology additional services'
    },
    testimonialsSection: {
      ...directTestimonials,
      heading: directTestimonials.heading || 'Patient Testimonials',
      testimonials: directTestimonials.testimonials?.length ? directTestimonials.testimonials : [
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
    },
    faqSection: pageData.faqSection || null
  };
}

export default function AboutDaduMedicalCentreClient({ initialData, initialFaqData = null }) {
  const templateData = useMemo(() => normalizeDaduData(initialData), [initialData]);
  const faqData = hasFaqContent(templateData?.faqSection)
    ? templateData.faqSection
    : initialFaqData;

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
      <FaqSection initialData={faqData} />
    </main>
  );
}
