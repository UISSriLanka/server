const express = require("express");
const {
    takeAttendance,
  getAttendanceByDate,
  deleteAttendance,
  getAttendanceByDateAndAdmissionNo,
} = require("../controllers/studentAttendanceController");
const router = express.Router();

router.route("/take").post(takeAttendance );
router.route("/getByDate").get(getAttendanceByDate);
router.route("/:id").delete(deleteAttendance);
router.route("/getByDateAndAdmissionNo").get(getAttendanceByDateAndAdmissionNo);

module.exports = router;

