const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

// Detect media type from URL extension (fallback when alt_text marker absent)
const detectMediaTypeFromUrl = (url = '') => {
  const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.ogg'];
  const lower = url.toLowerCase();
  if (videoExts.some(ext => lower.includes(ext))) return 'video';
  return 'image';
};

const transformItem = (item) => {
  if (!item) return null;
  const url = item.image_url || '';
  // media_type encoded in alt_text as prefix "[video]" to avoid schema change
  let mediaType = 'image';
  let altText = item.alt_text || '';
  if (altText.startsWith('[video]')) {
    mediaType = 'video';
    altText = altText.replace('[video]', '').trim();
  } else {
    mediaType = detectMediaTypeFromUrl(url);
  }
  return {
    _id: item.id,
    id: item.id,
    imageUrl: url,
    image: url,
    url: url,
    mediaType,
    title: item.title,
    altText,
    description: item.description,
    order: item.order,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

const createGalleryItem = async (req, res, next) => {
  try {
    // Accept field name 'images' (legacy) OR 'media' (new unified)
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
        success: false,
        message: "At least one file is required"
      });
    }

    const title = req.body.title || "";
    const altText = req.body.altText || "";
    const description = req.body.description || "";
    
    const itemsToInsert = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.mimetype.startsWith('video/');
      const publicUrl = await uploadToSupabase(file, 'gallery');
      // Encode media type in alt_text prefix so we can retrieve it without DB schema change
      const storedAltText = isVideo ? `[video]${altText}` : altText;
      itemsToInsert.push({
        image_url: publicUrl,
        title: title || file.originalname || "",
        alt_text: storedAltText,
        description,
        order: Number.isFinite(Number(req.body.order)) ? Number(req.body.order) + i : i,
        status: req.body.status || "active",
      });
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert(itemsToInsert)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    const transformedItems = data.map(item => transformItem(item));

    return res.status(201).json({
      success: true,
      data: transformedItems,
    });
  } catch (error) {
    next(error);
  }
};


const getGalleryItems = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    let query = supabase.from('gallery').select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, count, error } = await query
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    const transformedItems = data.map(item => transformItem(item));

    return res.status(200).json({
      success: true,
      count: transformedItems.length,
      data: transformedItems,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.max(Math.ceil(count / limit), 1),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getGalleryItemById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: error ? error.message : "Gallery item not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: transformItem(data),
    });
  } catch (error) {
    next(error);
  }
};

const updateGalleryItem = async (req, res, next) => {
  try {
    const { data: galleryItem, error: fetchError } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    const updates = {};
    if (req.files?.length) {
      // In a real production app, you might want to delete the old image from Supabase Storage here.
      const newUrl = await uploadToSupabase(req.files[0], 'gallery');
      updates.image_url = newUrl;
    }

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.altText !== undefined) updates.alt_text = req.body.altText;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.order !== undefined && Number.isFinite(Number(req.body.order))) {
      updates.order = Number(req.body.order);
    }
    if (req.body.status !== undefined) updates.status = req.body.status;

    const { data, error } = await supabase
      .from('gallery')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data: transformItem(data),
    });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleGalleryItemStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase
      .from('gallery')
      .select('status')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !current) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    const newStatus = current.status === "active" ? "inactive" : "active";
    
    const { data, error } = await supabase
      .from('gallery')
      .update({ status: newStatus })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data: transformItem(data),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemStatus,
};
