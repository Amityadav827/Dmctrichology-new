const ServiceDetail = require('../models/ServiceDetail');
const { servicesData } = require('../utils/servicesDataFallback');

// Get service details by slug
exports.getServiceDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let serviceDetail = await ServiceDetail.findOne({ slug });
    
    if (!serviceDetail) {
      // Fallback to static existing frontend structure
      const fallbackData = servicesData.find(s => s.slug.toLowerCase() === slug.toLowerCase());
      if (fallbackData) {
        return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
      }
      return res.status(404).json({ success: false, message: 'Service details not found' });
    }
    
    res.status(200).json({ success: true, data: serviceDetail });
  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create or Update service details
exports.saveServiceDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = { ...req.body };
    
    // Ensure the slug matches URL param
    updateData.slug = slug;

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
      { slug },
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
