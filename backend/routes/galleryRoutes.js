const express = require("express");
const {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemStatus,
} = require("../controllers/galleryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/")
  .post(upload.fields([
    { name: 'images', maxCount: 20 },  // legacy field name
    { name: 'media', maxCount: 20 }    // new unified field name
  ]), (req, res, next) => {
    // Normalize: merge 'media' files into req.files array format
    if (!req.files) req.files = [];
    else if (!Array.isArray(req.files)) {
      const combined = [...(req.files.images || []), ...(req.files.media || [])];
      req.files = combined;
    }
    next();
  }, createGalleryItem)
  .get(getGalleryItems);

router
  .route("/:id")
  .get(getGalleryItemById)
  .put(upload.array("images", 1), updateGalleryItem)
  .delete(deleteGalleryItem);
router.patch("/:id/toggle-status", toggleGalleryItemStatus);

module.exports = router;
