const supabase = require('../config/supabase');

const CMS_KEY = 'treatment_plan';

exports.getTreatmentPlan = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTreatmentPlan = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const u = req.body;
    const merged = { ...current };

    if (u.enabled !== undefined) merged.enabled = u.enabled;
    if (u.badgeText !== undefined) merged.badgeText = u.badgeText;
    if (u.heading !== undefined) merged.heading = u.heading;
    if (u.cards !== undefined) merged.cards = u.cards;

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
