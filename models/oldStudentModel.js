const mongoose = require("mongoose");

const oldStudentSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },

  admission_no: {
    type: String,
    required: true,
  },
  parent_Name: {
    type: String,
  },
  parent_occupation: {
    type: String,
  },
  admission_year: {
    type: Date,
    required: true,
  },
  grade: {
    type: Number,
    default: 0,
  },
  c_grade: {
    type: Number,
    required: true,
  },
  extra_activities: {
    type: String,
    required: true,
  },
  leaving: {
    type: Boolean,
    default: false,
  },
});

const OldStudent = mongoose.model("OldStudent", oldStudentSchema);

module.exports = OldStudent;
