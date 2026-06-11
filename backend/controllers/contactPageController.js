const supabase = require('../config/supabase');

const CMS_KEY = 'contact_page';

const DEFAULT_LEGACY_MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.444704381882!2d77.16010531508083!3d28.55641798244799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1df64319087d%3A0xe6759c22f07f2324!2sDMC%20Trichology%20Vasant%20Vihar!5e0!3m2!1sen!2sin!4v1625471234567!5m2!1sen!2sin";

const normalizeMapItem = (map = {}, index = 0) => ({
  id: map.id || `map-${index + 1}`,
  branchName: map.branchName || map.name || map.area || `Map ${index + 1}`,
  city: map.city || '',
  area: map.area || '',
  googleMapEmbedUrl: map.googleMapEmbedUrl || map.embedUrl || '',
  displayOrder: Number.isFinite(Number(map.displayOrder)) ? Number(map.displayOrder) : (index + 1) * 10,
  isEnabled: map.isEnabled !== false
});

const normalizeMapSection = (map = {}) => {
  const legacyUrl = map.googleMapEmbedUrl || '';
  const legacyItem = normalizeMapItem({
    id: 'legacy-map-1',
    branchName: map.branchName || map.area || map.city || 'Map 1',
    city: map.city || '',
    area: map.area || '',
    googleMapEmbedUrl: legacyUrl,
    displayOrder: 10,
    isEnabled: true
  }, 0);

  const sourceMaps = Array.isArray(map.maps) && map.maps.length > 0
    ? map.maps.map(normalizeMapItem)
    : [legacyItem];

  const maps = sourceMaps
    .map(normalizeMapItem)
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));

  const firstMap = maps[0] || legacyItem;

  return {
    ...map,
    multipleMapsEnabled: map.multipleMapsEnabled === true,
    maps,
    city: map.city || firstMap.city || '',
    area: map.area || firstMap.area || '',
    googleMapEmbedUrl: map.googleMapEmbedUrl || firstMap.googleMapEmbedUrl || legacyUrl || DEFAULT_LEGACY_MAP_URL
  };
};

exports.getContactPage = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    const payload = row?.data || {};
    res.status(200).json({
      success: true,
      data: {
        ...payload,
        map: normalizeMapSection(payload.map || {})
      }
    });
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
      merged.map = normalizeMapSection({ ...(current.map || {}), ...req.body.map });
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
