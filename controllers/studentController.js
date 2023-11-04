const Student = require("../models/studentModel");
const asyncHandler = require("express-async-handler");

const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

const createStudents = asyncHandler(async (req, res) => {
  const {
    admission_no,
    fullname,
    first_name,
    last_name,
    address,
    dateOfBirth,
    phone,
    gender,
    picture,
    email,
    password,
    role,
    details,
    parent_Name,
    parent_occupation,
    admission_year,
    grade,
    admitted_grade,
    extra_activities,
    conduct,
    special_aptitudes,
    remark,
  } = req.body;

  if (
    !admission_no ||
    !fullname ||
    !first_name ||
    !last_name ||
    !address ||
    !dateOfBirth ||
    !phone ||
    !gender ||
    !picture ||
    !password ||
    !role ||
    !email ||
    !details ||
    !parent_Name ||
    !parent_occupation ||
    !admission_year ||
    !grade ||
    !admitted_grade
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userAdmissionExists = await Student.findOne({
    admission_no: { $regex: new RegExp(`^${admission_no}$`, "i") },
  });

  const emailExists = await Student.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });

  if (userAdmissionExists) {
    res.status(400);
    throw new Error("Admission number already exists");
  } else if (emailExists) {
    res.status(400);
    throw new Error("Email already exists");
  } else if (phone.length !== 10) {
    res.status(400);
    throw new Error("Phone number should contain only 10 digits");
  } else {
    const student = new Student({
      fullname,
      first_name,
      last_name,
      address,
      dateOfBirth,
      phone,
      gender,
      picture,
      email,
      password,
      role,
      admission_no,
      details,
      parent_Name,
      parent_occupation,
      admission_year,
      grade,
      admitted_grade,
      extra_activities,
      conduct,
      special_aptitudes,
      remark,
    });
    const createdStudent = await student.save();

    res.status(201).json(createdStudent);
  }
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Student Not Found" });
  }
});

const updateStudent = asyncHandler(async (req, res) => {
  const {
    admission_no,
    fullname,
    first_name,
    last_name,
    address,
    dateOfBirth,
    phone,
    gender,
    picture,
    email,
    password,
    role,
    details,
    parent_Name,
    parent_occupation,
    admission_year,
    grade,
    admitted_grade,
    extra_activities,
    conduct,
    special_aptitudes,
    remark,
  } = req.body;

  const student = await Student.findById(req.params.id);

  if (student) {
    student.admission_no = admission_no;
    student.fullname = fullname;
    student.first_name = first_name;
    student.last_name = last_name;
    student.address = address;
    student.dateOfBirth = dateOfBirth;
    student.phone = phone;
    student.gender = gender;
    student.picture = picture;
    student.email = email;
    student.password = password;
    student.role = role;
    student.details = details;
    student.parent_Name = parent_Name;
    student.parent_occupation = parent_occupation;
    student.admission_year = admission_year;
    student.grade = grade;
    student.admitted_grade = admitted_grade;
    student.extra_activities = extra_activities;
    student.conduct = conduct;
    student.special_aptitudes = special_aptitudes;
    student.remark = remark;

    const admissionNumberExists = await Student.findOne({
      admission_no: { $regex: new RegExp(`^${admission_no}$`, "i") },
      _id: { $ne: student },
    });

    const emailExists = await Student.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
      _id: { $ne: student },
    });

    if (admissionNumberExists) {
      res.status(400);
      throw new Error("Admission number already exists");
    } else if (emailExists) {
      res.status(400);
      throw new Error("Email already exists");
    } else if (phone.length !== 10) {
      res.status(400);
      throw new Error("Phone number should contain only 10 digits");
    } else {
      const updatedStudent = await student.save();
      res.json(updatedStudent);
    }
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student) {
    await student.deleteOne();
    res.json({ message: "Student Removed Successfully" });
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

const getStudentsByGrade = asyncHandler(async (req, res) => {
  const students = await Student.find({ grade: req.params.grade });

  if (students.length > 0) {
    res.json(students);
  } else {
    res.status(404).json({ message: "No Students Found for this grade" });
  }
});

module.exports = {
  getStudents,
  createStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByGrade,
};
