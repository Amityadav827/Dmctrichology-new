const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

const mapToSupabase = (data) => {
  const result = {
    title: data.title,
    author: data.author,
    show_type: data.show_type || data.showType,
    layout_type: data.layout_type || data.layoutType,
    admin_description: data.admin_description || data.adminDescription,
    short_description: data.short_description || data.shortDescription,
    full_description: data.full_description || data.fullDescription,
    blog_image: data.blog_image || data.blogImage,
    banner_image: data.banner_image || data.bannerImage,
    alt_tag: data.alt_tag || data.altTag,
    tags: data.tags,
    slug: data.slug,
    meta_title: data.meta_title || data.metaTitle,
    meta_keywords: data.meta_keywords || data.metaKeywords,
    meta_description: data.meta_description || data.metaDescription,
    canonical_url: data.canonical_url || data.canonicalUrl,
    blog_date: data.blog_date || data.blogDate,
    status: data.status,
    category_id: data.category_id || data.categoryId || null,
  };

  if (data.faqs !== undefined) {
    result.faqs = (() => {
      try {
        return typeof data.faqs === 'string' ? JSON.parse(data.faqs) : (data.faqs || []);
      } catch (e) {
        console.error("[mapToSupabase] FAQ Parse Error:", e.message);
        return [];
      }
    })();
  }

  return result;
};

const mapFromSupabase = (data) => {
  if (!data) return null;
  return {
    _id: data.id,
    id: data.id,
    title: data.title,
    author: data.author,
    showType: data.show_type,
    layoutType: data.layout_type,
    adminDescription: data.admin_description,
    shortDescription: data.short_description,
    fullDescription: data.full_description,
    blogImage: data.blog_image,
    bannerImage: data.banner_image,
    altTag: data.alt_tag,
    tags: data.tags,
    slug: data.slug,
    metaTitle: data.meta_title,
    metaKeywords: data.meta_keywords,
    metaDescription: data.meta_description,
    canonicalUrl: data.canonical_url,
    blogDate: data.blog_date,
    status: data.status || "Published",
    categoryId: data.category_id,
    category: data.category,
    faqs: (() => {
      if (!data.faqs) return [];
      try {
        return typeof data.faqs === 'string' ? JSON.parse(data.faqs) : data.faqs;
      } catch (e) {
        return [];
      }
    })(),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const createBlog = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Handle Image Uploads to Supabase Storage
    if (req.files) {
      if (req.files.blogImage && req.files.blogImage[0]) {
        body.blog_image = await uploadToSupabase(req.files.blogImage[0], 'blogs');
      }
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        body.banner_image = await uploadToSupabase(req.files.bannerImage[0], 'blogs');
      }
    }

    const supabaseData = mapToSupabase(body);
    console.log("[Create Blog] Attempting insert with data:", JSON.stringify(supabaseData, null, 2));

    // Try to insert and only select columns we definitely know exist
    const { data, error } = await supabase
      .from('blogs')
      .insert([supabaseData])
      .select('id, title, slug, created_at, updated_at')
      .single();

    if (error) {
      console.error("[Create Blog ERROR]:", error.message);
      console.error("[Create Blog Details]:", JSON.stringify(error, null, 2));
      return res.status(500).json({ success: false, message: error.message });
    }

    console.log("[Create Blog SUCCESS]:", data.id);
    return res.status(201).json({ success: true, data: mapFromSupabase(data) });
  } catch (error) {
    next(error);
  }
};

