const supabase = require('../config/supabase');
const { servicesData } = require('../utils/servicesDataFallback');

const slugAliases = {
  'hair-transplant-cost-in-delhi': 'hair-transplant-cost-in-india'
};

const resolveDisplayRating = (...values) => {
  for (const value of values) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 5) {
      return parsed;
    }
  }
  return null;
};

const hydrateDisplayMeta = (payload = {}) => {
  const banner = payload.banner && typeof payload.banner === 'object'
    ? { ...payload.banner }
    : {};

  const resolvedRating = resolveDisplayRating(
    banner.rating,
    payload?.intro?.rating,
    payload?.rating
  );

  if (resolvedRating !== null) {
    banner.rating = resolvedRating;
  }

  return { ...payload, banner };
};

const getSlugLookupCandidates = (slug) => {
  const candidates = [slug];
  if (slugAliases[slug]) candidates.push(slugAliases[slug]);
  return [...new Set(candidates.filter(Boolean))];
};

// Get service details by slug
exports.getServiceDetailBySlug = async (req, res) => {
  const { slug } = req.params;
  const lookupCandidates = getSlugLookupCandidates(slug);

  let serviceDetail = null;
  try {
    const { data, error } = await supabase
      .from('service_details')
      .select('*')
      .in('slug', lookupCandidates)
      .limit(1)
      .single();
    if (!error || error.code === 'PGRST116') {
      serviceDetail = data || null;
    }
  } catch (_) {
    // Supabase not available — fall through to fallback
  }

  if (!serviceDetail) {
    const fallbackData = servicesData.find(s =>
      lookupCandidates.some(candidate => s.slug.toLowerCase() === candidate.toLowerCase())
    );
    if (fallbackData) {
      return res.status(200).json({ success: true, data: { ...fallbackData, slug }, isFallback: true });
    }
    return res.status(404).json({ success: false, message: 'Service details not found' });
  }

  const responseData = serviceDetail.data
    ? { ...serviceDetail.data, slug: serviceDetail.slug }
    : { ...serviceDetail, slug };

  res.status(200).json({ success: true, data: { ...hydrateDisplayMeta(responseData), slug } });
};

// Create or Update service details
exports.saveServiceDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const lookupCandidates = getSlugLookupCandidates(slug);

    // Check if a record already exists (to resolve alias)
    const { data: existing } = await supabase
      .from('service_details')
      .select('slug')
      .in('slug', lookupCandidates)
      .limit(1)
      .single();

    const lookupSlug = existing?.slug || slug;
    const updateData = { ...req.body };

    // Ensure the slug matches URL param
    updateData.slug = slug;
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.id;

    // Migrate legacy intro.videos → intro.introMedia if present
    if (updateData.intro) {
      if (updateData.intro.videos && !updateData.intro.introMedia) {
        updateData.intro.introMedia = (updateData.intro.videos || []).map(v => ({
          type: v.videoUrl ? 'video' : 'image',
          url: v.thumbnail || v.image || v.videoUrl || '',
          title: v.title || '',
          alt: v.title || '',
          thumbnail: v.thumbnail || v.image || ''
        }));
      }
      delete updateData.intro.videos;
    }

    const { data: saved, error } = await supabase
      .from('service_details')
      .upsert(
        { slug: lookupSlug, data: updateData, updated_at: new Date().toISOString() },
        { onConflict: 'slug' }
      )
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: saved?.data || updateData,
      message: 'Service details saved successfully'
    });
  } catch (error) {
    console.error('Error saving service details:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all service details (metadata only, for dashboard)
exports.getAllServiceDetails = async (req, res) => {
  try {
    const { data: services, error } = await supabase
      .from('service_details')
      .select('slug, updated_at, data->title, data->category');

    if (error) throw error;

    const formatted = (services || []).map(s => ({
      slug: s.slug,
      title: s.title || s.slug,
      category: s.category,
      updatedAt: s.updated_at
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    // Fallback to static data
    const fallback = servicesData.map(s => ({ slug: s.slug, title: s.title || s.slug, isFallback: true }));
    res.status(200).json({ success: true, data: fallback });
  }
};
