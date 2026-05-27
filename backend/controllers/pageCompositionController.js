const supabase = require('../config/supabase');

const getPageBySlug = async (req, res, next) => {
  try {
    const { data: page, error } = await supabase
      .from('pages').select('*').eq('slug', req.params.slug).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.status(200).json({ success: true, data: page });
  } catch (e) { next(e); }
};

const updatePageComposition = async (req, res, next) => {
  try {
    const { error } = await supabase.from('pages')
      .upsert({ slug: req.params.slug, ...req.body, updated_at: new Date() }, { onConflict: 'slug' });
    if (error) throw error;
    const { data: page } = await supabase.from('pages').select('*').eq('slug', req.params.slug).single();
    res.status(200).json({ success: true, data: page });
  } catch (e) { next(e); }
};

module.exports = { getPageBySlug, updatePageComposition };
