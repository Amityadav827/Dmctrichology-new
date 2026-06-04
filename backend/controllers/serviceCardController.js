const supabase = require('../config/supabase');

exports.getServices = async (req, res) => {
  try {
    const { data: services, error } = await supabase
      .from('service_cards')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Dynamically retrieve real-time rating, reviewCount, and duration from corresponding service_details
    const populatedServices = await Promise.all(
      (services || []).map(async (service) => {
        const { data: detail } = await supabase
          .from('service_details')
          .select('data')
          .eq('slug', service.slug)
          .single();

        const detailData = detail?.data || {};
        const ratingVal = detailData?.banner?.rating ?? 4.8;
        const reviewCountVal = detailData?.banner?.reviewCount ?? 1250;
        const durationVal =
          detailData?.banner?.duration ||
          detailData?.intro?.duration ||
          service.duration ||
          '45 mins';

        // Merge data blob so camelCase fields (buttonText, buttonLink, shortDescription, featured)
        // are available at top level. Top-level columns take precedence over blob values.
        const blob = service.data || {};
        const featuredValue = service.featured ?? blob.featured ?? false;
        return {
          ...blob,
          ...service,
          // Normalize snake_case columns to camelCase for the frontend
          shortDescription: service.short_description || blob.shortDescription || '',
          buttonText: service.button_text || blob.buttonText || 'View Details',
          buttonLink: service.button_link || blob.buttonLink || `/details/${service.slug}`,
          featured: featuredValue === true || featuredValue === 'true' || featuredValue === 1 || featuredValue === '1',
          sortOrder: service.order_index ?? blob.sortOrder ?? 0,
          // Real-time values from service_details
          rating: ratingVal,
          reviewCount: reviewCountVal,
          duration: durationVal,
        };
      })
    );

    const filteredServices = req.query.featured === 'true'
      ? populatedServices.filter((service) => service.featured)
      : populatedServices;

    // Preserve existing behavior: if no featured cards are configured, return all cards.
    const responseServices = req.query.featured === 'true' && filteredServices.length === 0
      ? populatedServices
      : filteredServices;

    res.status(200).json({ success: true, data: responseServices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const { data: service, error } = await supabase
      .from('service_cards')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const b = req.body;

    // Build update with real column names only
    const update = { updated_at: new Date().toISOString() };
    if (b.title !== undefined) update.title = b.title;
    if (b.slug !== undefined) update.slug = b.slug;
    if (b.image !== undefined) update.image = b.image;
    if (b.rating !== undefined) update.rating = b.rating;
    if (b.duration !== undefined) update.duration = b.duration;
    if (b.category !== undefined) update.category = b.category;
    if (b.status !== undefined) update.status = b.status;
    if (b.order_index !== undefined) update.order_index = b.order_index;
    if (b.sortOrder !== undefined) update.order_index = b.sortOrder;

    // Normalize short_description from either alias
    const shortDesc = b.short_description ?? b.shortDescription;
    if (shortDesc !== undefined) update.short_description = shortDesc;

    // Merge blob-only fields (featured, buttonText, buttonLink) into data JSON
    const blobFields = {};
    if (b.featured !== undefined) blobFields.featured = b.featured;
    if (b.buttonText !== undefined) blobFields.buttonText = b.buttonText;
    if (b.buttonLink !== undefined) blobFields.buttonLink = b.buttonLink;

    if (Object.keys(blobFields).length > 0) {
      // Fetch existing data blob to merge into
      const { data: existing } = await supabase
        .from('service_cards').select('data').eq('id', req.params.id).single();
      update.data = { ...(existing?.data || {}), ...blobFields };
    }

    const { data: service, error } = await supabase
      .from('service_cards')
      .update(update)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { error } = await supabase
      .from('service_cards')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const { services } = req.body;
    for (const s of services) {
      await supabase
        .from('service_cards')
        .update({ order_index: s.sortOrder, updated_at: new Date().toISOString() })
        .eq('id', s._id || s.id);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
