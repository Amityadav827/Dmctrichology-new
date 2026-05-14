const express = require('express');
const router = express.Router();
const serviceDetailController = require('../controllers/serviceDetailController');
const { protect } = require('../middleware/authMiddleware');

// Get all service details metadata (for dropdowns/lists)
router.get('/', serviceDetailController.getAllServiceDetails);

// Get specific service details by slug (Public access for frontend)
router.get('/:slug', serviceDetailController.getServiceDetailBySlug);

// Create or update service details (Protected route for admin)
router.put('/:slug', protect, serviceDetailController.saveServiceDetail);

module.exports = router;
