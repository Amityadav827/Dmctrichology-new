const supabase = require('../config/supabase');

const CMS_KEY = 'science_dmc';

exports.getScienceDmc = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateScienceDmc = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const u = req.body;
    const merged = { ...current };

    if (u.hero !== undefined) merged.hero = { ...(current.hero || {}), ...u.hero };
    if (u.introSection !== undefined) merged.introSection = { ...(current.introSection || {}), ...u.introSection };

    if (u.dualFeatureSection !== undefined) {
      const existingDual = current.dualFeatureSection || {};
      merged.dualFeatureSection = {
        isEnabled: u.dualFeatureSection.isEnabled !== undefined
          ? u.dualFeatureSection.isEnabled
          : existingDual.isEnabled,
        leftCard: u.dualFeatureSection.leftCard !== undefined
          ? { ...(existingDual.leftCard || {}), ...u.dualFeatureSection.leftCard }
          : existingDual.leftCard,
        rightCard: u.dualFeatureSection.rightCard !== undefined
          ? { ...(existingDual.rightCard || {}), ...u.dualFeatureSection.rightCard }
          : existingDual.rightCard
      };
    }

    if (u.consultationSection !== undefined) {
      merged.consultationSection = { ...(current.consultationSection || {}), ...u.consultationSection };
    }

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
