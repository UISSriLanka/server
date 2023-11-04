const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_id: {
    type: String,
    required: true,
    unique: true,
  },
  subject_name: {
    type: String,
    required: true,
  },
  staff_name: [
    {
      type: String,
      required: true,
    },
  ],
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
