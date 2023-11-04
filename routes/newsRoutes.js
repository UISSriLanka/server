const express = require("express");
const {
  getNews,
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const router = express.Router();

router.route("/").get(getNews);
router.route("/create").post(createNews);
router.route("/:id").get(getNewsById).put(updateNews).delete(deleteNews);

module.exports = router;
