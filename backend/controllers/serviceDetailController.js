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
    const updateData = req.body;
    
    // Ensure the slug in body matches the URL
    updateData.slug = slug;

    const serviceDetail = await ServiceDetail.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.status(200).json({ success: true, data: serviceDetail, message: 'Service details saved successfully' });
  } catch (error) {
    console.error('Error saving service details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
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
