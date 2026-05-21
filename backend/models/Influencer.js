const mongoose = require('mongoose');

const influencerCardSchema = new mongoose.Schema({
  id: { type: String },
  videoUrl: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  influencerName: { type: String, default: '' },
  caption: { type: String, default: '' },
  instagramLink: { type: String, default: '#' },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const InfluencerSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Influencers' },
    breadcrumbText: { type: String, default: 'Influencers' },
    backgroundColor: { type: String, default: '#3b5998' },
    overlayOpacity: { type: Number, default: 0.55 },
    bannerHeight: { type: String, default: '420px' },
    bannerImage: { type: String, default: '' },
    ctaText: { type: String, default: 'Watch Stories' },
    ctaLink: { type: String, default: '#influencer-showcase' }
  },
  influencerCards: [influencerCardSchema]
}, { timestamps: true });

module.exports = mongoose.model('Influencer', InfluencerSchema);
