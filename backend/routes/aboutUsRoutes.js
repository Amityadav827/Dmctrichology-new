const express = require('express');
const router = express.Router();
const aboutUsController = require('../controllers/aboutUsController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', aboutUsController.getAboutUs);
router.put('/', protect, aboutUsController.updateAboutUs);

// Dedicated isolated upload endpoint for About Us Testimonials
router.post('/upload-testimonial-image', protect, upload.single('image'), aboutUsController.uploadTestimonialImage);

module.exports = router;
