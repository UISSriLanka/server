const asyncHandler = require("express-async-handler");
const Attendance = require("../models/studentAttendanceModel");
const Student = require("../models/studentModel");

const takeAttendance = asyncHandler(async (req, res) => {
  const { admission_no } = req.body;

  // Check if the student exists
  const student = await Student.findOne({ admission_no });
  if (!student) {
    res.status(400).json({ message: "Please scan a Valid QR Code." });
    return;
  }

  const today = new Date();


  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");


  const date = `${year}-${month}-${day}`;

  const localTime = new Date(); 

  const onTimeLate = localTime.getHours() < 8 || (localTime.getHours() === 8 && localTime.getMinutes() <= 45)
    ? "On-Time"
    : "Late";

  // Check if attendance already recorded for this student today
  const existingAttendance = await Attendance.findOne({
    admission_no,
    date,
  });
  if (existingAttendance) {
    res.status(400).json({ message: "Record exists. Next student please." });
    return;
  }

  const newAttendance = new Attendance({
    admission_no,
    date, 
    arrivedTime: localTime,
    onTimeLate,
    present: true,
    student: student._id, 
  });

  await newAttendance.save();
  res.json({ message: `Welcome ${admission_no}, Next student please` });
});


const getAttendanceByDate = asyncHandler(async (req, res) => {
  const { date, grade } = req.query;

  try {
    const students = await Student.find({ grade });

    const attendancePromises = students.map(async (student) => {
      const attendance = await Attendance.findOne({
        admission_no: student.admission_no,
        date: { 
          $gte: new Date(date).setUTCHours(0, 0, 0, 0),
          $lte: new Date(date).setUTCHours(23, 59, 59, 999),
        },
      });
      return { student, attendance };
    });

    const attendanceData = await Promise.all(attendancePromises);

    res.json(attendanceData);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const deleteAttendance = asyncHandler(async (req, res) => {
  const attendanceId = req.params.id;

  try {
    await Attendance.findByIdAndDelete(attendanceId);
    res.json({ message: "Attendance record deleted successfully." });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const getAttendanceByDateAndAdmissionNo = asyncHandler(async (req, res) => {
  const { admission_no, date } = req.query;

  try {
    const student = await Student.findOne({ admission_no });

    if (!student) {
      res.status(400).json({ message: "Student not found." });
      return;
    }

    const selectedDate = new Date(date);
    const selectedYear = selectedDate.getUTCFullYear();
    const selectedMonth = selectedDate.getUTCMonth();

    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      admission_no,
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
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




module.exports = {
  takeAttendance,
  getAttendanceByDate,
  deleteAttendance,
  getAttendanceByDateAndAdmissionNo, // Add this line
};