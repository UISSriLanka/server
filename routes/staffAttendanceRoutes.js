const express = require("express");
const router = express.Router();
const {
  takeStaffAttendance,
  getStaffAttendanceByDate,
  deleteStaffAttendance,
  getAttendanceByMonthYearAndEmployeeId,
} = require("../controllers/staffAttendanceController");

router.route("/take").post(takeStaffAttendance);
router.route("/getByDate").get(getStaffAttendanceByDate);
router.route("/:id").delete(deleteStaffAttendance);
router.route("/getByMonthYear").get(getAttendanceByMonthYearAndEmployeeId);

module.exports = router;
