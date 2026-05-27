const supabase = require('../config/supabase');

const CMS_KEY = 'why_choose_dmc';

exports.getWhyChooseDMC = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWhyChooseDMC = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const u = req.body;
    const merged = { ...current };

    if (u.enabled !== undefined) merged.enabled = u.enabled;
    if (u.badgeText !== undefined) merged.badgeText = u.badgeText;
    if (u.heading !== undefined) merged.heading = u.heading;
    if (u.description !== undefined) merged.description = u.description;
    if (u.mainImage !== undefined) merged.mainImage = u.mainImage;
    if (u.bottomImage !== undefined) merged.bottomImage = u.bottomImage;
    if (u.backgroundColor !== undefined) merged.backgroundColor = u.backgroundColor;
    if (u.features !== undefined) merged.features = u.features;

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
