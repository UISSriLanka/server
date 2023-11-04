const Student = require("../models/studentModel");
const OldStudent = require("../models/oldStudentModel");
const asyncHandler = require("express-async-handler");

const getOldStudents = asyncHandler(async (req, res) => {
  const oldStudents = await OldStudent.find();
  res.json(oldStudents);
});

const getOldStudentByID = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Student Not Found" });
  }
});

const addToOldStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const oldStudent = new OldStudent({
      fullname: student.fullname,
      first_name: student.fullname,
      last_name: student.last_name,
      address: student.address,
      dateOfBirth: student.dateOfBirth,
      phone: student.phone,
      gender: student.gender,
      picture: student.picture,
      admission_no: student.admission_no,
      parent_Name: student.parent_Name,
      parent_occupation: student.parent_occupation,
      admission_year: student.admission_year,
      c_grade: student.grade,
      extra_activities: student.extra_activities,
    });

    await oldStudent.save();
    await Student.findByIdAndDelete(studentId);

    res.json({ message: "Student moved to old student table" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Error deleting student" });
  }
});

module.exports = {
  getOldStudents,
  getOldStudentByID,
  addToOldStudent,
};
