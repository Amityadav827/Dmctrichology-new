const express = require("express");
const { 
  createComment, 
  getCommentsBySlug,
  getAllCommentsAdmin,
  updateCommentStatusAdmin,
  deleteCommentAdmin
} = require("../controllers/commentController");

const router = express.Router();

// Admin routes (Must come BEFORE dynamic /:slug route)
router.get("/admin/all", getAllCommentsAdmin);
router.patch("/admin/:id", updateCommentStatusAdmin);
router.delete("/admin/:id", deleteCommentAdmin);

// Public routes
router.get("/:slug", getCommentsBySlug);
router.post("/", createComment);

module.exports = router;
