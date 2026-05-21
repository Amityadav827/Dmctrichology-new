const express = require("express");
const {
  getSettings,
  updateSettings,
  uploadImage,
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
  bulkDeleteLeads,
  exportCsv
} = require("../controllers/aboutDrNandaniController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { publicFormRateLimit } = require("../middleware/publicRateLimitMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public routes
router.get("/", getSettings);
router.post("/lead", publicFormRateLimit, createLead);

// Protected routes (CMS management & Leads dashboard operations)
router.use(protect, adminOnly);

router.put("/", updateSettings);
router.post("/upload-image", upload.single("image"), uploadImage);

// Leads operations
router.get("/leads", getLeads);
router.get("/leads/export", exportCsv);
router.post("/leads/bulk-delete", bulkDeleteLeads);
router.get("/leads/:id", getLeadById);
router.put("/leads/:id", updateLeadStatus);
router.delete("/leads/:id", deleteLead);

module.exports = router;
