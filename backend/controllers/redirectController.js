const supabase = require("../config/supabase");

const formatRedirect = (item) => ({
  ...item,
  _id: item.id,
  sourceUrl: item.source_url,
  destinationUrl: item.destination_url,
  type: String(item.type),
});

const createRedirect = async (req, res, next) => {
  try {
    const { sourceUrl, destinationUrl, type, status } = req.body;
    if (!sourceUrl || !destinationUrl) return res.status(400).json({ success: false, message: "Source and destination URLs are required" });

    const { data, error } = await supabase
      .from('redirects')
      .insert([{
        source_url: sourceUrl,
        destination_url: destinationUrl,
        type: String(type || '301'),
        status: status || 'active'
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: formatRedirect(data) });
  } catch (error) {
    next(error);
  }
};

const getRedirects = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('redirects').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    const formattedData = data.map(formatRedirect);
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const updateRedirect = async (req, res, next) => {
  try {
    const updates = {
      source_url: req.body.sourceUrl,
      destination_url: req.body.destinationUrl,
      type: req.body.type,
      status: req.body.status,
    };
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase.from('redirects').update(updates).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Redirect not found" });
    return res.status(200).json({ success: true, data: formatRedirect(data) });
  } catch (error) {
    next(error);
  }
};

const deleteRedirect = async (req, res, next) => {
  try {
    const { error } = await supabase.from('redirects').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Redirect deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleRedirectStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('redirects').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Redirect not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('redirects').update({ status: newStatus }).eq('id', req.params.id).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: formatRedirect(data) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRedirect,
  getRedirects,
  updateRedirect,
  deleteRedirect,
  toggleRedirectStatus,
};
