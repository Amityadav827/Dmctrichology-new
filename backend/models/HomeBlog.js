const mongoose = require('mongoose');

const homeBlogSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'OUR LATEST BLOGS' },
  heading: { type: String, default: 'News & Wellness Advice' },
  subtitle: { type: String, default: 'Our Expert Therapists Work With You To Create Tailored Recovery Plans That Target Your Specific Needs And Goals.' },
  blogs: [
    {
      image: String,
      date: String,
      author: String,
      authorIcon: String,
      title: String,
      buttonText: { type: String, default: 'Explore More' },
      buttonLink: { type: String, default: '#' },
      featured: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('HomeBlog', homeBlogSchema);
