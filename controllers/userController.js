const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");
const Staff = require("../models/staffModel");
const Admin = require("../models/adminModel");
const generateToken = require("../utils/generateToken");

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      const defaultAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        picture: "https://bootstrapious.com/i/snippets/sn-team/teacher-2.jpg",
        role: process.env.ADMIN_ROLE,
      });

      await defaultAdmin.save();
    }

    res.json({
      role: process.env.ADMIN_ROLE,
      picture: "https://bootstrapious.com/i/snippets/sn-team/teacher-2.jpg",
      token: generateToken("admin"),
    });
    return;
  }

  const student = await Student.findOne({ email });
  const staff = await Staff.findOne({ email });
  const admin = await Admin.findOne({ email });

  if (student && (await student.matchPassword(password))) {
    res.json({
      id: student._id,
      name: student.fullname,
      picture: student.picture,
      role: student.role,
      admissionNo: student.admission_no,
      token: generateToken(student._id),
    });
  } else if (staff && (await staff.matchPassword(password))) {
    res.json({
      id: staff._id,
      name: staff.fullname,
      picture: staff.picture,
      role: staff.role,
      employee_id: staff.employee_id,
      token: generateToken(staff._id),
    });
  } else if (admin && (await admin.matchPassword(password))) {
    res.json({
      id: admin._id,
      name: admin.fullname,
      picture: admin.picture,
      role: admin.role,
      employee_id: admin.employee_id,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or password");
  }
});

module.exports = { authUser };
