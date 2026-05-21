const mongoose = require('mongoose');

const mediaCardSchema = new mongoose.Schema({
  id: { type: String },
  mediaImage: { type: String, default: '' },
  mediaLogo: { type: String, default: '' },
  mediaTitle: { type: String, default: '' },
  mediaLink: { type: String, default: '#' },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const PressMediaSchema = new mongoose.Schema({
  // ── Hero section (for the /press-media page) ──────────────────────
  hero: {
    title: { type: String, default: 'Press & Media' },
    breadcrumbText: { type: String, default: 'Press & Media' },
    bannerImage: { type: String, default: '' },
    backgroundColor: { type: String, default: '#3b5998' },
    overlayOpacity: { type: Number, default: 0.55 },
    bannerHeight: { type: String, default: '420px' },
  },

  // ── Media showcase cards (for the /press-media page) ──────────────
  mediaCards: [mediaCardSchema],

  // ── Legacy home-page press-media section fields ────────────────────
  enabled: { type: Boolean, default: true },
  heading: { type: String, default: 'WHAT THE PRESS AND MEDIA ARE SAYING ABOUT OUR CLINIC' },
  ratingText: { type: String, default: '4.9 Rating' },
  patientCountText: { type: String, default: '5000+ Satisfied Patients' },
  button: {
    text: { type: String, default: 'EXPLORE MEDIA' },
    link: { type: String, default: '/press-media' },
  },
  avatars: [
    { id: String, image: String }
  ],
  mediaLogos: [
    { id: String, image: String, title: String, link: String }
  ],
}, { timestamps: true });

module.exports = mongoose.model('PressMedia', PressMediaSchema);
