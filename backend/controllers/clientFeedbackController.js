const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'client_feedback';

const fallbackData = {
  hero: {
    isEnabled: true,
    pageTitle: 'Client Feedback',
    breadcrumbLabel: 'Client Feedback',
    backgroundColor: '#EEF0FA'
  },
  feedbackSection: {
    isEnabled: true,
    itemsPerPage: 15,
    cards: []
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogImage: ''
  }
};

const normalizeCard = (card = {}, index = 0) => ({
  image: card.image || card.clientImage || '',
  clientImage: card.clientImage || card.image || '',
  clientName: card.clientName || card.name || '',
  name: card.name || card.clientName || '',
  feedbackText: card.feedbackText || card.feedback || card.description || '',
  feedback: card.feedback || card.feedbackText || card.description || '',
  rating: Number.isFinite(Number(card.rating)) ? Number(card.rating) : 5,
  location: card.location || '',
  sortOrder: Number.isFinite(Number(card.sortOrder)) ? Number(card.sortOrder) : (index + 1) * 10,
  isActive: card.isActive !== false
});

const normalizePayload = (source = fallbackData) => ({
  hero: {
    ...fallbackData.hero,
    ...(source.hero || {})
  },
  feedbackSection: {
    ...fallbackData.feedbackSection,
    ...(source.feedbackSection || {}),
    itemsPerPage: Math.max(1, Number(source.feedbackSection?.itemsPerPage || fallbackData.feedbackSection.itemsPerPage)),
    cards: Array.isArray(source.feedbackSection?.cards)
      ? source.feedbackSection.cards.map(normalizeCard)
      : []
  },
  seo: {
    ...fallbackData.seo,
    ...(source.seo || {})
  }
});

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
      data: normalizePayload(row?.data || fallbackData),
      isFallback: !row
    });
  } catch (error) {
    console.error('Error fetching Client Feedback settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const payload = normalizePayload(req.body || fallbackData);

    const { error } = await supabase
      .from('cms_sections')
      .upsert({ key: CMS_KEY, data: payload, updated_at: new Date() }, { onConflict: 'key' });

    if (error) throw error;

    return res.status(200).json({ success: true, data: payload, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating Client Feedback settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const publicUrl = await uploadToSupabase(req.file, 'client_feedback_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading Client Feedback asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
