const mongoose = require('mongoose');

const homeFaqSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'TRUSTED CARE SERVICES' },
  heading: { type: String, default: 'Frequently Asked Question?' },
  categories: [
    {
      title: String,
      faqs: [
        {
          icon: String,
          question: String,
          answer: String
        }
      ]
    }
  ],
  buttonText: { type: String, default: 'View All Questions' },
  buttonLink: { type: String, default: '#' }
}, { timestamps: true });

module.exports = mongoose.model('HomeFAQ', homeFaqSchema);
