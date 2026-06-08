const mongoose = require('mongoose');

const FooterSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  columns: [
    {
      id: String,
      title: String,
      links: [
        {
          id: String,
          label: String,
          url: String
        }
      ]
    }
  ],
  contact: {
    heading: { type: String, default: "Contact Us" },
    address1: { type: String, default: "C-2/13, Ashok Vihar Phase II," },
    address2: { type: String, default: "Delhi, 110052" },
    phone1: { type: String, default: "+91 91191 19011" },
    phone2: { type: String, default: "+91 91191 19012" },
    email: { type: String, default: "info@dmctrichology.com" }
  },
  disclaimer: { type: String, default: "Disclaimer: All treatments and results vary for each individual. Please consult our experts for personalized advice." },
  newsletter: {
    heading: { type: String, default: "Subscribe to Our Newsletter" },
    description: { type: String, default: "Get the latest hair wellness advice and exclusive offers delivered to your inbox." },
    placeholder: { type: String, default: "Your Email Address" },
    buttonText: { type: String, default: "SUBSCRIBE" },
    checkboxLabel: { type: String, default: "I agree to the privacy policy" }
  },
  branding: {
    logo: { type: String, default: "" },
    aboutText: { type: String, default: "DMC Trichology is a leading clinic specializing in advanced hair restoration and wellness treatments." }
  },
  socials: [
    {
      id: String,
      icon: String,
      url: String
    }
  ],
  bottomFooter: {
    copyright: { type: String, default: "© 2026 DMC Trichology. All Rights Reserved." },
    termsText: { type: String, default: "Terms of Service" },
    termsLink: { type: String, default: "/terms" },
    privacyText: { type: String, default: "Privacy Policy" },
    privacyLink: { type: String, default: "/privacy" }
  }
}, { timestamps: true });

module.exports = mongoose.model('Footer', FooterSchema);
