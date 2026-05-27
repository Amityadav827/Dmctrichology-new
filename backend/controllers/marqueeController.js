const supabase = require('../config/supabase');

const CMS_KEY = 'marquee_features';

exports.getMarqueeFeatures = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {} });
  } catch (error) {
    console.error('MarqueeFeature GET error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMarqueeFeatures = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const updates = req.body;
    const merged = { ...current };

    if (updates.enabled !== undefined) merged.enabled = updates.enabled;
    if (updates.backgroundColor !== undefined) merged.backgroundColor = updates.backgroundColor;
    if (updates.paddingTop !== undefined) merged.paddingTop = updates.paddingTop;
    if (updates.paddingBottom !== undefined) merged.paddingBottom = updates.paddingBottom;
    if (updates.marqueeSpeed !== undefined) merged.marqueeSpeed = Number(updates.marqueeSpeed);
    if (updates.pauseOnHover !== undefined) merged.pauseOnHover = updates.pauseOnHover;

    if (updates.items !== undefined) {
      try {
        const parsed = typeof updates.items === 'string'
          ? JSON.parse(updates.items)
          : updates.items;
        if (Array.isArray(parsed)) {
          merged.items = parsed;
        }
      } catch (e) {
        console.error('Failed to parse items array:', e.message);
      }
    }

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.json({ success: true, data: merged });
  } catch (error) {
    console.error('MarqueeFeature PUT error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
