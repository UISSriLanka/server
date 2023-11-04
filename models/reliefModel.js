const mongoose = require("mongoose");

const reliefSchema = new mongoose.Schema({
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
    type: String,
    default: "Relief",
  },
});

reliefSchema.index({ weekday: 1, period: 1, grade: 1 }, { unique: true });

const Relief = mongoose.model("Relief", reliefSchema);

module.exports = Relief;
