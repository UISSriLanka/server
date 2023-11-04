const express = require("express");
const {
  getOldStudents,
  getOldStudentByID,
  addToOldStudent,
} = require("../controllers/oldStudentController");

const router = express.Router();

router.route("/").get(getOldStudents);
router.route("/:id").get(getOldStudentByID).delete(addToOldStudent);

module.exports = router;
