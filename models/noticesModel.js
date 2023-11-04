const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  recipientType: {
    type: String,
    enum: ["Teacher", "Student"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  file: {
    type: String, //store the path to the uploaded file on the server
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
