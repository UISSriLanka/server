const Subject = require("../models/subjectModel");

const asyncHandler = require("express-async-handler");

const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

const createSubjects = asyncHandler(async (req, res) => {
  const { subject_id, subject_name, staff_name } = req.body;

  if (!subject_id || !subject_name || !staff_name) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const subjectIdExits = await Subject.findOne({
    subject_id: { $regex: new RegExp(`^${subject_id}$`, "i") },
  });
  if (subjectIdExits) {
    res.status(400);
    throw new Error("Subject ID already exists");
  }

  const subject = new Subject({
    subject_id,
    subject_name,
    staff_name,
  });

  const createdSubject = await subject.save();

  res.status(201).json(createdSubject);
});

const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (subject) {
    res.json(subject);
  } else {
    res.status(404).json({ message: "Subject Not Found" });
  }
});

const updateSubject = asyncHandler(async (req, res) => {
  const { subject_id, subject_name, staff_name } = req.body;

  const subject = await Subject.findById(req.params.id);

  if (subject) {
    subject.subject_id = subject_id;
    subject.subject_name = subject_name;
    subject.staff_name = staff_name;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } else {
    res.status(404);
    throw new Error("Subject not found");
  }
});

const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (subject) {
    await subject.deleteOne();
    res.json({ message: "Subject Removed Successfully" });
  } else {
    res.status(404);
    throw new Error("Subject not found");
  }
});

module.exports = {
  getSubjects,
  createSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
