const supabase = require('../config/supabase');

const CMS_KEY = 'press_media';

exports.getPressMedia = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePressMedia = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const u = req.body;
    const merged = { ...current };

    if (u.enabled !== undefined) merged.enabled = u.enabled;
    if (u.heading !== undefined) merged.heading = u.heading;
    if (u.ratingText !== undefined) merged.ratingText = u.ratingText;
    if (u.patientCountText !== undefined) merged.patientCountText = u.patientCountText;
    if (u.button !== undefined) merged.button = u.button;
    if (u.avatars !== undefined) merged.avatars = u.avatars;
    if (u.mediaLogos !== undefined) merged.mediaLogos = u.mediaLogos;
    if (u.hero !== undefined) merged.hero = { ...(current.hero || {}), ...u.hero };
    if (u.mediaCards !== undefined) merged.mediaCards = u.mediaCards;

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
