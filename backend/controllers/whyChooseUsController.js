const supabase = require('../config/supabase');

const CMS_KEY = 'why_choose_us';

exports.getWhyChooseUs = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {} });
  } catch (error) {
    console.error('WhyChooseUs GET error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWhyChooseUs = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const u = req.body;
    const merged = { ...current };

    if (u.enabled !== undefined) merged.enabled = u.enabled;
    if (u.subtitle !== undefined) merged.subtitle = u.subtitle;
    if (u.title !== undefined) merged.title = u.title;
    if (u.centralImage !== undefined) merged.centralImage = u.centralImage;
    if (u.backgroundColor !== undefined) merged.backgroundColor = u.backgroundColor;
    if (u.paddingTop !== undefined) merged.paddingTop = u.paddingTop;
    if (u.paddingBottom !== undefined) merged.paddingBottom = u.paddingBottom;
    if (u.showConnectorLines !== undefined) merged.showConnectorLines = u.showConnectorLines;
    if (u.showDots !== undefined) merged.showDots = u.showDots;

    if (u.features !== undefined) {
      try {
        const parsed = typeof u.features === 'string' ? JSON.parse(u.features) : u.features;
        if (Array.isArray(parsed)) {
          merged.features = parsed;
        }
      } catch (e) {
        console.error('Failed to parse features:', e.message);
      }
    }

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.json({ success: true, data: merged });
  } catch (error) {
    console.error('WhyChooseUs PUT error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