const getBlogs = async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
    const page = Math.max(parseInt(req.query.page || "1", 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10) || 10, 1), 1000);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('blogs').select('*, category:blog_categories(name)', { count: 'exact' });
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,slug.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (req.query.categoryId) {
      query = query.eq('category_id', req.query.categoryId);
    }

    query = query.order('created_at', { ascending: false });

    if (shouldPaginate) {
      query = query.range(from, to);
    }

    const { data, count, error } = await query;

    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedBlogs = (data || []).map(blog => mapFromSupabase(blog));
    const totalBlogs = count || 0;
    const totalPages = shouldPaginate ? Math.max(1, Math.ceil(totalBlogs / limit)) : 1;
    const currentPage = shouldPaginate ? Math.min(page, totalPages) : 1;
    const hasNextPage = shouldPaginate && currentPage < totalPages;
    const hasPreviousPage = shouldPaginate && currentPage > 1;

    console.log("[getBlogs Backend] Returning count of blogs:", formattedBlogs.length);
    return res.status(200).json({
      success: true,
      count: formattedBlogs.length,
      blogs: formattedBlogs,
      totalBlogs,
      totalPages,
      currentPage,
      hasNextPage,
      hasPreviousPage,
      data: formattedBlogs,
      pagination: {
        page: currentPage,
        limit: shouldPaginate ? limit : (formattedBlogs.length || 1),
        total: totalBlogs,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBlogCategories = async (req, res, next) => {
  try {
    // 1. Fetch all active categories from master table
    const { data: allCategories, error: catError } = await supabase
      .from('blog_categories')
      .select('id, name, slug')
      .eq('status', 'active')
      .order('order', { ascending: true });

    if (catError) return res.status(500).json({ success: false, message: catError.message });

    // 2. Fetch counts of published blogs per category
    const { data: blogStats, error: blogError } = await supabase
      .from('blogs')
      .select('category_id')
      .eq('status', 'Published');

    if (blogError) return res.status(500).json({ success: false, message: blogError.message });

    // 3. Map counts to categories
    const counts = {};
    blogStats.forEach(b => {
      if (b.category_id) {
        counts[b.category_id] = (counts[b.category_id] || 0) + 1;
      }
    });

    const result = allCategories.map(cat => ({
      ...cat,
      count: counts[cat.id] || 0
    })).filter(c => c.count > 0);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('blogs').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: error ? error.message : "Blog not found" });
    return res.status(200).json({ success: true, data: mapFromSupabase(data) });
  } catch (error) {
    next(error);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const rawSlug = req.params.slug;
    const normalizedSlug = String(rawSlug).trim().toLowerCase();
    
    // Try finding by normalized slug first
    let { data, error } = await supabase
      .from('blogs')
      .select('*')
      .ilike('slug', normalizedSlug)
      .limit(1);

    let blog = data && data.length > 0 ? data[0] : null;

    // FALLBACK: If not found, try to find a blog where the title matches the slug structure
    if (!blog) {
      const searchTitle = normalizedSlug.split('-').join('%');
      const { data: fallbackData } = await supabase
        .from('blogs')
        .select('*')
        .ilike('title', `%${searchTitle}%`)
        .limit(1);
      
      blog = fallbackData && fallbackData.length > 0 ? fallbackData[0] : null;
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Safety: Verify status is Published (case-insensitive)
    if (blog.status?.toLowerCase() !== 'published') {
      return res.status(404).json({ success: false, message: "Blog not published" });
    }

    return res.status(200).json({ success: true, data: mapFromSupabase(blog) });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Handle Image Uploads to Supabase Storage
    if (req.files) {
      if (req.files.blogImage && req.files.blogImage[0]) {
        body.blog_image = await uploadToSupabase(req.files.blogImage[0], 'blogs');
      }
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        body.banner_image = await uploadToSupabase(req.files.bannerImage[0], 'blogs');
      }
    }

    const updates = mapToSupabase(body);
    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    // DEBUG LOGGING
    const fs = require('fs');
    const logData = `\n--- UPDATE BLOG ${new Date().toISOString()} ---\n` +
                    `RAW BODY FAQS: ${body.faqs}\n` +
                    `UPDATES FAQS: ${JSON.stringify(updates.faqs, null, 2)}\n` +
                    `-------------------------------------------\n`;
    fs.appendFileSync('debug_update.log', logData);

    console.log("[Update Blog] Updates to apply:", updates);

    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      console.error("[Update Blog ERROR]:", error ? error.message : "Not found");
      return res.status(404).json({ success: false, message: error ? error.message : "Blog not found" });
    }

    return res.status(200).json({ success: true, data: mapFromSupabase(data) });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { error } = await supabase.from('blogs').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogCategories,
};
