const supabase = require('../config/supabase');

const CMS_KEY = 'hero';

const getHero = async (req, res, next) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.status(200).json({ success: true, data: row?.data || {} });
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: req.body, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;
    res.status(200).json({ success: true, data: req.body });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHero, updateHero };
