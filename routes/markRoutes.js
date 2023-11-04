const express = require("express");
const router = express.Router();
const {
  saveMarks,
  getStudentMarksByID,
  getMarks,
  getStudentMarksByParams,
  getStudentMarksByGrade,
  getStudentMarksByTerm,
  editMarks,
} = require("../controllers/markContoller");

router.route("/").get(getMarks);
router.route("/:year/:term/:subject/:grade/create").post(saveMarks);
router.route("/:year/:term/:id").get(getStudentMarksByID);
router.route("/class/:year/:term/:grade").get(getStudentMarksByGrade);
router.route("/terms/:year/:grade/:subject").get(getStudentMarksByTerm);
router.route("/viewmarks/:year/:term/:subject/:grade").get(getStudentMarksByParams).put(editMarks);

module.exports = router;
