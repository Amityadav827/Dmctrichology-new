const express = require('express');
const router = express.Router();
const { getHomeFAQ, updateHomeFAQ } = require('../controllers/homeFaqController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getHomeFAQ);
router.put('/', protect, updateHomeFAQ);

module.exports = router;
