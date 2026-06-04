const express = require('express');
const {
  getSettings,
  updateSettings,
  uploadImage
} = require('../controllers/aboutDmcTrichologyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getSettings);

router.use(protect, adminOnly);

router.put('/', updateSettings);
router.post('/upload-image', upload.single('image'), uploadImage);

module.exports = router;
