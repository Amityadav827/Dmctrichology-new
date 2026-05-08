const express = require('express');
const router = express.Router();
const { getTreatmentPlan, updateTreatmentPlan } = require('../controllers/treatmentPlanController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getTreatmentPlan);
router.put('/', protect, updateTreatmentPlan);

module.exports = router;
