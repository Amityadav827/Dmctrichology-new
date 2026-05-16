const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogCategories,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/categories", getBlogCategories);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.get("/slug/:slug", getBlogBySlug);

router.use(protect, adminOnly);

const uploadFields = upload.fields([
  { name: "blogImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

router.post("/", uploadFields, createBlog);
router.route("/:id").put(uploadFields, updateBlog).delete(deleteBlog);

module.exports = router;
