const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'real_results';

const resultImage = 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/bif89jyygbycclg8qa92.png';

const defaultCards = [
  ['Korean Facial Illumination', 'After 6 sessions'],
  ['Acne Arrestor Facial With Salicylic Peel', 'After 4 sessions'],
  ['Elastin Boost Facial', 'After 5 sessions'],
  ['Derma Revive Facial', 'After 4 sessions'],
  ['Hair Growth Restoration', 'After 6 sessions'],
  ['Scalp Renewal Therapy', 'After 5 sessions'],
  ['PRP Hair Treatment', 'After 4 sessions'],
  ['Golden Touch Result', 'After 6 sessions']
].map(([treatmentName, sessionsText], index) => ({
  treatmentName,
  title: treatmentName,
  image: resultImage,
  sessionsText,
  sortOrder: (index + 1) * 10,
  isActive: true
}));

const fallbackData = {
  hero: {
    isEnabled: true,
    pageTitle: 'Real Results',
    breadcrumbLabel: 'Real Results',
    backgroundColor: '#EEF0FA'
  },
  resultsSection: {
    isEnabled: true,
    cards: defaultCards
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogImage: ''
  }
};

const normalizeCard = (card = {}, index = 0) => ({
  treatmentName: card.treatmentName || card.title || '',
  title: card.title || card.treatmentName || '',
  image: card.image || card.resultImage || card.afterImage || card.beforeImage || '',
  sessionsText: card.sessionsText || card.sessions || card.description || '',
  sessions: card.sessions || card.sessionsText || card.description || '',
  sortOrder: Number.isFinite(Number(card.sortOrder)) ? Number(card.sortOrder) : (index + 1) * 10,
  isActive: card.isActive !== false
});

const normalizePayload = (source = fallbackData) => ({
  hero: {
    ...fallbackData.hero,
    ...(source.hero || {})
  },
  resultsSection: {
    ...fallbackData.resultsSection,
    ...(source.resultsSection || {}),
    cards: Array.isArray(source.resultsSection?.cards)
      ? source.resultsSection.cards.map(normalizeCard)
      : defaultCards
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
    console.error('Error fetching Real Results settings:', error);
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
    console.error('Error updating Real Results settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const publicUrl = await uploadToSupabase(req.file, 'real_results_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading Real Results asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
