const mongoose = require('mongoose');

const treatmentPlanSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'TREATMENT PLAN' },
  heading: { type: String, default: 'Know the Right Treatment for You' },
  cards: [
    {
      image: String,
      title: String,
      description: String,
      buttonText: { type: String, default: 'TAKE THE TEST' },
      buttonLink: { type: String, default: '#' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('TreatmentPlan', treatmentPlanSchema);
