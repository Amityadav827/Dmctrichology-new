const ServiceDetail = require('../models/ServiceDetail');
const { servicesData } = require('../utils/servicesDataFallback');

const slugAliases = {
  'hair-transplant-cost-in-delhi': 'hair-transplant-cost-in-india'
};

const getSlugLookupCandidates = (slug) => {
  const candidates = [slug];
  if (slugAliases[slug]) candidates.push(slugAliases[slug]);
  return [...new Set(candidates.filter(Boolean))];
};

// Get service details by slug
exports.getServiceDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const lookupCandidates = getSlugLookupCandidates(slug);
    let serviceDetail = await ServiceDetail.findOne({ slug: { $in: lookupCandidates } });
    
    if (!serviceDetail) {
      // Fallback to static existing frontend structure
      const fallbackData = servicesData.find(s =>
        lookupCandidates.some(candidate => s.slug.toLowerCase() === candidate.toLowerCase())
      );
      if (fallbackData) {
        return res.status(200).json({
          success: true,
          data: { ...fallbackData, slug },
          isFallback: true
        });
      }
      return res.status(404).json({ success: false, message: 'Service details not found' });
    }
    
    const data = serviceDetail.toObject ? serviceDetail.toObject() : serviceDetail;
    res.status(200).json({ success: true, data: { ...data, slug } });
  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create or Update service details
exports.saveServiceDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const lookupCandidates = getSlugLookupCandidates(slug);
    const existingServiceDetail = await ServiceDetail.findOne({ slug: { $in: lookupCandidates } }).select('slug');
    const lookupSlug = existingServiceDetail?.slug || slug;
    const updateData = { ...req.body };
    
    // Ensure the slug matches URL param
    updateData.slug = slug;
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Migrate legacy intro.videos → intro.introMedia if present
    if (updateData.intro) {
      if (updateData.intro.videos && !updateData.intro.introMedia) {
        // Convert old videos array to new introMedia format
        updateData.intro.introMedia = (updateData.intro.videos || []).map(v => ({
          type: v.videoUrl ? 'video' : 'image',
          url: v.thumbnail || v.image || v.videoUrl || '',
          title: v.title || '',
          alt: v.title || '',
          thumbnail: v.thumbnail || v.image || ''
        }));
      }
      // Remove legacy videos field to avoid schema confusion
      delete updateData.intro.videos;
    }

    const serviceDetail = await ServiceDetail.findOneAndUpdate(
      { slug: lookupSlug },
      { $set: updateData },
      { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true,
        runValidators: false  // allow partial updates without full doc validation
      }
    );
    
    res.status(200).json({ success: true, data: serviceDetail, message: 'Service details saved successfully' });
  } catch (error) {
    console.error('Error saving service details:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all service details (metadata only, for dashboard)
exports.getAllServiceDetails = async (req, res) => {
  try {
    const services = await ServiceDetail.find().select('slug title category updatedAt');
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching all service details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
