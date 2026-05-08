const express = require('express');
const router = express.Router();
const { getMarqueeFeatures, updateMarqueeFeatures } = require('../controllers/marqueeController');

router.get('/', getMarqueeFeatures);
router.put('/', updateMarqueeFeatures);

module.exports = router;
