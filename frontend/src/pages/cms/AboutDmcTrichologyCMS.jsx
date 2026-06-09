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

function normalizeAboutDmcData(source = {}) {
  const hero = source.hero || {};
  const timeline = source.timeline || {};
  const holistic = source.holisticApproach || {};
  const patientFirst = source.patientFirstApproach || {};
  const expertise = source.ourExpertise || {};
  const expertiseDetails = source.expertiseDetails || {};
  const legacyDescription = hero.description || source.intro?.sectionDescription || "";
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
    timeline: {
      ...timeline,
      eyebrow: timeline.eyebrow || "TRUSTED CARE SERVICES",
      heading: timeline.heading || patientFirst.heading || "PATIENT-FIRST APPROACH",
      steps: Array.isArray(timeline.steps) && timeline.steps.length > 0
        ? timeline.steps
        : legacyTimelineSteps
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
      normalizeData={normalizeAboutDmcData}
    />
  );
}
