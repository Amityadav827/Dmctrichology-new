const supabase = require('../config/supabase');

const CMS_KEY = 'service_page_settings';

exports.getSettings = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.status(200).json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: req.body, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;
    res.status(200).json({ success: true, data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
