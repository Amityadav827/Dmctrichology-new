const supabase = require('../config/supabase');

exports.getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('service_categories').select('*').order('order', { ascending: true });
    if (error) throw error;
    // Normalize: expose categoryName so both old and new consumers work
    const normalized = (data || []).map(c => ({
      ...c,
      categoryName: c.categoryName || c.name,
    }));
    res.status(200).json({ success: true, data: normalized });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.createCategory = async (req, res) => {
  try {
    // Accept either `name` or `categoryName` from the request body
    const name = req.body.name || req.body.categoryName;
    const { slug, status, order, sortOrder } = req.body;
    const { data, error } = await supabase
      .from('service_categories').insert({ name, slug, status: status || 'active', order: order || sortOrder || 0 }).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data: { ...data, categoryName: data.name } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.updateCategory = async (req, res) => {
  try {
    // Accept either `name` or `categoryName` from the request body
    const name = req.body.name || req.body.categoryName;
    const updates = { ...req.body, updated_at: new Date() };
    if (name) updates.name = name;
    delete updates.categoryName; // remove frontend-only alias
    const { data, error } = await supabase
      .from('service_categories').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.status(200).json({ success: true, data: { ...data, categoryName: data.name } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { error } = await supabase.from('service_categories').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.toggleCategoryStatus = async (req, res) => {
  try {
    const { data: existing, error: fetchErr } = await supabase
      .from('service_categories').select('status').eq('id', req.params.id).single();
    if (fetchErr) throw fetchErr;
    const newStatus = existing.status === 'active' ? 'inactive' : 'active';
    const { data, error } = await supabase
      .from('service_categories').update({ status: newStatus, updated_at: new Date() }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.updateCategoryOrder = async (req, res) => {
  try {
    const { order } = req.body;
    await Promise.all(order.map((id, index) =>
      supabase.from('service_categories').update({ order: index, updated_at: new Date() }).eq('id', id)
    ));
    res.status(200).json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
