const AboutUs = require('../models/AboutUs');
const { aboutUsFallback } = require('../utils/aboutUsFallback');

// Get About Us data
exports.getAboutUs = async (req, res) => {
  try {
    const aboutData = await AboutUs.findOne();
    if (!aboutData) {
      return res.status(200).json({ success: true, data: aboutUsFallback, isFallback: true });
    }
    res.status(200).json({ success: true, data: aboutData });
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update About Us data
exports.updateAboutUs = async (req, res) => {
  try {
    const updateData = req.body;
    const aboutData = await AboutUs.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, data: aboutData, message: "About Us updated successfully" });
  } catch (error) {
    console.error('Error updating About Us data:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const uploadToSupabase = require('../utils/uploadToSupabase');

exports.uploadTestimonialImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }
    const publicUrl = await uploadToSupabase(req.file, 'about_us_testimonials');
    res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Testimonial image upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
