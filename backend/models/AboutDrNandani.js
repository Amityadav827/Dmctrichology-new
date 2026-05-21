const mongoose = require('mongoose');

const AboutDrNandaniSchema = new mongoose.Schema({
  hero: {
    badge: { type: String, default: "PIONEERING TRICHOLOGY & DERMATOLOGY" },
    title: { type: String, default: "Dr. Nandani Dadu" },
    subtitle: { type: String, default: "MD (Dermatology), Founder & Director. A pioneering hair transplant surgeon and dermatologist bringing elite clinical precision to customized hair restoration." },
    credentials: { 
      type: [String], 
      default: [
        "MD - Dermatology, Venereology & Leprosy",
        "Gold Medalist in Aesthetic Dermatology",
        "15+ Years of Clinical Expertise",
        "5,000+ Successful Hair Transformations"
      ] 
    },
    image: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png" },
    ctaText: { type: String, default: "Book Luxury Consultation" }
  },
  
  intro: {
    heading: { type: String, default: "Delhi's Premier Hair Specialist & Clinical Director" },
    description: { 
      type: String, 
      default: "<p>Dr. Nandani Dadu is highly regarded as one of India's finest hair restoration specialists, merging state-of-the-art US-FDA approved technologies with refined artistic precision. As the Clinical Director, she has spent over a decade perfecting custom trichological protocols that deliver exceptional, natural-looking hair density.</p><p>Her signature therapies combine advanced cellular growth treatments, high-density FUE transplants, and custom scalp rejuvenation programs designed uniquely for each patient's physiological profile.</p>" 
    },
    bulletList: {
      type: [String],
      default: [
        "Clinical expertise with 15+ years of specialized hair treatment experience.",
        "Customized high-density hairline designs backed by medical science.",
        "State-of-the-art clinical theater with advanced sterile protocols.",
        "Comprehensive pre-and-post care guidance for long-term retention."
      ]
    },
    ctaText: { type: String, default: "Discover Signature Treatments" }
  },

  formSettings: {
    title: { type: String, default: "Request Private Consultation" },
    subtitle: { type: String, default: "Reserve your bespoke scalp assessment and consultation session." },
    successMessage: { type: String, default: "Your consultation request has been successfully submitted to Dr. Nandani Dadu's private desk. Our concierge team will reach out to you shortly." }
  },

  seo: {
    metaTitle: { type: String, default: "Dr. Nandani Dadu | Best Hair Restoration Specialist & Trichologist" },
    metaDescription: { type: String, default: "Consult Delhi's premier hair restoration specialist, Dr. Nandani Dadu. Experience luxury clinical consultations, high-density transplants, and customized scalp treatments." },
    ogImage: { type: String, default: "" }
  }
}, { timestamps: true, collection: 'aboutdrnandani' });

module.exports = mongoose.model('AboutDrNandani', AboutDrNandaniSchema);
