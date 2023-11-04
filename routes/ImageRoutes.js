const express = require("express");
const {
  getGallery,
  createGallery,
  getGalleryById,
  deleteGallery,
} = require("../controllers/ImageController");
const router = express.Router();

router.route("/get").get(getGallery);
router.route("/create").post(createGallery);
router.route("/:id").get(getGalleryById).delete(deleteGallery);

module.exports = router;
