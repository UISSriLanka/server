const Staff = require("../models/staffModel");

const asyncHandler = require("express-async-handler");

const getStaff = asyncHandler(async (req, res) => {
  const staff_s = await Staff.find();
  res.json(staff_s);
});

const createStaff = asyncHandler(async (req, res) => {
  const {
    fullname,
    first_name,
    last_name,
    address,
    dateOfBirth,
    phone,
    gender,
    picture,
    password,
    role,
    employee_id,
    email,
    epf_No,
    subjects_taught,
    // assigned_classes,
  } = req.body;

  if (
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
    !employee_id ||
    !email ||
    !epf_No ||
    !subjects_taught
    // !assigned_classes
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const employeeIDExists = await Staff.findOne({ employee_id });

  const emailExists = await Staff.findOne({ email });

  if (employeeIDExists) {
    res.status(400);
    throw new Error("Staff employee ID already exists");
  } else if (emailExists) {
    res.status(400);
    throw new Error("Email already exists");
  } else if (phone.length !== 10) {
    res.status(400);
    throw new Error("Phone number should contain only 10 digits");
  } else {
    const staff = new Staff({
      fullname,
      first_name,
      last_name,
      address,
      dateOfBirth,
      phone,
      gender,
      picture,
      password,
      role,
      employee_id,
      email,
      epf_No,
      subjects_taught,
      // assigned_classes,
    });

    const createdStaff = await staff.save();
    res.status(201).json(createdStaff);
  }
});

const getStaffById = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (staff) {
    res.json(staff);
  } else {
    res.status(404).json({ message: "Staff Not Found" });
  }
});

const updateStaff = asyncHandler(async (req, res) => {
  const {
    fullname,
    first_name,
    last_name,
    address,
    dateOfBirth,
    phone,
    gender,
    picture,
    password,
    role,
    employee_id,
    email,
    epf_No,
    subjects_taught,
    // assigned_classes,
  } = req.body;

  const staff = await Staff.findById(req.params.id);

  if (staff) {
    staff.fullname = fullname;
    staff.first_name = first_name;
    staff.last_name = last_name;
    staff.address = address;
    staff.dateOfBirth = dateOfBirth;
    staff.phone = phone;
    staff.gender = gender;
    staff.picture = picture;
    staff.password = password;
    staff.role = role;
    staff.employee_id = employee_id;
    staff.email = email;
    staff.epf_No = epf_No;
    staff.subjects_taught = subjects_taught;
    // staff.assigned_classes = assigned_classes;

    const employeeIDExists = await Staff.findOne({
      employee_id: { $regex: new RegExp(`^${employee_id}$`, "i") },
      _id: { $ne: staff },
    });

    const emailExists = await Staff.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
      _id: { $ne: staff },
    });

    if (employeeIDExists) {
      res.status(400);
      throw new Error("Staff employee ID already exists");
    } else if (emailExists) {
      res.status(400);
      throw new Error("Email already exists");
    } else if (phone.length !== 10) {
      res.status(400);
      throw new Error("Phone number should contain only 10 digits");
    } else {
      const updateStaff = await staff.save();
      res.json(updateStaff);
    }
  } else {
    res.status(404);
    throw new Error("Staff not found");
  }
});

const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (staff) {
    await staff.deleteOne();
    res.json({ message: "Staff Removed Successfully" });
  } else {
    res.status(404);
    throw new Error("Staff not found");
  }
});

module.exports = {
  getStaff,
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
};
