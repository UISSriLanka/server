const asyncHandler = require("express-async-handler");
const StaffAttendance = require("../models/staffAttendanceModel");
const Staff = require("../models/staffModel");

const takeStaffAttendance = asyncHandler(async (req, res) => {
  const { employee_id } = req.body;

  // Check if the staff exists
  const staff = await Staff.findOne( {employee_id});
  if (!staff) { 
    res.status(400).json({ message: "Please scan a Valid QR Code." });
    return;
  }

  const today = new Date();
  const date = today.toISOString().substr(0, 10);

  const localTime = new Date();
  const onTimeLate =
    localTime.getHours() < 8 || (localTime.getHours() === 8 && localTime.getMinutes() <= 45)
      ? "On-Time"
      : "Late";

  // Check if attendance already recorded for this staff today
  const existingAttendance = await StaffAttendance.findOne({
    employee_id,
    date,
  });
  if (existingAttendance) {
    res.status(400).json({ message: "Record exists. Next staff please." });
    return;
  }

  const newAttendance = new StaffAttendance({
    employee_id,
    staff: staff._id,
    date,
    arrivedTime: localTime,
    onTimeLate,
    present: true,
  });

  await newAttendance.save();
  res.json({ message: `Welcome ${staff.employee_id}, Next staff please` });
});

const getStaffAttendanceByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  try {
    const staffs = await Staff.find();

    const attendancePromises = staffs.map(async (staff) => {
      const attendance = await StaffAttendance.findOne({
        staff: staff._id,
        date,
      });
      return { staff, attendance };
    });

    const attendanceData = await Promise.all(attendancePromises);

    res.json(attendanceData);
  } catch (error) {
    console.error("Error fetching staff attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const deleteStaffAttendance = asyncHandler(async (req, res) => {
  const attendanceId = req.params.id;

  try {
    await StaffAttendance.findByIdAndDelete(attendanceId);
    res.json({ message: "Attendance record deleted successfully." });
  } catch (error) {
    console.error("Error deleting staff attendance record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getAttendanceByMonthYearAndEmployeeId = asyncHandler(async (req, res) => {
  // const { employee_id, month, year } = req.query;

  // try {
  //   const startDate = new Date(year, month, 1);
  //   const endDate = new Date(year, month + 1, 0);
  //   endDate.setUTCHours(23, 59, 59, 999);

  //   const attendanceRecords = await StaffAttendance.find({
  //     employee_id,
  //     date: {
  //       $gte: startDate,
  //       $lte: endDate,
  //     },
  //   });

  //   res.json(attendanceRecords);
  // } catch (error) {
  //   console.error("Error fetching staff attendance:", error);
  //   res.status(500).json({ message: "Internal Server Error" });
  // }
  const { employee_id, date } = req.query;

  try {
    const staff = await Staff.findOne({ employee_id });

    if (!staff) {
      res.status(400).json({ message: "Staff not found." });
      return;
    }

    const selectedDate = new Date(date);
    const selectedYear = selectedDate.getUTCFullYear();
    const selectedMonth = selectedDate.getUTCMonth();

    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const attendance = await StaffAttendance.find({
      employee_id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (!attendance) {
      res.status(404).json({ message: "Attendance not found." });
      return;
    }

    res.json(attendance);
  } catch (error) {
    console.error("Error fetching staff attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = {
  takeStaffAttendance,
  getStaffAttendanceByDate,
  deleteStaffAttendance,
  getAttendanceByMonthYearAndEmployeeId
};
