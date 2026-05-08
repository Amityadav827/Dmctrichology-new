const express = require('express');
const router = express.Router();
const { getHomeBlog, updateHomeBlog } = require('../controllers/homeBlogController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getHomeBlog);
router.put('/', protect, updateHomeBlog);

module.exports = router;
