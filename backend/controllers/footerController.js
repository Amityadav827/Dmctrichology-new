const supabase = require('../config/supabase');

const CMS_KEY = 'footer';

exports.getFooter = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const u = req.body;
    const merged = { ...current };

    if (u.enabled !== undefined) merged.enabled = u.enabled;
    if (u.columns !== undefined) merged.columns = u.columns;
    if (u.contact !== undefined) merged.contact = u.contact;
    if (u.disclaimer !== undefined) merged.disclaimer = u.disclaimer;
    if (u.newsletter !== undefined) merged.newsletter = u.newsletter;
    if (u.branding !== undefined) merged.branding = u.branding;
    if (u.socials !== undefined) merged.socials = u.socials;
    if (u.bottomFooter !== undefined) merged.bottomFooter = u.bottomFooter;

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
