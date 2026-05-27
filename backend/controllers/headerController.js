const supabase = require('../config/supabase');

const CMS_KEY = 'header';

const getHeader = async (req, res, next) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.status(200).json({ success: true, data: row?.data || {} });
  } catch (error) {
    next(error);
  }
};

const updateHeader = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};
    const merged = { ...current, ...req.body };

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.status(200).json({ success: true, data: merged });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHeader, updateHeader };
