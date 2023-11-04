const mongoose = require("mongoose");

const timeTableSchema = new mongoose.Schema({
  weekday: {
    type: Number,
    required: true,
  },
  period: {
    type: Number,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  temp: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

module.exports = TimeTable;
