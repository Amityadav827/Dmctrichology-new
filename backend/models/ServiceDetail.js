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
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 1250 },
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

  contentBlocks: [{
    heading: { type: String, default: "" },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
  }],

  benefitsSection: {
    heading: { type: String, default: "Key Benefits of the Treatment" },
    image: { type: String, default: "" },
    altText: { type: String, default: "" },
    points: [{
      benefitText: { type: String, default: "" },
      sortOrder: { type: Number, default: 0 },
      isVisible: { type: Boolean, default: true }
    }]
  },

  idealCandidates: {
    sectionHeading: { type: String, default: "Ideal Candidates" },
    introText: { type: String, default: "" },
    bottomConclusionText: { type: String, default: "" },
    sectionImage: { type: String, default: "" },
    altText: { type: String, default: "" },
    bullets: [{
      bulletText: { type: String, default: "" },
      sortOrder: { type: Number, default: 0 },
      isVisible: { type: Boolean, default: true }
    }]
  },

  notCandidatesSection: {
    sectionHeading: { type: String, default: "" },
    bullets: [{
      bulletText: { type: String, default: "" },
      sortOrder: { type: Number, default: 0 },
      isVisible: { type: Boolean, default: true }
    }]
  },

  techniquesSection: {
    sectionHeading: { type: String, default: "" },
    techniques: [{
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      sortOrder: { type: Number, default: 0 },
      isVisible: { type: Boolean, default: true }
    }]
  },

  infoBlocksSection: {
    blocks: [{
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      backgroundVariant: { type: String, default: "white", enum: ["white", "cream"] },
      sortOrder: { type: Number, default: 0 },
      isVisible: { type: Boolean, default: true }
    }]
  },

  aftercareSection: {
    sectionHeading: { type: String, default: "" },
    introText: { type: String, default: "" },
    bullets: [{
      bulletText: { type: String, default: "" },
      sortOrder: { type: Number, default: 0 },
      isVisible: { type: Boolean, default: true }
    }],
    conclusionText: { type: String, default: "" }
  },

  whyChooseUsSection: {
    sectionHeading: { type: String, default: "" },
    introText: { type: String, default: "" },
    features: [{
      featureText: { type: String, default: "" },
      sortOrder: { type: Number, default: 0 },
      isVisible: { type: Boolean, default: true }
    }]
  },

  editorialFaqSection: {
    sectionSubtitle: { type: String, default: "EXPERT ANSWERS" },
    sectionTitle: { type: String, default: "EDITORIAL FAQ" },
    faqs: [{
      question: { type: String, default: "" },
      answer: { type: String, default: "" },
      sortOrder: { type: Number, default: 0 },
      isVisible: { type: Boolean, default: true }
    }]
  },

  googleReviewCta: {
    title: { type: String, default: "Google Review" },
    buttonText: { type: String, default: "VIEW MORE" },
    buttonLink: { type: String, default: "" },
    backgroundColor: { type: String, default: "" },
    isVisible: { type: Boolean, default: true }
  },

  resultsSection: {
    subtitle: { type: String, default: "BEFORE AND AFTER" },
    title: { type: String, default: "RESULTS THAT SPEAK FOR THEMSELVES" },
    cards: [{
      title: { type: String, default: "" },
      beforeImg: { type: String, default: "" },
      afterImg: { type: String, default: "" },
      sessions: { type: String, default: "" }
    }],
    buttonText: { type: String, default: "VIEW ALL" },
    buttonLink: { type: String, default: "" },
    isVisible: { type: Boolean, default: true }
  },

  videosSection: {
    title: { type: String, default: "VIDEOS" },
    videos: [{
      thumbnail: { type: String, default: "" },
      videoUrl: { type: String, default: "" },
      title: { type: String, default: "" }
    }],
    buttonText: { type: String, default: "VIEW MORE" },
    buttonLink: { type: String, default: "" },
    isVisible: { type: Boolean, default: true }
  },

  enquirySection: {
    title: { type: String, default: "Enquire About This Treatment" },
    description: { type: String, default: "" },
    serviceOptions: [{ type: String }],
    submitButtonText: { type: String, default: "Schedule Your Visit" },
    backgroundColor: { type: String, default: "" },
    isVisible: { type: Boolean, default: true }
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
