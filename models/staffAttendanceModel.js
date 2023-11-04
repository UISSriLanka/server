// models/staffAttendanceModel.js

const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff', // Make sure this matches the name of your Staff schema,
  },
  date: {
    type: Date,
    required: true,
  },
  arrivedTime: {
    type: Date,
  },
  onTimeLate: {
    type: String, // "On-Time" or "Late"
  },
  present: {
    type: Boolean,
    default: false,
  },
});

const StaffAttendance = mongoose.model('StaffAttendance', staffAttendanceSchema);

module.exports = StaffAttendance;
