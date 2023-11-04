const express = require("express");
const {
  getAbsentStaff,
  resetRelief,
} = require("../controllers/reliefController");
const router = express.Router();

router.route("/").get(getAbsentStaff);
router.route("/reset").get(resetRelief);

module.exports = router;
