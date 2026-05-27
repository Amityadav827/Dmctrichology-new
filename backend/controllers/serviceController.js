const supabase = require('../config/supabase');

const CMS_KEY = 'home_services_slider';

const DEFAULTS = {
  subtitle: 'SERVICES',
  title: 'Our Hair Transplant Services',
  viewAllText: 'View All',
  viewAllLink: '/service',
};

exports.getServices = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections')
      .select('data')
      .eq('key', CMS_KEY)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ success: true, data: row?.data || DEFAULTS });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateServices = async (req, res) => {
  try {
    const { subtitle, title, viewAllText, viewAllLink } = req.body;
    const data = { subtitle, title, viewAllText, viewAllLink };

    const { error } = await supabase
      .from('cms_sections')
      .upsert({ key: CMS_KEY, data, updated_at: new Date() }, { onConflict: 'key' });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
