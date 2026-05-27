const supabase = require('../config/supabase');
const { aboutUsFallback } = require('../utils/aboutUsFallback');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'about_us';

// Get About Us data
exports.getAboutUs = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!row) {
      return res.status(200).json({ success: true, data: aboutUsFallback, isFallback: true });
    }
    res.status(200).json({ success: true, data: row.data || {} });
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update About Us data
exports.updateAboutUs = async (req, res) => {
  try {
    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: req.body, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;
    res.status(200).json({ success: true, data: req.body, message: 'About Us updated successfully' });
  } catch (error) {
    console.error('Error updating About Us data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadTestimonialImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const publicUrl = await uploadToSupabase(req.file, 'about_us_testimonials');
    res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Testimonial image upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
