const mongoose = require('mongoose');

const AboutDrNiveditaSchema = new mongoose.Schema({
  hero: {
    backgroundImage: { type: String, default: '' },
    doctorImage: { type: String, default: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png' },
    mainHeading: { type: String, default: 'EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI' },
    doctorName: { type: String, default: 'Dr. Nivedita Dadu' },
    degreeText: { type: String, default: 'MBBS, MD (Dermatology)' },
    descriptionParagraph: { type: String, default: 'Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence. As the co-founder of DMC Trichology, she combines cutting-edge dermatological expertise with advanced hair restoration science to deliver transformative results for her patients.' },
    namePlaceholder: { type: String, default: 'Name*' },
    phonePlaceholder: { type: String, default: 'Mobile Number*' },
    emailPlaceholder: { type: String, default: 'E-Mail Address*' },
    datePlaceholder: { type: String, default: 'Select Preferred Date*' },
    messagePlaceholder: { type: String, default: 'Enter Your Message Here' },
    captchaPlaceholder: { type: String, default: 'Code*' },
    submitButtonText: { type: String, default: 'Schedule Your Visit' },
    backgroundColor: { type: String, default: '#3b5998' },
    overlayOpacity: { type: Number, default: 0.45 }
  },
  breadcrumb: {
    parentLabel: { type: String, default: 'Home' },
    parentUrl: { type: String, default: '/' },
    currentPageText: { type: String, default: 'About Dr Nivedita Dadu' },
    backgroundColor: { type: String, default: '#f8f9fa' }
  },
  specialist: {
    heading: { type: String, default: 'Best Dermatologist & Hair Specialist in Delhi' },
    description1: { type: String, default: 'Dr. Nivedita Dadu is a distinguished dermatologist and trichologist recognized for her exceptional patient outcomes and research contributions. A fellow of prestigious dermatological societies, she brings unparalleled clinical depth to every patient interaction at DMC Trichology.' },
    description2: { type: String, default: 'Combining her mastery in dermatology with advanced trichological sciences, Dr. Nivedita delivers comprehensive scalp health solutions — from non-surgical hair restoration therapies to advanced diagnostic protocols — ensuring each patient receives the most effective, evidence-based care.' },
    highlightedText: { type: String, default: 'She specializes in cutting-edge treatments including:' },
    bullets: {
      type: [String],
      default: [
        'Advanced PRP & GFC Therapy',
        'FUE Hair Transplant Surgery',
        'Scalp Micropigmentation',
        'LLLT (Laser Hair Therapy)',
        'Custom Trichological Protocols'
      ]
    },
    sectionBgColor: { type: String, default: '#ffffff' },
    cardBgColor: { type: String, default: '#3b5998' }
  },
  seo: {
    metaTitle: { type: String, default: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist in Delhi' },
    metaDescription: { type: String, default: 'Consult Dr. Nivedita Dadu, renowned Dermatologist and Trichologist at DMC Trichology Delhi. Expert in advanced hair restoration, scalp treatments, and dermatological care.' },
    ogImage: { type: String, default: '' }
  }
}, { timestamps: true, collection: 'aboutdrnivedita' });

module.exports = mongoose.model('AboutDrNivedita', AboutDrNiveditaSchema);
