const supabase = require('../config/supabase');

exports.getSectionData = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', `section_${sectionId}`).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json({ success: true, data: row?.data || {}, isNew: !row });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.updateSectionData = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { error } = await supabase.from('cms_sections')
      .upsert({ key: `section_${sectionId}`, data: req.body, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;
    res.json({ success: true, data: req.body });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getAllSections = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cms_sections').select('key, data, updated_at').like('key', 'section_%');
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
