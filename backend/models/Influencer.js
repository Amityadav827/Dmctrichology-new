const mongoose = require('mongoose');

const influencerCardSchema = new mongoose.Schema({
  id: { type: String },
  videoUrl: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  ctaText: { type: String, default: 'Watch on Instagram' },
  ctaLink: { type: String, default: '#' },
  autoplay: { type: Boolean, default: false },
  muted: { type: Boolean, default: true },
  loop: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const InfluencerSchema = new mongoose.Schema({
  influencerCards: [influencerCardSchema]
}, { timestamps: true });

module.exports = mongoose.model('Influencer', InfluencerSchema);
