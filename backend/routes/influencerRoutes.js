const express = require('express');
const router = express.Router();
const { getInfluencers, updateInfluencers } = require('../controllers/influencerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getInfluencers);
router.put('/', protect, updateInfluencers);

module.exports = router;
