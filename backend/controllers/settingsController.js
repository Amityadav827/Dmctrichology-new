const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'site_settings';

const getSettings = async (req, res, next) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.status(200).json({ success: true, data: row?.data || {} });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.socialLinks && typeof updates.socialLinks === 'string') {
      try {
        updates.socialLinks = JSON.parse(updates.socialLinks);
      } catch (e) {
        console.error('Failed to parse social links');
      }
    }

    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        updates.logo = await uploadToSupabase(req.files.logo[0], 'settings');
      }
      if (req.files.favicon && req.files.favicon[0]) {
        updates.favicon = await uploadToSupabase(req.files.favicon[0], 'settings');
      }
    }

    // Merge with existing data
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const merged = { ...(existing?.data || {}), ...updates };

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.status(200).json({ success: true, data: merged });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
