const mongoose = require('mongoose');

const FeatureItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  link: { type: String, default: '' },
  enabled: { type: Boolean, default: true }
});

const MarqueeFeatureSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  backgroundColor: { type: String, default: 'transparent' },
  paddingTop: { type: String, default: '60px' },
  paddingBottom: { type: String, default: '60px' },
  marqueeSpeed: { type: Number, default: 30 },
  pauseOnHover: { type: Boolean, default: true },
  items: { type: [FeatureItemSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('MarqueeFeature', MarqueeFeatureSchema);
