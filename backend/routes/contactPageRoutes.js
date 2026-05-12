const express = require("express");
const router = express.Router();
const contactPageController = require("../controllers/contactPageController");

router.get("/", contactPageController.getContactPage);
router.put("/", contactPageController.updateContactPage);

module.exports = router;
