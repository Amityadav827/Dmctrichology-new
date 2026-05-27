const supabase = require('../config/supabase');

const CMS_KEY = 'consultation';

exports.getConsultation = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateConsultation = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const u = req.body;
    const merged = { ...current };

    const fields = [
      'enabled', 'badgeText', 'heading', 'subtitle', 'phoneNumber',
      'serviceTimingMonSat', 'serviceTimingSunday', 'namePlaceholder',
      'emailPlaceholder', 'messagePlaceholder', 'serviceOptions',
      'buttonText', 'beforeImage', 'backgroundColor'
    ];

    fields.forEach(field => {
      if (u[field] !== undefined) merged[field] = u[field];
    });

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
