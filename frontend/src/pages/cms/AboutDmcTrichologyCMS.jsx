import React from "react";
import DoctorTemplateCMS from "./DoctorTemplateCMS";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function richParagraphs(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/<\/?[a-z][\s\S]*>/i.test(text)) return text;

  return text
    .split(/\n+/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function normalizeFormText(value = "", fallback = "", legacyValues = []) {
  const text = String(value || "").trim();
  if (!text || legacyValues.includes(text)) return fallback;
  return text;
}

function normalizeAboutDmcData(source = {}) {
  const hero = source.hero || {};
  const formSettings = source.formSettings || {};
  const timeline = source.timeline || {};
  const educationExperience = source.educationExperience || {};
  const credentialsSection = source.credentialsSection || {};
  const otherSpecialitiesSection = source.otherSpecialitiesSection || {};
  const holistic = source.holisticApproach || {};
  const patientFirst = source.patientFirstApproach || {};
  const expertise = source.ourExpertise || {};
  const expertiseDetails = source.expertiseDetails || {};
  const infrastructure = source.infrastructure || {};
  const gallery = Array.isArray(infrastructure.gallery) ? infrastructure.gallery : [];
  const firstGalleryImage = gallery[0]?.image || gallery[0]?.url || "";
  const secondGalleryImage = gallery[1]?.image || gallery[1]?.url || "";
  const heroImage = hero.mainImage || hero.galleryImage || hero.doctorImage || hero.leftImage || hero.heroImage || hero.backgroundImage || source.intro?.image || holistic.image || firstGalleryImage || "";
  const legacyDescription = hero.description || source.intro?.sectionDescription || "";
  const bulletPoints = Array.isArray(expertiseDetails.bulletPoints) ? expertiseDetails.bulletPoints : [];
  const legacyTimelineSteps = [
    {
      icon: "",
      title: "Holistic & Integrative Approach",
      description: holistic.description || ""
    },
    {
      icon: "",
      title: "Patient-First Approach",
      description: patientFirst.description || ""
    },
    {
      icon: "",
      title: "Advanced Expertise",
      description: expertise.description || expertiseDetails.description || ""
    }
  ].filter(step => step.title || step.description);
  const fallbackExperienceItems = [
    {
      role: "DMC Trichology Clinical Expertise",
      hospital: "Dadu Medical Centre, New Delhi",
      duration: "Over decades of research & practice"
    },
    {
      role: "Holistic Hair Loss Evaluation",
      hospital: "Clinical examination, trichoscopy, blood & hormonal evaluation",
      duration: "Personalized treatment planning"
    },
    {
      role: "Advanced Hair Restoration Protocols",
      hospital: "DMC-Golden Touch and non-surgical trichology solutions",
      duration: "Ongoing"
    }
  ];
  const fallbackEducationItems = [
    {
      degree: "Comprehensive Trichology Systems",
      institution: "Clinical analysis, scalp diagnosis, and lifestyle evaluation",
      year: "DMC Protocol"
    },
    {
      degree: "Patient Care Methodology",
      institution: "Counselling, product guidance, nutrition advice, and follow-up care",
      year: "DMC Protocol"
    }
  ];
  const specialitiesList = Array.isArray(otherSpecialitiesSection.specialitiesList) && otherSpecialitiesSection.specialitiesList.length > 0
    ? otherSpecialitiesSection.specialitiesList
    : bulletPoints.map(title => ({ title }));

  return {
    ...source,
    hero: {
      ...hero,
      mainHeading: hero.mainHeading || hero.badgeText || "",
      doctorName: hero.doctorName || hero.heading || hero.mainHeading || "",
      degreeText: hero.degreeText || hero.subtitle || "",
      descriptionParagraph: hero.descriptionParagraph || richParagraphs(legacyDescription),
      mainImage: hero.mainImage || hero.galleryImage || hero.doctorImage || hero.leftImage || hero.heroImage || hero.backgroundImage || ""
    },
    breadcrumb: {
      ...(source.breadcrumb || {}),
      title: source.breadcrumb?.title || hero.mainHeading || hero.badgeText || "",
      currentPageText: source.breadcrumb?.currentPageText || hero.mainHeading || hero.badgeText || ""
    },
    formSettings: {
      ...formSettings,
      title: normalizeFormText(formSettings.title || hero.formTitle, "Request Private Consultation", ["About DMC Trichology®", "About DMC Trichology"]),
      subtitle: normalizeFormText(formSettings.subtitle || hero.subtitle, "Reserve your bespoke scalp assessment and consultation session.", ["INDIA'S PREMIUM HAIR & SCALP SPECIALIST SOLUTION"])
    },
    timeline: {
      ...timeline,
      eyebrow: timeline.eyebrow || "TRUSTED CARE SERVICES",
      heading: timeline.heading || patientFirst.heading || "PATIENT-FIRST APPROACH",
      steps: Array.isArray(timeline.steps) && timeline.steps.length > 0
        ? timeline.steps
        : legacyTimelineSteps
    },
    educationExperience: {
      ...educationExperience,
      experienceTabLabel: educationExperience.experienceTabLabel || "Experience",
      educationTabLabel: educationExperience.educationTabLabel || "Care Systems",
      credentialsTabLabel: educationExperience.credentialsTabLabel || "Credentials",
      topImage: educationExperience.topImage || firstGalleryImage || holistic.image || heroImage,
      bottomImage: educationExperience.bottomImage || secondGalleryImage || source.intro?.image || heroImage,
      experienceItems: Array.isArray(educationExperience.experienceItems) && educationExperience.experienceItems.length > 0
        ? educationExperience.experienceItems
        : fallbackExperienceItems,
      educationItems: Array.isArray(educationExperience.educationItems) && educationExperience.educationItems.length > 0
        ? educationExperience.educationItems
        : fallbackEducationItems
    },
    credentialsSection: {
      ...credentialsSection,
      heading: credentialsSection.heading || expertiseDetails.heading || "Credentials",
      credentialsList: Array.isArray(credentialsSection.credentialsList) && credentialsSection.credentialsList.length > 0
        ? credentialsSection.credentialsList
        : bulletPoints.map(text => ({ text })),
      leftHeading: credentialsSection.leftHeading || source.hairTreatmentCentre?.heading || "Expertise",
      leftText: credentialsSection.leftText || source.hairTreatmentCentre?.description || "",
      rightHeading: credentialsSection.rightHeading || patientFirst.heading || "Commitment",
      rightText: credentialsSection.rightText || patientFirst.description || "",
      bannerImage: credentialsSection.bannerImage || expertise.backgroundImage || heroImage
    },
    otherSpecialitiesSection: {
      ...otherSpecialitiesSection,
      heading: otherSpecialitiesSection.heading || expertiseDetails.heading || "Other Specialities",
      introParagraph: otherSpecialitiesSection.introParagraph || expertiseDetails.description || expertise.description || "",
      specialitiesList,
      conclusionParagraph: otherSpecialitiesSection.conclusionParagraph || patientFirst.description || "",
      image: otherSpecialitiesSection.image || source.intro?.image || firstGalleryImage || heroImage,
      imageAlt: otherSpecialitiesSection.imageAlt || "DMC Trichology other specialities"
    }
  };
}

export default function AboutDmcTrichologyCMS() {
  return (
    <DoctorTemplateCMS
      endpoint="/about-dmc-trichology"
      uploadEndpoint="/about-dmc-trichology/upload-image"
      title="About DMC Trichology CMS"
      previewPath="/about-dadu-medical-centre"
      singleEducationImage
      normalizeData={normalizeAboutDmcData}
    />
  );
}
