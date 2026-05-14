const mongoose = require('mongoose');

const AboutUsSchema = new mongoose.Schema({
  hero: {
    badge: { type: String, default: "ABOUT DMC TRICHOLOGY" },
    title: { type: String, default: "Experience the Pinnacle of Hair Care" },
    subtitle: { type: String, default: "Our mission is to restore confidence through world-class trichology expertise and personalized care." },
    backgroundImage: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    stats: [{
      label: { type: String },
      value: { type: String },
      suffix: { type: String }
    }]
  },
  
  story: {
    sectionTitle: { type: String, default: "Our Story" },
    heading: { type: String, default: "Pioneering the Future of Hair Restoration" },
    description: { type: String, default: "" },
    mainImage: { type: String, default: "" },
    secondaryImage: { type: String, default: "" },
    experienceYears: { type: Number, default: 15 },
    points: [{ text: { type: String } }]
  },

  journey: {
    sectionTitle: { type: String, default: "Our Journey" },
    milestones: [{
      year: { type: String },
      title: { type: String },
      description: { type: String }
    }]
  },

  vision: {
    sectionTitle: { type: String, default: "Vision & Values" },
    visionText: { type: String, default: "" },
    missionText: { type: String, default: "" },
    values: [{
      icon: { type: String },
      title: { type: String },
      description: { type: String }
    }]
  },

  experts: {
    sectionTitle: { type: String, default: "Meet Our Experts" },
    heading: { type: String, default: "The Hands Behind Your Transformation" },
    team: [{
      name: { type: String },
      designation: { type: String },
      specialization: { type: String },
      image: { type: String },
      bio: { type: String }
    }]
  },

  testimonials: {
    sectionTitle: { type: String, default: "Patient Stories" },
    reviews: [{
      patientName: { type: String },
      reviewText: { type: String },
      rating: { type: Number, default: 5 },
      image: { type: String },
      treatment: { type: String }
    }]
  },

  seo: {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" }
  }
}, { timestamps: true, collection: 'aboutus' });

module.exports = mongoose.model('AboutUs', AboutUsSchema);
