const express = require('express');
const router = express.Router();
const serviceDetailController = require('../controllers/serviceDetailController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadToSupabase = require('../utils/uploadToSupabase');

// Upload media endpoint for CMS
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }
    const publicUrl = await uploadToSupabase(req.file, 'services');
    res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all service details metadata (for dropdowns/lists)
router.get('/', serviceDetailController.getAllServiceDetails);

// Get specific service details by slug (Public access for frontend)
router.get('/:slug', serviceDetailController.getServiceDetailBySlug);

// Create or update service details (Protected route for admin)
router.put('/:slug', protect, serviceDetailController.saveServiceDetail);

module.exports = router;
