const mongoose = require("mongoose");

const detailsPageSchema = new mongoose.Schema(
  {
    // ── Section 1: Banner ─────────────────────────────
    banner: {
      bannerImage: { type: String, default: "" },
      pageTitle: { type: String, default: "Service Details" },
      breadcrumbText: { type: String, default: "Details" },
      overlayOpacity: { type: Number, default: 0.3 },
    },

    // ── Section 2: Service Intro ──────────────────────
    intro: {
      badgeText: { type: String, default: "HAIR TREATMENT" },
      title: { type: String, default: "Follicular Unit Extraction (FUE)" },
      rating: { type: String, default: "4.85" },
      duration: { type: String, default: "180 mins" },
      shortDescription: { type: String, default: "Safe, smart & skin-friendly hair repair" },
      longDescription: { type: String, default: "FUE is one of the most popular and limited modern procedure techniques for hair repair. Each hair follicle is removed individually and implanted into the thinning or bald areas, making sure that it's natural volume and growth." },
      
      benefits: {
        type: [{ text: String }],
        default: [
          { text: "Best for both men and women" },
          { text: "Low scarring and recovery time" },
          { text: "Permanent, natural-looking results" }
        ]
      },

      introImages: {
        type: [{
          image: { type: String, default: "" },
          title: { type: String, default: "" },
          alt: { type: String, default: "" }
        }],
        default: []
      },

      // Legacy fields for compatibility (optional, but good to keep if they exist in DB)
      badge: { type: String },
      subTitle: { type: String },
      description: { type: String },
      closingText: { type: String },
      videoGallery: { type: Array },
      bulletPoints: { type: [String] },
    },

    // ── Section 3: Process Slider ─────────────────────
    process: {
      sectionTitle: { type: String, default: "How Full Body Laser Hair Reduction works?" },
      processSteps: {
        type: [
          {
            image: { type: String, default: "" },
            stepNumber: { type: String, default: "STEP 1" },
            title: { type: String, default: "" },
            description: { type: String, default: "" },
          }
        ],
        default: [
          { image: "", stepNumber: "STEP 1", title: "Consultation", description: "Area is marked, cleansed and shaved" },
          { image: "", stepNumber: "STEP 2", title: "Preparation", description: "ECG gel is applied to protect the skin" },
          { image: "", stepNumber: "STEP 3", title: "Treatment", description: "Laser shots target the hair follicles" },
          { image: "", stepNumber: "STEP 4", title: "Aftercare", description: "Sunscreen is applied post-treatment for protection" },
        ]
      },
    },

    // ── Section 4: Before / After Treatment ───────────
    beforeAfter: {
      beforeTitle: { type: String, default: "Before Treatment" },
      afterTitle: { type: String, default: "After Treatment" },
      beforePoints: { type: [String], default: [
        "Keep your skin hydrated in the days leading up to the treatment.",
        "Avoid direct sun exposure and tanning beds for at least one week before your appointment.",
        "Inform your provider about any medications or skin concerns you may have."
      ] },
      afterPoints: { type: [String], default: [
        "Apply a cold compress to reduce any temporary redness or swelling.",
        "Use a gentle, hydrating moisturizer and keep the area clean.",
        "Apply a broad-spectrum SPF 30+ sunscreen daily to protect the skin from UV damage."
      ] },
      sectionBackground: { type: String, default: "#EAEAF2" }
    },

    // ── Section 5: FAQ + Enquiry Form ─────────────────
    faqEnquiry: {
      faqTitle: { type: String, default: "Few Of The Common Concerns" },
      faqSubtitle: { type: String, default: "Physical Discomfort Affects Daily Life And Overall Wellbeing. At Our Physiotherapy Center, We Help You Overcome Pain, Improve Mobility, And Restore Body Function Through Professional Care And Guidance." },
      faqItems: {
        type: [{ question: String, answer: String }],
        default: [
          { question: "1. How Can Physiotherapy Help Manage Daily Body Pain?", answer: "During Your First Visit, We'll Begin With A Detailed Assessment Of Your Condition..." },
          { question: "2. Is Physiotherapy Effective For Post-Surgery Recovery?", answer: "Yes, it is highly effective..." }
        ]
      },
      formTitle: { type: String, default: "Enquiry Here Below!" },
      buttonText: { type: String, default: "Schedule Your Visit" },
      serviceOptions: { type: [String], default: ["Laser Hair Reduction", "Hair Transplant", "Skin Treatment"] }
    },

    // ── Section 6: Ideal Frequency + CTA ──────────────
    idealFrequency: {
      frequencyTitle: { type: String, default: "Ideal frequency" },
      frequencyDescription: { type: String, default: "After 6-8 sessions, 80% - 90% hair reduction can be seen" },
      idealForPoints: { type: [String], default: ["Unwanted facial/body hair", "Ingrown hair issues", "Razor bumps or shaving irritation"] },
      notIdealForPoints: { type: [String], default: ["Grey or white hair", "Pregnant or breastfeeding women", "Active skin conditions (e.g., Eczema, Psoriasis)"] },
      ctaTitle: { type: String, default: "Not sure which treatment is right for YOU?" },
      ctaDescription: { type: String, default: "We can help with that! Schedule a free online consultation with one of our expert Doctors and we'll help you create a customized plan." },
      ctaButtonText: { type: String, default: "Book a free online consultation" },
      ctaImage: { type: String, default: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png" },
      ctaButtonLink: { type: String, default: "/contact" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DetailsPage", detailsPageSchema);
