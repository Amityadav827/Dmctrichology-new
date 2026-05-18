const mongoose = require('mongoose');

const ServiceDetailSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, default: "" },
  category: { type: String, default: "" },
  
  banner: {
    badgeText: { type: String, default: "PREMIUM TREATMENT" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    duration: { type: String, default: "" },
    rating: { type: String, default: "4.9" },
    buttonText: { type: String, default: "Book Consultation" },
    backgroundImage: { type: String, default: "" },
    secondaryTitle: { type: String, default: "" },
    tagline: { type: String, default: "" },
    shortDescription: { type: String, default: "" }
  },

  intro: {
    badgeText: { type: String, default: "ABOUT THE TREATMENT" },
    title: { type: String, default: "" },
    introHeading: { type: String, default: "" },
    rating: { type: String, default: "4.9" },
    duration: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    benefits: [{ text: { type: String } }],
    closingText: { type: String, default: "" },
    introMedia: [{
      type: { type: String, default: "image", enum: ["image", "video"] },
      url: { type: String, default: "" },
      title: { type: String, default: "" },
      alt: { type: String, default: "" },
      thumbnail: { type: String, default: "" }
    }],
    // Legacy field kept for backward compat — do not use in new code
    videos: { type: Array, default: undefined }
  },

  process: {
    sectionTitle: { type: String, default: "How it works?" },
    processSteps: [{
      stepNumber: { type: String },
      title: { type: String },
      description: { type: String },
      image: { type: String }
    }]
  },

  idealFrequency: {
    frequencyTitle: { type: String, default: "Treatment Frequency & Suitability" },
    frequencyDescription: { type: String, default: "" },
    idealForPoints: [{ type: String }],
    notIdealForPoints: [{ type: String }],
    ctaTitle: { type: String, default: "Not sure which treatment is right for YOU?" },
    ctaDescription: { type: String, default: "" },
    ctaButtonText: { type: String, default: "Book a free consultation" },
    ctaButtonLink: { type: String, default: "/contact" },
    ctaImage: { type: String, default: "" }
  },

  beforeAfter: {
    beforeTitle: { type: String, default: "Before Treatment Checklist" },
    afterTitle: { type: String, default: "Aftercare Instructions" },
    beforePoints: [{ type: String }],
    afterPoints: [{ type: String }],
    sectionBackground: { type: String, default: "#f9f7f2" }
  },

  faqEnquiry: {
    faqTitle: { type: String, default: "Common Concerns Addressed" },
    faqSubtitle: { type: String, default: "" },
    faqItems: [{
      question: { type: String },
      answer: { type: String }
    }],
    serviceOptions: [{ type: String }],
    formTitle: { type: String, default: "Enquire About This Treatment" },
    buttonText: { type: String, default: "Schedule Your Visit" }
  },

  seo: {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    schemaScript: { type: String, default: "" }
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceDetail', ServiceDetailSchema);
