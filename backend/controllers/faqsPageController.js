const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'faqs_page';

const fallbackData = {
  hero: {
    isEnabled: true,
    backgroundImage: '',
    pageTitle: 'Frequently Asked Questions',
    breadcrumbLabel: 'Frequently Asked Questions',
    overlayOpacity: 0.64
  },
  faqSection: {
    isEnabled: true,
    faqs: []
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections')
      .select('data')
      .eq('key', CMS_KEY)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return res.status(200).json({
      success: true,
      data: row?.data || fallbackData,
      isFallback: !row
    });
  } catch (error) {
    console.error('Error fetching FAQs page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const payload = {
      hero: { ...fallbackData.hero, ...(req.body?.hero || {}) },
      faqSection: {
        ...fallbackData.faqSection,
        ...(req.body?.faqSection || {}),
        faqs: Array.isArray(req.body?.faqSection?.faqs) ? req.body.faqSection.faqs : []
      }
    };

    const { error } = await supabase
      .from('cms_sections')
      .upsert({ key: CMS_KEY, data: payload, updated_at: new Date() }, { onConflict: 'key' });

    if (error) throw error;

    return res.status(200).json({ success: true, data: payload, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating FAQs page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const publicUrl = await uploadToSupabase(req.file, 'faqs_page_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading FAQs page asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
