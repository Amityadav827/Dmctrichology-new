const supabase = require('../config/supabase');

const CMS_KEY = 'contact_page';

exports.getContactPage = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.status(200).json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateContactPage = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    // Deep merge matching original update logic
    const merged = { ...current };

    if (req.body.hero) {
      merged.hero = { ...(current.hero || {}), ...req.body.hero };
    }

    if (req.body.consultation) {
      const { serviceOptions, ...otherCons } = req.body.consultation;
      merged.consultation = { ...(current.consultation || {}), ...otherCons };
      if (serviceOptions) {
        merged.consultation.serviceOptions = serviceOptions;
      }
    }

    if (req.body.map) {
      merged.map = { ...(current.map || {}), ...req.body.map };
    }

    if (req.body.seo) {
      merged.seo = { ...(current.seo || {}), ...req.body.seo };
    }

    // If no specific sub-keys, merge entire body
    if (!req.body.hero && !req.body.consultation && !req.body.map && !req.body.seo) {
      Object.assign(merged, req.body);
    }

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.status(200).json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
